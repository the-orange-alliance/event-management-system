import * as React from 'react';
import "./MatchResultsScreen.css";
import Match from "../../../shared/models/Match";

import FIRST_LOGO from "../res/FIRST_logo_transparent.png";
import RR_LOGO from "../res/rr_logo_transparent.png";
import FTC_LOGO from "../res/FTC_logo_transparent.png";

interface IProps {
  match: Match
}

class MatchResultsScreen extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <div id="rr-body">
        <div id="rr-container">
          <div id="rr-result-top" className="rr-border">
            <div className="col-left"><img src={FIRST_LOGO} className="fit-h"/></div>
            <div className="center-items rr-pre-match">Qualification Match 3</div>
            <div className="col-right"><img src={RR_LOGO} className="fit-h"/></div>
          </div>
          <div id="rr-result-mid" className="rr-border">
            <div className="rr-result-alliance">
              <div className="rr-result-alliance-teams">
                <div className="rr-result-team-container blue-border">
                  <span className="rr-result-team center-items">3618</span>
                  <span className="rr-result-name center-left-items">The Petoskey Paladins</span>
                  <span className="rr-result-rank center-items">#48</span>
                </div>
                <div className="rr-result-team-container blue-border">
                  <span className="rr-result-team center-items">4003</span>
                  <span className="rr-result-name center-left-items">The TriSonics</span>
                  <span className="rr-result-rank center-items">#1</span>
                </div>
                <div className="rr-result-team-container blue-border">
                  <span className="rr-result-team center-items">4003</span>
                  <span className="rr-result-name center-left-items">The TriSonics</span>
                  <span className="rr-result-rank center-items">#1</span>
                </div>
              </div>
              <div className="rr-result-alliance-breakdown">
                <div className="rr-result-alliance-score">
                  <span>Autonomous</span>
                  <span>0</span>
                </div>
                <div className="rr-result-alliance-score">
                  <span>Mineral</span>
                  <span>0</span>
                </div>
                <div className="rr-result-alliance-score">
                  <span>End Game</span>
                  <span>0</span>
                </div>
                <div className="rr-result-alliance-score">
                  <span>Red Penalty</span>
                  <span>0</span>
                </div>
              </div>
              <div className="rr-result-alliance-scores">
                <div className="rr-result-text center-items blue-border">Winner!</div>
                <div className="rr-result-score center-items blue-bg">255</div>
              </div>
            </div>
            <div className="rr-result-alliance">
              <div className="rr-result-alliance-teams">
                <div className="rr-result-team-container red-border">
                  <div className="rr-result-team center-items">3618</div>
                  <div className="rr-result-name center-left-items">The Petoskey Paladins</div>
                  <div className="rr-result-rank center-items">#48</div>
                </div>
                <div className="rr-result-team-container red-border">
                  <span className="rr-result-team center-items">4003</span>
                  <span className="rr-result-name center-left-items">The TriSonics</span>
                  <span className="rr-result-rank center-items">#1</span>
                </div>
              </div>
              <div className="rr-result-alliance-breakdown">
                <div className="rr-result-alliance-score">
                  <span>Autonomous</span>
                  <span>0</span>
                </div>
                <div className="rr-result-alliance-score">
                  <span>Mineral</span>
                  <span>0</span>
                </div>
                <div className="rr-result-alliance-score">
                  <span>End Game</span>
                  <span>0</span>
                </div>
                <div className="rr-result-alliance-score">
                  <span>Red Penalty</span>
                  <span>0</span>
                </div>
              </div>
              <div className="rr-result-alliance-scores">
                <div className="rr-result-text center-items red-border">Winner!</div>
                <div className="rr-result-score center-items red-bg">255</div>
              </div>
            </div>
          </div>
          <div id="rr-result-bot" className="rr-border">
            <div className="col-left"><img src={FTC_LOGO} className="fit-h"/></div>
          </div>
        </div>
      </div>
    );
  }
}

export default MatchResultsScreen;