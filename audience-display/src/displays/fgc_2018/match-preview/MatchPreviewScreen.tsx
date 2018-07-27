import * as React from "react";

import "./MatchPreviewScreen.css";
import FGC_LOGO from "../res/Before_Screen_Logo.png";
import RED_FLAG from "../res/Red_Team_Tag.png";
import BLUE_FLAG from "../res/Blue_Team_Tag.png";

class MatchPreviewScreen extends React.Component {
  public render() {
    return (
      <div id="fgc-body">
        <div id="fgc-container">
          <div id="fgc-pre-header">
            <img id="fgc-pre-logo" src={FGC_LOGO}/>
          </div>
          <div id="fgc-pre-match-info">
            <div id="fgc-pre-match-info-left">
              <div className="pre-match-info-left center-items">
                <span>MATCH</span>
              </div>
              <div className="pre-match-info-right center-items">
                <span>1</span>
              </div>
            </div>
            <div id="fgc-pre-match-info-left">
              <div className="pre-match-info-left center-items">
                <span>FIELD</span>
              </div>
              <div className="pre-match-info-right center-items">
                <span>1</span>
              </div>
            </div>
          </div>
          <div className="pre-match-alliance">
            <div className="pre-match-alliance-left">
              <img src={RED_FLAG} className="fit"/>
            </div>
            <div className="pre-match-alliance-right">
              <div className="pre-match-alliance-row pre-match-border">
                <div className="pre-match-rank">#1</div>
                <div className="pre-match-team">Team #1</div>
                <div className="pre-match-flag">FLAG</div>
              </div>
              <div className="pre-match-alliance-row pre-match-border">
                <div className="pre-match-rank">#11</div>
                <div className="pre-match-team">Team #2</div>
                <div className="pre-match-flag">FLAG</div>
              </div>
              <div className="pre-match-alliance-row">
                <div className="pre-match-rank">#111</div>
                <div className="pre-match-team">Team #3</div>
                <div className="pre-match-flag">FLAG</div>
              </div>
            </div>
          </div>
          <div className="pre-match-alliance">
            <div className="pre-match-alliance-left">
              <img src={BLUE_FLAG} className="fit"/>
            </div>
            <div className="pre-match-alliance-right">
              <div className="pre-match-alliance-row pre-match-border">
                <span className="pre-match-rank">#1</span>
                <span className="pre-match-team">Team #1</span>
                <span className="pre-match-flag">FLAG</span>
              </div>
              <div className="pre-match-alliance-row pre-match-border">
                <span className="pre-match-rank">#11</span>
                <span className="pre-match-team">Team #2</span>
                <span className="pre-match-flag">FLAG</span>
              </div>
              <div className="pre-match-alliance-row">
                <span className="pre-match-rank">#111</span>
                <span className="pre-match-team">Team #3</span>
                <span className="pre-match-flag">FLAG</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MatchPreviewScreen;