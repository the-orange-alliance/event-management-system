import React, { Component } from 'react';
import './block-toggle.css';

class BlockToggle extends Component {

	handleClick() {
    this.props.toggleParent();
  }

	render() {
    let disp;
    if(this.props.green) {
      disp = <div className={this.props.buttonType} style={{backgroundColor:'green'}} onClick={this.handleClick.bind(this)} />;
    } else {
      disp = <div className={this.props.buttonType} style={{backgroundColor:'grey'}} onClick={this.handleClick.bind(this)} />;
    }

		return (
      <div>
					{disp}
      </div>
    		);
  	}
}

export default BlockToggle;
