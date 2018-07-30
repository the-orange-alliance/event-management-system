import React, { Component } from 'react';
import './head-ref-link.css';

class HeadRefLink extends Component {

	render() {

		return (
			<div style={this.props.alliance === "red" ? {backgroundColor:'red'} : {backgroundColor:'blue'}} className="hrl-box">{this.props.alliance === "red" ? "Red View" : "Blue View"}</div>
    		);
  	}
}

export default HeadRefLink;
