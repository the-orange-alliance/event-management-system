import * as React from 'react';
import "./MatchPreviewScreen.css";
import Match from "../../../shared/models/Match";

import FIRST_LOGO from "../res/FIRST_logo_transparent.png";
import RR_LOGO from "../res/rr_logo_transparent.png";
import FTC_LOGO from "../res/FTC_logo_transparent.png";

interface IProps {
  match: Match
}

class MatchPreviewScreen extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <div id="rr-body">
        <div id="rr-container">
          <div id="rr-pre-top" className="rr-border">
            <div className="col-left"><img src={FIRST_LOGO} className="fit-h"/></div>
            <div className="center-items rr-pre-match">Qualification Match 3</div>
            <div className="col-right"><img src={RR_LOGO} className="fit-h"/></div>
          </div>
          <div id="rr-pre-mid" className="rr-border">
            <div id="rr-pre-mid-labels" className="center-items">
              <div className="rr-pre-team">Team #</div>
              <div className="rr-pre-name">Nickname</div>
              <div className="rr-pre-rank">Rank</div>
            </div>
            <div className="rr-pre-mid-alliance">
              <div className="center-items red-border">
                <div className="rr-pre-team center-left-items">1</div>
                <div className="rr-pre-name center-left-items">Some Testing Team</div>
                <div className="rr-pre-rank center-left-items">1</div>
              </div>
              <div className="center-items red-border">
                <div className="rr-pre-team center-left-items">10</div>
                <div className="rr-pre-name center-left-items">Some Testing Team</div>
                <div className="rr-pre-rank center-left-items">10</div>
              </div>
              <div className="center-items red-border">
                <div className="rr-pre-team center-left-items">10</div>
                <div className="rr-pre-name center-left-items">Some Testing Team</div>
                <div className="rr-pre-rank center-left-items">10</div>
              </div>
            </div>
            <div className="rr-pre-mid-alliance">
              <div className="center-items blue-border">
                <div className="rr-pre-team center-left-items">10</div>
                <div className="rr-pre-name center-left-items">Some Testing Team</div>
                <div className="rr-pre-rank center-left-items">10</div>
              </div>
              <div className="center-items blue-border">
                <div className="rr-pre-team center-left-items">10</div>
                <div className="rr-pre-name center-left-items">Some Testing Team</div>
                <div className="rr-pre-rank center-left-items">10</div>
              </div>
              <div className="center-items blue-border">
                <div className="rr-pre-team center-left-items">10</div>
                <div className="rr-pre-name center-left-items">Some Testing Team</div>
                <div className="rr-pre-rank center-left-items">10</div>
              </div>
            </div>
          </div>
          <div id="rr-pre-bot" className="rr-border">
            <div className="col-left"><img src={FTC_LOGO} className="fit-h"/></div>
          </div>
        </div>
      </div>
    );
  }
}

export default MatchPreviewScreen;