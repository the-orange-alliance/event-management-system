import React, { Component } from 'react';
import './rounded-toggle-triple.css';

class RoundedToggleTriple extends Component {
  
	handleClick() {
    this.props.toggleSelector();
  }

	render() {
    let color = this.props.parentData;
    let disp;
    switch(color) {
      case 0:
        disp = <div className="toggle-button-triple-0" onClick={this.handleClick.bind(this)}>{this.props.name}</div>;
        break;
      case 1:
        disp = <div className="toggle-button-triple-1" onClick={this.handleClick.bind(this)}>{this.props.name}</div>;
        break;
      case 2:
        disp = <div className="toggle-button-triple-2" onClick={this.handleClick.bind(this)}>{this.props.name}</div>;
        break;
    }

		return (
      <div>
					{disp}
      </div>
    		);
  	}
}

export default RoundedToggleTriple;
