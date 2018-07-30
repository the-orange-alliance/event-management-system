import React, { Component } from 'react';
import './down-button.css';

class DownButton extends Component {

	handleClick() {
        this.props.decrementScore();
      }

	render() {
		return (
					<div className={this.props.color} onClick={this.handleClick.bind(this)}/>
    		);
  	}
}

export default DownButton;
