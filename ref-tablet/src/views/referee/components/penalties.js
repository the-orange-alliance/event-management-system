import React, { Component } from 'react';
import './penalties.css';
import Submit from "./submit";
import RoundedToggleTriple from "./rounded-toggle-triple";
import Table from './table'

class Penalties extends Component {
constructor(props) {
  super(props);
  this.state = {
    selector: [0, 0, 0]
  };
}

handleTripleClick(i) {
  let state = this.state;
  if(state.selector[i] < 2) {
    state.selector[i]++;
  } else {
    state.selector[i] = 0;
  }
  this.setState(state);
}

handleSubmit() {
  this.props.handlePenaltyAssignment(this.state.selector, this.props.alliance);
  let state = this.state;
  state.selector = [0, 0, 0];
  this.setState(state);
}

	render() {
    let msg = this.props.alliance ? "Blue Penalties" : "Red Penalties";
		return (
    <div className="p-row-container">
      <div className="p-penalties">{msg}</div>
      <div className="p-container">
          <RoundedToggleTriple name={this.props.teams[0]} toggleSelector={() => {this.handleTripleClick(0)}} parentData={this.state.selector[0]}/>
          <RoundedToggleTriple name={this.props.teams[1]} toggleSelector={() => {this.handleTripleClick(1)}} parentData={this.state.selector[1]}/>
          <RoundedToggleTriple name={this.props.teams[2]} toggleSelector={() => {this.handleTripleClick(2)}} parentData={this.state.selector[2]}/>
      </div>
      <Submit name="Submit" alertParent={() => {this.handleSubmit()}} />
      <Table teams={this.props.teams} yellowCards={this.props.yellowCards} redCards={this.props.redCards} />
    </div>
        );
  	}
}

export default Penalties;
