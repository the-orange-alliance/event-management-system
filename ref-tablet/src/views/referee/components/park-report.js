import React, { Component } from 'react';
import './park-report.css';
import RoundedToggle from "./rounded-toggle";

class ParkReport extends Component {

handleClick(i) {
  let botsParked = this.props.botsParked;
  botsParked[i] = !botsParked[i];
  this.props.updateParent(botsParked, botsParked[i]);
}

	render() {
    // console.log("botsParked: App>Red/Blue>ParkReport ", this.props.botsParked);
		return (
    <div className="pr-row-container">
      <div className="pr-title">Robots Parked</div>
      <div className="pr-container">
          <RoundedToggle type="large" name={this.props.teams[0]} toggleParent={() => {this.handleClick(0)}} green={this.props.botsParked[0]}/>
          <RoundedToggle type="large" name={this.props.teams[1]} toggleParent={() => {this.handleClick(1)}} green={this.props.botsParked[1]}/>
          <RoundedToggle type="large" name={this.props.teams[2]} toggleParent={() => {this.handleClick(2)}} green={this.props.botsParked[2]}/>
      </div>
    </div>
        );
  	}
}

export default ParkReport;
