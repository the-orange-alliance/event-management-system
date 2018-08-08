import React, { Component } from "react";
import LoginView from "./views/login/login-view";
import {Route} from "react-router-dom";
import HeadRefereeView from "./views/referee/head-referee-view";
import RedRefereeView from "./views/referee/red-referee-view";
import BlueRefereeView from "./views/referee/blue-referee-view";
import cookie from "react-cookies";
import {enableSlaveMode, initializeVariables, SOCKET_SERVER, LOCAL_PROVIDER} from "./shared/AppConstants";
import {changeHostAddress} from "./shared/AppConstants";

class App extends Component {

	constructor() {
		super();

		if (cookie.load("host")) {
			changeHostAddress(cookie.load("host"));
		} else {
		  changeHostAddress("192.168.1.54");
		}

		this.socket = SOCKET_SERVER;

		this.state = {                     /* All arrays formatted: [red, blue] */
			freshTablet: true, /*Never updated anything itself, just loaded. */
			matchName: -1,
			connected: this.socket.connected, /*TODO - update these based upon socket*/
			matchStatus: "WAITING...",
			powerlines: [[false, false, false, false],[false, false, false, false]], /*Wind Reactor Combustion Coop*/

			/*Time-based points*/
			panelArray: [[false, false, false, false, false],
							 		 [false, false, false, false, false]],
			filled: [[false, false, false, false, false,
							  false, false, false, false, false],
							 [false, false, false, false, false,
				 			  false, false, false, false, false]],

			isCranked: [false, false], /*Wind cranked?*/

			/*Non-time-based points*/
			cubes: [[0, 0],[0, 0]], /*low-red high-red, low-blue high-blue */
			botsParked: [[false, false, false],[false, false, false]],
			yellowCards: [[0, 0, 0],[0, 0, 0]],
			redCards: [[0, 0, 0],[0, 0, 0]],
			redAlliance: ["C1", "C2", "C3"],
			blueAlliance: ["C4", "C5", "C6"],
			scores: [0, 0],
			slaveInstance: 1
		};

		this.socket.on("connect", () => {
			console.log("Connected");
      this.setState({connected: true});
			this.socket.emit("identify", ["referee-tablet", "referee", "scoring", "event"]);
			setTimeout(() => {
        this.socket.emit("freshTablet",{});
      }, 250);
		});
		this.socket.on("disconnect", () => {
			console.log("Disconnected");
			this.setState({connected: false});
		});
		this.socket.on("match-start", () => {
			this.setState({matchStatus: "PLAYING", freshTablet: true});
		});
		this.socket.on("match-end", () => {
			this.setState({matchStatus: "ENDED"});
		});
		this.socket.on("match-abort", () => {
			this.setState({matchStatus: "E-STOPPED"});
		});
		this.socket.on("match-commit", () => {
			this.setState({matchStatus: "COMMITTED"});
		});
		this.socket.on("prestart", () => {
			this.setState({matchStatus: "PRESTART"});
			this.getTeams().then((response) => {
				let teams = response;
				let red = ["C1", "C2", "C3"];
				let blue = ["C4", "C5", "C6"];

				if(teams !== null && teams !== undefined) {
					red = [teams[0], teams[1], teams[2]];
					blue = [teams[3], teams[4], teams[5]];
				}
				this.setState({redAlliance: red, blueAlliance: blue});
				// console.log("teams at state change: ", red, " ", blue);
			}).catch((err) => {
				console.error(err);
			});
			this.getMatchName().then((response) => {
				let matchName = -1;
				if(response !== null && response !== undefined) {
					matchName = response;
				}
				this.setState({matchName: matchName});
			}).catch((err) => {
				console.error(err);
			});
		});

		this.socket.on("enter-slave", (hostIP) => {
			console.log("Enabling slave mode...");
			setTimeout(() => {
				enableSlaveMode(hostIP);
				console.log("Slave mode enabled on host " + hostIP);
				this.setState({
					slaveInstance: 2 // TODO - If more than 2 matches, how do we determine this? DB?
				});
			}, 1000);
		});

		this.socket.on("onScoreUpdate", (basicMatchModel) => {
			let scores = this.state.scores;
			scores[0] = basicMatchModel["red"].score;
			scores[1] = basicMatchModel["blue"].score;
			console.log("Scores: ", scores);
			this.setState({scores: scores});
		});

		this.socket.on("onFreshTablet", (obj) => {
			// console.log("Got onFreshTablet.");
			if(this.state.freshTablet) {
				console.log("Fresh tablet loading. Setting state appropriately.");
				// console.log("Red Powerlines: ", [this.createBool(obj.md["red"].wind_powerline_activated), this.createBool(obj.md["red"].reactor_powerline), this.createBool(obj.md["red"].combustion_powerline), this.createBool(obj.md["red"].coopertition_bonus)]);
				let state = this.state;
				state.freshTablet = false;
				state.powerlines = [[this.createBool(obj.md["red"].wind_powerline_activated), this.createBool(obj.md["red"].reactor_powerline), this.createBool(obj.md["red"].combustion_powerline), this.createBool(obj.md["red"].coopertition_bonus)],
														[this.createBool(obj.md["blue"].wind_powerline_activated), this.createBool(obj.md["blue"].reactor_powerline), this.createBool(obj.md["blue"].combustion_powerline), this.createBool(obj.md["blue"].coopertition_bonus)]];
				state.panelArray = [[this.createBool(obj.md["red"].solar_panel_one_ownership), this.createBool(obj.md["red"].solar_panel_two_ownership), this.createBool(obj.md["red"].solar_panel_three_ownership), this.createBool(obj.md["red"].solar_panel_four_ownership), this.createBool(obj.md["red"].solar_panel_five_ownership)],
														[this.createBool(obj.md["blue"].solar_panel_one_ownership), this.createBool(obj.md["blue"].solar_panel_two_ownership), this.createBool(obj.md["blue"].solar_panel_three_ownership), this.createBool(obj.md["blue"].solar_panel_four_ownership), this.createBool(obj.md["blue"].solar_panel_five_ownership)]];
				state.isCranked = [this.createBool(obj.md["red"].wind_turbine_cranked), this.createBool(obj.md["blue"].wind_turbine_cranked)];
				state.cubes = [[obj.md["red"].combustion_low, obj.md["red"].combustion_high], [obj.md["blue"].combustion_low, obj.md["blue"].combustion_high]];
				state.filled = obj.prevReactor;
				state.botsParked = obj.prevBotsParked;
				state.yellowCards = obj.prevYellowCards;
				state.redCards = obj.prevRedCards;
				state.scores = obj.scores;
				state.matchStatus = obj.status;
				console.log("status: ", state.matchStatus);
				this.getTeams().then((response) => {
					let teams = response;
					if(teams !== null && teams !== undefined) {
						state.redAlliance = [teams[0], teams[1], teams[2]];
						state.blueAlliance = [teams[3], teams[4], teams[5]];
						this.setState(state);
					}
				}).catch((err) => {
					console.error(err);
				});
				this.getMatchName().then((response) => {
					if(response !== null && response !== undefined) {
						state.matchName = response;
						this.setState(state);
					}
				}).catch((err) => {
					console.error(err);
				});
				console.log("setting states");

			}
		});

		//live updater functions below: they 1) connect app's data to children w/o children needing their own states, and 2) sync up all ref tablets to same data.
		this.socket.on("onReactorCubes", (obj) => {
			let filled = this.state.filled;
			if(obj.alliance === "red") {
				// console.log("Fuel grid update from red. Red will be set to: ", obj.cubes);
				filled[0] = obj.cubes;
				filled[1] = [obj.cubes[3], obj.cubes[2], obj.cubes[1], obj.cubes[0], obj.cubes[7], obj.cubes[6], obj.cubes[5], obj.cubes[4]];
				// console.log("Blue will be set to: ", filled[1]);
			} else {
				// console.log("Fuel grid update from blue. Blue will be set to: ", obj.cubes);
				filled[1] = obj.cubes;
				filled[0] = [obj.cubes[3], obj.cubes[2], obj.cubes[1], obj.cubes[0], obj.cubes[7], obj.cubes[6], obj.cubes[5], obj.cubes[4]];
				// console.log("Red will be set to: ", filled[0]);
			}
			this.setState({filled: filled});
		});

		this.socket.on("onPowerlineUpdate", (obj) => {
			let powerlines = this.state.powerlines;
			powerlines[obj.alliance_index][obj.resource] = obj.value;
			this.setState({powerlines: powerlines});
			// console.log("App powerlines now: ", this.state.powerlines);
		});

		this.socket.on("onWindCrank", (obj) => {
			// console.log("Received value for crank: ", obj.value);
			let cranked = this.state.isCranked;
			cranked[obj.alliance_index] = obj.value;
			this.setState({isCranked: cranked});
			// console.log("App cranked now: ", this.state.isCranked);
		});

		this.socket.on("onSolar", (obj) => {
			// console.log("Received value for panel: ", obj.value);
			let panelArray = this.state.panelArray;
			panelArray[obj.alliance_index][obj.panel_index] = obj.value;
			this.setState({panelArray: panelArray});
			// console.log("App panels now: ", this.state.panelArray);
		});

		this.socket.on("onLowCoal", (obj) => {
			// console.log("Received add value for low combustion", obj.add);
			let cubes = this.state.cubes;
			if(obj.add) {
				cubes[obj.alliance_index][0]++;
			} else {
				cubes[obj.alliance_index][0]--;
			}
			this.setState({combustion_low: cubes});
			// console.log("Combustion now: ", this.state.cubes);
		});

		this.socket.on("onHighCoal", (obj) => {
			// console.log("Received add value for high combustion: ", obj.add);
			let cubes = this.state.cubes;
			if(obj.add) {
				cubes[obj.alliance_index][1]++;
			} else {
				cubes[obj.alliance_index][1]--;
			}
			this.setState({combustion_low: cubes});
			// console.log("Combustion now: ", this.state.cubes);
		});

		this.socket.on("onModifyCard", (obj) => {
			// console.log("Received penalty update. Card ID: ", obj.cardID, " Team index: ", obj.team_index);
			if(obj.cardId === 1) {
				let yellowCards = this.state.yellowCards;
				yellowCards[obj.alliance_index][obj.team_index]++;
				this.setState({yellowCards: yellowCards});
			} else {
				let redCards = this.state.redCards;
				redCards[obj.alliance_index][obj.team_index]++;
				this.setState({redCards: redCards});
			}
			// console.log("YC now: ", this.state.yellowCards, "RC now: ", this.state.redCards);
		});

		this.socket.on("onParked", (obj) => {
				// console.log("Received parked update: ", obj.botsParked);
				let botsParked = this.state.botsParked;
				botsParked[obj.alliance_index] = obj.botsParked;
				this.setState({botsParked: botsParked});
				// console.log("Parked now: ", this.state.botsParked);
			});

		initializeVariables();
	}

