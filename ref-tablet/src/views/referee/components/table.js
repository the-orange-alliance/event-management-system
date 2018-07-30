import React, { Component } from 'react';
import './table.css';

class Table extends Component {

	render() {
		return (
    <div className="table-container">
      <div className="table-header-team">Team</div>
      <div className="table-header-yellowCard">Yellow Cards</div>
      <div className="table-header-redCard">Red Cards</div>

      <div className="table-item">{this.props.teams[0]}</div>
      <div className="table-item">{this.props.yellowCards[0]}</div>
      <div className="table-item">{this.props.redCards[0]}</div>

      <div className="table-item">{this.props.teams[1]}</div>
      <div className="table-item">{this.props.yellowCards[1]}</div>
      <div className="table-item">{this.props.redCards[1]}</div>

      <div className="table-item">{this.props.teams[2]}</div>
      <div className="table-item">{this.props.yellowCards[2]}</div>
      <div className="table-item">{this.props.redCards[2]}</div>
    </div>
        );
  	}
}

export default Table;
