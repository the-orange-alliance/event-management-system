import React, {Component} from "react";
import {Link} from "react-router-dom";
import "./head-referee-view.css";
import Penalties from './components/penalties';
import ScoreBox from "./components/score-box";
import HeadRefLink from "./components/head-ref-link";

const RED = "red";

class HeadRefereeView extends Component {

	handlePenaltyAssignment(selectors, alliance_index) {
		let alliance_str = (alliance_index == 1) ? "blue" : "red";
		for(var i = 0; i < 3; i++) {
			switch(selectors[i]) {
				case 1:
					this.props.emitData("modifyFoul", {alliance_str: alliance_str, value: 1});
					this.props.emitData("modifyCard", {alliance_index: alliance_index, team: i, cardId: 1});
					break;
				case 2:
					this.props.emitData("modifyTechFoul", {alliance_str: alliance_str, value: 1});
					this.props.emitData("modifyCard", {alliance_index: alliance_index, team: i, cardId: 2});
					break;
			}
		}
	}

	render() {
		return (
			<div>
				<div className="head-rv">
					<div className="info-bar">
						<div>{"Match: " + this.props.parentState.matchName}</div>
						<div>{"Status: "}
							<red-text>{this.props.parentState.matchStatus}</red-text>
						</div>
						<div>{"Connected: " + this.props.parentState.connected}</div>
					</div>
					<header className="head-rv-header">
	        	  <h1 className="head-rv-title">HEAD REFEREE</h1>
	      	</header>
					<div className="head-rv-row">
						<Link to='/red-view'><HeadRefLink alliance="red" /></Link>
						<ScoreBox yellowCards={this.props.parentState.yellowCards} redCards={this.props.parentState.redCards} scores={this.props.parentState.scores} />
						<Link to='/blue-view'><HeadRefLink alliance="blue" /></Link>
					</div>
					<Penalties alliance={0} teams={this.props.parentState.redAlliance} yellowCards={this.props.parentState.yellowCards[0]} redCards={this.props.parentState.redCards[0]} handlePenaltyAssignment={this.handlePenaltyAssignment.bind(this)} />
					<Penalties alliance={1} teams={this.props.parentState.blueAlliance} yellowCards={this.props.parentState.yellowCards[1]} redCards={this.props.parentState.redCards[1]} handlePenaltyAssignment={this.handlePenaltyAssignment.bind(this)} />
				</div>
			</div>
		);
	}
}

export default HeadRefereeView;
