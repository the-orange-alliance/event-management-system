import React, { Component } from 'react';
import './solar-array.css';
import PanelToggle from "./panel-toggle";

class SolarArray extends Component {

handleClick(index) {
  let panelArray = this.props.panelArray;
  panelArray[index] = !panelArray[index];
  this.props.gridToParent(panelArray, panelArray[index], index);
}

	render() {
		return (
        <div className="sa-container" style={(this.props.alliance == "blue") ? {backgroundColor:'rgb(55, 102, 255)'}:{backgroundColor:'rgb(255, 80, 80)'}}>
          <PanelToggle toggleParent={() => {this.handleClick(0)}} light={this.props.panelArray[0]}/>
          <PanelToggle toggleParent={() => {this.handleClick(1)}} light={this.props.panelArray[1]}/>
          <PanelToggle toggleParent={() => {this.handleClick(2)}} light={this.props.panelArray[2]}/>
          <PanelToggle toggleParent={() => {this.handleClick(3)}} light={this.props.panelArray[3]}/>
          <PanelToggle toggleParent={() => {this.handleClick(4)}} light={this.props.panelArray[4]}/>
        </div>
        );
  	}
}

export default SolarArray;