	componentWillMount() {
		if (!cookie.load("user_pin") || cookie.load("user_pin") !== "1234") {
			let pin = window.prompt("Please enter your 4-digit PIN.");
			cookie.save("user_pin", pin);
			if (pin !== "1234") {
				window.alert("Access denied");
				SOCKET_SERVER.close();
			}
		}
	}

	getTeams() {
		let teams;
		let key;
		let teamArr = [];
		return new Promise((resolve, reject) => {
			LOCAL_PROVIDER.getActiveMatch().then((response) => {
				key = response.data.payload[0].match_key;

				LOCAL_PROVIDER.getMatchParticipants(key).then((response) => {
					teams = response.data.payload;
					for(let i = 0; i < teams.length; i++) {
						teamArr.push(teams[i].team_key.toString());
					}
					resolve(teamArr);
				}).catch((err) => {
					reject(err);
				});
			}).catch((err) => {
				reject(err);
			});
		});
	}

	getMatchName() {
		let matchName;
		return new Promise((resolve, reject) => {
			LOCAL_PROVIDER.getActiveMatch().then((response) => {
				matchName = response.data.payload[0].match_name.toString();
					resolve(matchName);
			}).catch((err) => {
				reject(err);
			});
		});
	}

	createBool(i) {
		if(i) {
			return true;
		}
		return false;
	}

