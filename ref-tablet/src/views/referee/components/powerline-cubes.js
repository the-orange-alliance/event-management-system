import React, { Component } from 'react';
import './powerline-cubes.css';
import BlockToggle from "./block-toggle";
import RoundedToggle from "./rounded-toggle";
import wind from '../../../assets/wind_copyrighted.jpg';
import handshake from '../../../assets/handshake_copyrighted.png';
import coalRed from '../../../assets/Coal_Face_Red_Tablet.png';
import coalBlue from '../../../assets/Coal_Face_Blue_Tablet.png';
import reactor from '../../../assets/Nuclear_Face_Tablet.png';

class PowerlineCubes extends Component {

handleClick(index) {
  this.props.gridToParent(index);
}

handleCranked() {
  this.props.crankedToParent();
}

	render() {
    let coalImg;
    if(this.props.alliance === "red"){
      coalImg = coalRed;
    } else {
      coalImg = coalBlue;
    }

		return (
        <div className="plc-container">
          <div className="plc-container-icons">
            <img className="plc-icon" src={wind} />
            <RoundedToggle name="Cranked?" toggleParent={this.handleCranked.bind(this)} green={this.props.isCranked} />
          </div>
          <BlockToggle buttonType="toggle-button-pl" className="toggle-button-pl" toggleParent={() => {this.handleClick(0)}} green={this.props.cubes[0]}/>

          <div className="plc-container-icons">
            <img className="plc-icon" src={reactor} />
          </div>
          <BlockToggle buttonType="toggle-button-pl" className="toggle-button-pl" toggleParent={() => {this.handleClick(1)}} green={this.props.cubes[1]}/>

          <div className="plc-container-icons">
            <img className="plc-icon-coal" src={coalImg} />
          </div>
          <BlockToggle buttonType="toggle-button-pl" className="toggle-button-pl" toggleParent={() => {this.handleClick(2)}} green={this.props.cubes[2]}/>

          <div className="plc-container-icons">
            <img className="plc-icon" src={handshake} />
          </div>
          <BlockToggle buttonType="toggle-button-pl" className="toggle-button-pl" toggleParent={() => {this.handleClick(3)}} green={this.props.cubes[3]}/>
        </div>
        );
  	}
}

export default PowerlineCubes;
