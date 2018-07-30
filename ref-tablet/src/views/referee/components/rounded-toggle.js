import React, { Component } from 'react';
import './rounded-toggle.css';

class RoundedToggle extends Component {

	handleClick() {
    this.props.toggleParent();
  }

	render() {
    let disp;
		// console.log("Rounded toggle green value: ", this.props.green);
    if(this.props.type === "large") {
      if(this.props.green) {
        disp = <div id="toggle-button" style={{backgroundColor:'green'}} onClick={this.handleClick.bind(this)}>{this.props.name}</div>;
      } else {
        disp = <div id="toggle-button" style={{backgroundColor:'grey'}} onClick={this.handleClick.bind(this)}>{this.props.name}</div>;
      }
  } else {
    if(this.props.green) {
      disp = <div id="toggle-button-small" style={{backgroundColor:'green'}} onClick={this.handleClick.bind(this)}>{this.props.name}</div>;
    } else {
      disp = <div id="toggle-button-small" style={{backgroundColor:'grey'}} onClick={this.handleClick.bind(this)}>{this.props.name}</div>;
    }
  }

		return (
      <div>
					{disp}
      </div>
    		);
  	}
}

export default RoundedToggle;
