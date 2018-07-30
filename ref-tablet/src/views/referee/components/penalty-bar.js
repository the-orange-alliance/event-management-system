import React, { Component } from 'react';
import './penalty-bar.css';

class PenaltyBar extends Component {

	render() {
    let bar1 = <div className="penalty-brick" />;
    let bar2 = <div className="penalty-brick" />;
    let bar3 = <div className="penalty-brick" />;
    if(this.props.cards !== undefined) {
      if(this.props.type === "yellow") {
        if(this.props.cards[0])
          bar1 = <div className="yellow-card-brick-activated" />;
        if(this.props.cards[1])
          bar2 = <div className="yellow-card-brick-activated" />;
        if(this.props.cards[2])
          bar3 = <div className="yellow-card-brick-activated" />;
      } else {
        if(this.props.cards[0])
          bar1 = <div className="red-card-brick-activated" />;
        if(this.props.cards[1])
          bar2 = <div className="red-card-brick-activated" />;
        if(this.props.cards[2])
          bar3 = <div className="red-card-brick-activated" />;
      }
    }

		return (
      <div>
        <div className="penalty-bar">
          {bar1}
          {bar2}
          {bar3}
        </div>
      </div>
    		);
  	}
}

export default PenaltyBar;
