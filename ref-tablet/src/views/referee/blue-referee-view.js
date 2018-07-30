import React, {Component} from "react";
import "./blue-referee-view.css";
import ButtonGrid from './components/button-grid';
import PowerlineCubes from './components/powerline-cubes';
import SolarArray from './components/solar-array';
import SideCounter from './components/side-counter';
import RoundedToggle from './components/rounded-toggle';
import Penalties from './components/penalties';
import ParkReport from './components/park-report';

const BLUE = "blue";

class BlueRefereeView extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selector: [0, 0, 0]
		};
}

	handleUpdatePowerlines(index) {
		let powerlines = this.props.parentState.powerlines[1];
		powerlines[index] = !powerlines[index];
		// console.log("Blue powerlines updated to ", powerlines);

		switch (index) {
			case 0:
				this.props.emitData("windLine", {val: powerlines[0], alliance: BLUE});
				break;
			case 1:
				this.props.emitData("reactorLine", {val: powerlines[1], alliance: BLUE});
				break;
			case 2:
				this.props.emitData("combustionLine", {val: powerlines[2], alliance: BLUE});
				break;
			case 3:
				this.props.emitData("coopLine", {val: powerlines[3], alliance: BLUE});
				break;
		}
	}

	handleCranked() {
		this.props.emitData("windCrank", {val: !this.props.parentState.isCranked[1], alliance: BLUE});
	}

	handleSolarUpdate(panels, add, index) {
		let panelArray = this.props.parentState.panelArray;
		panelArray[1] = panels;
		this.props.emitData("solar", {add: add, alliance: BLUE, index: index});
	}

	handleCombustionUpdate(isAdd, currentCubes, i) { /* how many?, are they low or high? */
		if(i === 0) {
			this.props.emitData("lowCoal", {add: isAdd, alliance: BLUE});
		} else {
			this.props.emitData("highCoal", {add: isAdd, alliance: BLUE});
		}
	}

	handleParked(botsParked, add) {
		this.props.emitData("parked", {add: add, botsParked: botsParked, alliance: BLUE});
	}

	handleUpdateGrid(index) {
		let filled = this.props.parentState.filled[1];
		filled[index] = !filled[index];
		this.props.emitData("reactorCubes", {alliance: BLUE, cubes: filled});
	}

	handlePenaltyAssignment(selector, alliance) {
		var state = this.state;
		state.selector = selector;
		for(var i = 0; i < 3; i++) {
			switch(state.selector[i]) {
				case 0:
					/* Do nothing */
					break;
				case 1:
					this.props.emitData("modifyFoul", {alliance: BLUE, value: 1});
					this.props.emitData("modifyCard", {team: (i+3), cardId: 1});
					break;
				case 2:
					this.props.emitData("modifyTechFoul", {alliance: BLUE, value: 1});
					this.props.emitData("modifyCard", {team: (i+3), cardId: 2});
					break;
			}
		}
		state.selector = [0, 0, 0];
		this.setState(state);
	}

	render() {
		return (
			<div className="blue-rv">
				<div className="blue-rv-info-bar">
					<div>{"Match: " + this.props.parentState.matchName}</div>
					<div>{"Status: "}
						<red-text>{this.props.parentState.matchStatus}</red-text>
					</div>
					<div>{"Connected: " + this.props.parentState.connected}</div>
				</div>
				<header className="blue-rv-header">
        	  <h1 className="blue-rv-title">BLUE ALLIANCE</h1>
      	</header>
				<PowerlineCubes alliance="blue" gridToParent={this.handleUpdatePowerlines.bind(this)} crankedToParent={this.handleCranked.bind(this)} cubes={this.props.parentState.powerlines[1]} isCranked={this.props.parentState.isCranked[1]}/>
				<div className="blue-rv-row">
					<ButtonGrid gridToParent={this.handleUpdateGrid.bind(this)} parentData={this.props.parentState.filled[1]} />
					<SideCounter color="blue" scoreUpdate={this.handleCombustionUpdate.bind(this)} cubes={this.props.parentState.cubes[1]} min="0" max="48"/>
				</div>
				<SolarArray gridToParent={this.handleSolarUpdate.bind(this)} panelArray={this.props.parentState.panelArray[1]} />
				<Penalties alliance={1} teams={this.props.parentState.blueAlliance} yellowCards={this.props.parentState.yellowCards[1]} redCards={this.props.parentState.redCards[1]} selector={this.state.selector} handlePenaltyAssignment={this.handlePenaltyAssignment.bind(this)} />
				<ParkReport teams={this.props.parentState.blueAlliance} botsParked={this.props.parentState.botsParked[1]} updateParent={this.handleParked.bind(this)}/>
			</div>

		);
	}
}

export default BlueRefereeView;
