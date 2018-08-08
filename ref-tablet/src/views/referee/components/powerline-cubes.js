import React, { Component } from 'react';
import './powerline-cubes.css';
import BlockToggle from "./block-toggle";
import RoundedToggle from "./rounded-toggle";
import red_wind from '../../../assets/Red_Wind_Complete_Icon.png';
import blue_wind from '../../../assets/Blue_Wind_Complete_Icon.png';
import handshake from '../../../assets/Coop_Decal_White.png';
import red_coal from '../../../assets/Red_Burning_Complete_Icon.png';
import blue_coal from '../../../assets/Blue_Burning_Complete_Icon.png';
import red_reactor from '../../../assets/Red_Reactor_Complete_Icon.png';
import blue_reactor from '../../../assets/Blue_Reactor_Complete_Icon.png';

class PowerlineCubes extends Component {

handleClick(index) {
  this.props.gridToParent(index);
}

handleCranked() {
  this.props.crankedToParent();
}

	render() {
    let coalImg, wind, reactor;
    if(this.props.alliance === "red"){
      wind = red_wind;
      reactor = red_reactor;
      coalImg = red_coal;
    } else {
      wind = blue_wind;
      coalImg = blue_coal;
      reactor = blue_reactor;
    }

		return (
        <div className="plc-container" style={(this.props.alliance == "blue") ? {backgroundColor:'rgb(55, 102, 255)'}:{backgroundColor:'rgb(255, 80, 80)'}}>
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
            <img className="plc-icon" src={coalImg} />
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