	componentWillUnmount() {
		this.socket.off("connected");
		this.socket.off("disconnected");
		this.socket.off("onMatchPrestart");
		this.socket.off("onMatchStart");
		this.socket.off("onMatchEnd");
		this.socket.off("onMatchAbort");
		this.socket.off("onMatchCommit");
		this.socket.off("enableSlaveMode");
		this.socket.off("onScoreUpdate");
		this.socket.off("onFreshTablet");
		this.socket.off("onReactorCubes");
		this.socket.off("onPowerlineUpdate");
		this.socket.off("onWindCrank");
		this.socket.off("onSolar");
		this.socket.off("onLowCoal");
		this.socket.off("onHighCoal");
		this.socket.off("onModifyCard");
		this.socket.off("onParked");
	}

	handleLogin(type, props) {
		// TODO - Make sure that this is a valid connection.
		if(type === 0) {
			props.history.push("/red-view");
		} else if(type === 1) {
			props.history.push("/blue-view");
		} else {
			props.history.push("/head-view");
		}
		/*what screen do we need for head ref? */
	}

	emitData(message, obj) {
		this.socket.emit(message, obj);
	}

	render() {
		return (
			<div>
				<Route exact path="/" render={(props) => <LoginView connected={this.state.connected} onLogin={(type) => this.handleLogin(type, props)} />} />
				<Route path="/red-view" render={() => <RedRefereeView emitData={this.emitData.bind(this)} parentState={this.state} />} />
				<Route path="/blue-view" render={() => <BlueRefereeView emitData={this.emitData.bind(this)} parentState={this.state} />} />
				<Route path="/head-view" render={() => <HeadRefereeView emitData={this.emitData.bind(this)} parentState={this.state} />} />
			</div>
		);
	}
}

export default App;
