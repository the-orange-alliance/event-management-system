import React, { Component } from 'react';
import './submit.css';

class Submit extends Component {

  constructor() {
    super();
  }

	handleClick() {
    this.props.alertParent();
  }

	render() {
		return (
      <div className="submit-button" onClick={this.handleClick.bind(this)}>{this.props.name}</div>
    		);
  	}
}

export default Submit;
