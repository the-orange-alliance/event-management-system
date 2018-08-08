import React, {Component} from "react";
import "./red-referee-view.css";
import ButtonGrid from './components/button-grid';
import PowerlineCubes from './components/powerline-cubes';
import SolarArray from './components/solar-array';
import SideCounter from './components/side-counter';
import RoundedToggle from './components/rounded-toggle';
import Penalties from './components/penalties';
import ParkReport from './components/park-report';

const RED = "red";

class RedRefereeView extends Component {

	handleUpdatePowerlines(index) {
		let powerlines = this.props.parentState.powerlines[0];
		powerlines[index] = !powerlines[index];
		// console.log("Red powerlines updated to ", powerlines);

		switch (index) {
			case 0:
				this.props.emitData("windLine", {val: powerlines[0], alliance: RED});
				break;
			case 1:
				this.props.emitData("reactorLine", {val: powerlines[1], alliance: RED});
				break;
			case 2:
				this.props.emitData("combustionLine", {val: powerlines[2], alliance: RED});
				break;
			case 3:
				this.props.emitData("coopLine", {val: powerlines[3], alliance: RED});
				break;
		}
	}

	handleCranked() {
		this.props.emitData("windCrank", {val: !this.props.parentState.isCranked[0], alliance: RED});
	}

	handleSolarUpdate(panels, add, index) {
		let panelArray = this.props.parentState.panelArray;
		panelArray[0] = panels;
		this.props.emitData("solar", {add: add, alliance: RED, index: index});
	}

	handleCombustionUpdate(isAdd, currentCubes, i) { /* how many?, are they low or high? */
		if(i === 0) {
			this.props.emitData("lowCoal", {add: isAdd, alliance: RED});
		} else {
			this.props.emitData("highCoal", {add: isAdd, alliance: RED});
		}
	}

	handleParked(botsParked, add) {
		this.props.emitData("parked", {add: add, botsParked: botsParked, alliance: RED});
	}

	handleUpdateGrid(index) {
		let filled = this.props.parentState.filled[0];
		filled[index] = !filled[index];
		this.props.emitData("reactorCubes", {alliance: RED, cubes: filled});
	}

	handlePenaltyAssignment(selectors, alliance_index) {
		let alliance_str = (alliance_index == 1) ? "blue" : "red";
		for(var i = 0; i < 3; i++) {
			switch(selectors[i]) {
				case 1:
					this.props.emitData("modifyFoul", {alliance_str: RED, value: 1});
					this.props.emitData("modifyCard", {alliance_index: 0, team: i, cardId: 1});
					break;
				case 2:
					this.props.emitData("modifyTechFoul", {alliance_str: RED, value: 1});
					this.props.emitData("modifyCard", {alliance_index: 0, team: i, cardId: 2});
					break;
			}
		}
	}

	render() {
		return (
			<div className="red-rv">
				<div className="red-rv-info-bar">
					<div>{"Match: " + this.props.parentState.matchName}</div>
					<div>{"Status: "}
						<red-text>{this.props.parentState.matchStatus}</red-text>
					</div>
					<div>{"Connected: " + this.props.parentState.connected}</div>
				</div>
      	<header className="red-rv-header">
        	  <h1 className="red-rv-title">RED ALLIANCE</h1>
      	</header>
				<PowerlineCubes alliance="red" gridToParent={this.handleUpdatePowerlines.bind(this)} crankedToParent={this.handleCranked.bind(this)} cubes={this.props.parentState.powerlines[0]} isCranked={this.props.parentState.isCranked[0]}/>
				<div className="red-rv-row">
					<ButtonGrid gridToParent={this.handleUpdateGrid.bind(this)} parentData={this.props.parentState.filled[0]} />
					<SideCounter color="red" scoreUpdate={this.handleCombustionUpdate.bind(this)} cubes={this.props.parentState.cubes[0]} min="0" max="48"/>
				</div>
				<SolarArray alliance="red" gridToParent={this.handleSolarUpdate.bind(this)} panelArray={this.props.parentState.panelArray[0]} />
				<Penalties alliance={0} teams={this.props.parentState.redAlliance} yellowCards={this.props.parentState.yellowCards[0]} redCards={this.props.parentState.redCards[0]} handlePenaltyAssignment={this.handlePenaltyAssignment.bind(this)} />
				<ParkReport teams={this.props.parentState.redAlliance} botsParked={this.props.parentState.botsParked[0]} updateParent={this.handleParked.bind(this)}/>
			</div>

		);
	}
}

export default RedRefereeView;
