import * as React from 'react';
import "./MatchPlayScreen.css";
import Match from "../../../shared/models/Match";

import FIRST_LOGO from "../res/FIRST_logo_transparent.png";
import RR_LOGO from "../res/rr_logo_transparent.png";

interface IProps {
  match: Match
}

class MatchPlayScreen extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <div>
        <div id="rr-play-container">
          <div id="rr-play-top" className="center-items">
            <div id="rr-play-top-left" className="center-items">
              <div className="center-left-items"><img src={FIRST_LOGO} className="fit-h"/></div>
              <div className="center-left-items">Qualification Match 2</div>
            </div>
            <div id="rr-play-top-right">
              <div className="rr-play-event center-items">Michigan State Championship</div>
              <div className="rr-play-logo center-right-items"><img src={RR_LOGO} className="fit-h"/></div>
            </div>
          </div>
          <div id="rr-play-bot" className="center-items">
            <div id="rr-play-base">
              <div id="rr-play-blue">
                <div className="center-right-items">3618</div>
                <div className="center-right-items">4003</div>
                {/*<div className="center-right-items">254</div>*/}
                {/*<div className="rr-alliance-box center-items blue-bg"><span>EDI</span></div>*/}
              </div>
              <div id="rr-play-mid">
                <div id="rr-play-mid-timer" className="center-items">
                  <div id="rr-play-mid-timer-bar"/>
                  <div id="rr-play-mid-timer-time" className="center-items">150</div>
                </div>
                <div id="rr-play-mid-scores">
                  <div id="rr-play-mid-blue" className="center-items blue-bg">
                    460
                  </div>
                  <div id="rr-play-mid-red" className="center-items red-bg">
                    0
                  </div>
                </div>
              </div>
              <div id="rr-play-red">
                <div className="center-left-items">3618</div>
                <div className="center-left-items">1</div>
                {/*<div className="center-left-items">67</div>*/}
                {/*<div className="rr-alliance-box center-items red-bg"><span>FRA</span></div>*/}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MatchPlayScreen;