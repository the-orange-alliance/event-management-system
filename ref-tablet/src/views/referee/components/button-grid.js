import React, { Component } from 'react';
import './button-grid.css';
import BlockToggle from "./block-toggle";
import ReactorImg from "../../../assets/Nuclear_Face_Tablet.png"

class ButtonGrid extends Component {

handleClick(index) {
  this.props.gridToParent(index);
}

	render() {
		return (
      <div>
        <img src={ReactorImg} className="bg-img" alt="Sorry I'm just a robot. Can't load right now"/>
        <div className="bg-container">
          <BlockToggle buttonType="toggle-button" toggleParent={() => {this.handleClick(0)}} green={this.props.parentData[0]}/>
          <BlockToggle buttonType="toggle-button" toggleParent={() => {this.handleClick(1)}} green={this.props.parentData[1]}/>
          <BlockToggle buttonType="toggle-button" toggleParent={() => {this.handleClick(2)}} green={this.props.parentData[2]}/>
          <BlockToggle buttonType="toggle-button" toggleParent={() => {this.handleClick(3)}} green={this.props.parentData[3]}/>
          <BlockToggle buttonType="toggle-button" toggleParent={() => {this.handleClick(4)}} green={this.props.parentData[4]}/>
          <BlockToggle buttonType="toggle-button" toggleParent={() => {this.handleClick(5)}} green={this.props.parentData[5]}/>
          <BlockToggle buttonType="toggle-button" toggleParent={() => {this.handleClick(6)}} green={this.props.parentData[6]}/>
          <BlockToggle buttonType="toggle-button" toggleParent={() => {this.handleClick(7)}} green={this.props.parentData[7]}/>
        </div>
      </div>
        );
  	}
}

export default ButtonGrid;
