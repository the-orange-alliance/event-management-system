import React, { Component } from 'react';
import './disp-box.css';

class DispBox extends Component {

	render() {
		return (
					<div className={this.props.type}>{this.props.passDownScore}</div>
    		);
  	}
}

export default DispBox;
