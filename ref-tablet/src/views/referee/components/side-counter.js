import React, { Component } from 'react';
import './side-counter.css';
import UpButton from './up-button'
import DownButton from './down-button'
import DispBox from './disp-box'
import Coal_Face_Blue_Tablet from '../../../assets/Coal_Face_Blue_Tablet.png';
import Coal_Face_Red_Tablet from '../../../assets/Coal_Face_Red_Tablet.png';

class SideCounter extends Component {

  handleIncrementLow() { /* i = 0 or 1 */
    if(this.props.cubes[0] < this.props.max) {
			this.props.scoreUpdate(true, this.props.cubes[0] + 1, 0);
    }
  }

	handleDecrementLow() { /* i = 0 or 1 */
    if(this.props.cubes[0] > this.props.min) {
			this.props.scoreUpdate(false, this.props.cubes[0] - 1, 0);
    }
  }

	handleIncrementHigh() { /* i = 0 or 1 */
    if(this.props.cubes[1] < this.props.max) {
			this.props.scoreUpdate(true, this.props.cubes[1] + 1, 1);
    }
  }

	handleDecrementHigh() { /* i = 0 or 1 */
    if(this.props.cubes[1] > this.props.min) {
			this.props.scoreUpdate(false, this.props.cubes[1] - 1, 1);
    }
  }

	render() {
		let image;
		let colorUp;
		let colorDown;
		if(this.props.color === "red") {
			image = <img className="sc-img" src={Coal_Face_Red_Tablet} alt="HAL 9000 booting up..."/>;
			colorUp = "up-button-arrow-red";
			colorDown = "down-button-arrow-red";
		} else {
			image = <img className="sc-img" src={Coal_Face_Blue_Tablet} alt="HAL 9000 booting up..."/>;
			colorUp = "up-button-arrow-blue";
			colorDown = "down-button-arrow-blue";
		}

		return (
			<div>
						{image}
	          <div className="sc-grid">
	                <DispBox type="db-counter-side" passDownScore={this.props.cubes[1]} />
									<div className="sc-col-arrows">
										<UpButton color={colorUp} incrementScore={this.handleIncrementHigh.bind(this)} />
	                	<DownButton color={colorDown} decrementScore={this.handleDecrementHigh.bind(this)} />
	              	</div>

	                <DispBox type="db-counter-side" passDownScore={this.props.cubes[0]} />
									<div className="sc-col-arrows">
										<UpButton color={colorUp} incrementScore={this.handleIncrementLow.bind(this)} />
	                	<DownButton color={colorDown} decrementScore={this.handleDecrementLow.bind(this)} />
	              	</div>
	          </div>
			</div>
    		);
  	}
}

export default SideCounter;
