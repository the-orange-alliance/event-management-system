import * as React from 'react';
import "./AllianceBracket.css";

class FourAllianceBracket extends React.Component {

  public render() {
    return (
      <div id="bracket-container">
        <div className="bracket-col">
          <div className="bracket-pipe final-pipe-top-x"/>
          <div className="bracket-pipe final-pipe-bot-x"/>
          <div className="bracket-box">
            <div className="bracket-box-alliance red-bg">
              1. 3618, 4003, 67
            </div>
            <div className="bracket-box-alliance blue-bg">
              8. 4381, 4237, 254
            </div>
          </div>
          <div className="bracket-box">
            <div className="bracket-box-alliance red-bg">
              1. 3618, 4003, 67
            </div>
            <div className="bracket-box-alliance blue-bg">
              8. 4381, 4237, 254
            </div>
          </div>
        </div>
        <div className="bracket-col">
          <div className="bracket-pipe final-pipe-top-y"/>
          <div className="bracket-pipe final-pipe-bot-y"/>
          <div className="bracket-box">
            <div className="bracket-box-alliance red-bg">
              1. 3618, 4003, 67
            </div>
            <div className="bracket-box-alliance blue-bg">
              8. 4381, 4237, 254
            </div>
          </div>
        </div>
        <div className="bracket-col">
          <div className="bracket-pipe winner-pipe"/>
          <div className="bracket-box-winner">
            <span>Winner!</span>
          </div>
        </div>
      </div>
    );
  }
}

export default FourAllianceBracket;
