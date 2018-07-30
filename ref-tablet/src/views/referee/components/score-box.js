import React, { Component } from 'react';
import './score-box.css';
import PenaltyBar from './penalty-bar';

class ScoreBox extends Component {

	render() {


		return (
			<div className="sb-box">
					<div className="sb-col-red">
						<div className="sb-alliance">RED</div>
							<PenaltyBar type="yellow" cards={this.props.yellowCards[0]} />
							<PenaltyBar type="red" cards={this.props.redCards[0]} />
						<div className="sb-score">{this.props.scores[0]}</div>
					</div>
					<div className="sb-col-blue">
						<div className="sb-alliance">BLUE</div>
							<PenaltyBar type="yellow" cards={this.props.yellowCards[1]} />
							<PenaltyBar type="red" cards={this.props.redCards[1]} />
						<div className="sb-score">{this.props.scores[1]}</div>
					</div>
			</div>
    		);
  	}
}

export default ScoreBox;
