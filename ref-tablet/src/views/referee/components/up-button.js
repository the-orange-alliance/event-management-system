import React, { Component } from 'react';
import './up-button.css';

class UpButton extends Component {

	handleClick() {
        this.props.incrementScore();
      }

	render() {
		return (
					<div className={this.props.color} onClick={this.handleClick.bind(this)}/>
    		);
  	}
}

export default UpButton;
