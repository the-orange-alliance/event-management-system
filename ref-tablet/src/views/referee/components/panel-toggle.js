import React, { Component } from 'react';
import './panel-toggle.css';
import light from '../../../assets/Light_Panel.png';
import dark from '../../../assets/Dark_Panel.png';

class PanelToggle extends Component {

	handleClick() {
    this.props.toggleParent();
  }

	render() {
    let disp;
    if(this.props.light) {
      disp = <img className="panel" src={light} onClick={this.handleClick.bind(this)} />;
    } else {
      disp = <img className="panel" src={dark} onClick={this.handleClick.bind(this)} />;
    }

		return (
      <div>
					{disp}
      </div>
    		);
  	}
}

export default PanelToggle;
