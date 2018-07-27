import * as React from "react";

import "./MatchResultsScreen.css";
import RED_WIN from "../res/Red_Win_Top.png";
// import RED_LOSE from "../res/Red_Lose_Top.png";
// import BLUE_WIN from "../res/Blue_Win_Top.png";
import BLUE_LOSE from "../res/Blue_Lose_Top.png";

class MatchResultsScreen extends React.Component {
  public render() {
    return (
      <div id="fgc-body">
        <div id="fgc-container">
          <div id="res-header-container">
            <div id="res-header-left">
              <span>RESULTS</span>
            </div>
            <div id="res-header-right">
              <div className="res-header-item">MATCH: 100</div>
              <div className="res-header-item">FIELD: 1</div>
            </div>
          </div>
          <div id="res-alliance-container">
            <div className="res-alliance-card">
              <div className="res-card-top">
                <img src={RED_WIN} className="fit-w"/>
              </div>
              <div className="res-card-middle red-bg">
                <div className="res-card-teams">
                  <div className="res-team-row bottom-red">
                    <div className="res-team-name">TEAM #1</div>
                    <div className="res-team-rank">#2</div>
                    <div className="res-team-flag">FLAG</div>
                  </div>
                  <div className="res-team-row bottom-red">
                    <div className="res-team-name">TEAM #2</div>
                    <div className="res-team-rank">#22</div>
                    <div className="res-team-flag">FLAG</div>
                  </div>
                  <div className="res-team-row">
                    <div className="res-team-name">TEAM #3</div>
                    <div className="res-team-rank">#200</div>
                    <div className="res-team-flag">FLAG</div>
                  </div>
                </div>
                <div className="res-card-details">
                  <div className="res-detail-row bottom-red">
                    <div className="res-detail-left right-red">SOLAR</div>
                    <div className="res-detail-right">0</div>
                  </div>
                  <div className="res-detail-row bottom-red">
                    <div className="res-detail-left right-red">WIND</div>
                    <div className="res-detail-right">0</div>
                  </div>
                  <div className="res-detail-row bottom-red">
                    <div className="res-detail-left right-red">NUCLEAR</div>
                    <div className="res-detail-right">0</div>
                  </div>
                  <div className="res-detail-row bottom-red">
                    <div className="res-detail-left right-red">COAL</div>
                    <div className="res-detail-right">0</div>
                  </div>
                  <div className="res-detail-row bottom-red">
                    <div className="res-detail-left right-red">CO-OP</div>
                    <div className="res-detail-right">0</div>
                  </div>
                  <div className="res-detail-row bottom-red">
                    <div className="res-detail-left right-red">PARKING</div>
                    <div className="res-detail-right">0</div>
                  </div>
                  <div className="res-detail-row">
                    <div className="res-detail-left penalty right-red">PENALTY</div>
                    <div className="res-detail-right penalty">0</div>
                  </div>
                </div>
              </div>
              <div className="res-card-bottom">
                <div className="res-alliance-total-left red-bg">
                  <span>TOTAL:</span>
                </div>
                <div className="res-alliance-total-right red-bg">
                  <span>187</span>
                </div>
              </div>
            </div>
            <div className="res-alliance-card">
              <div className="res-card-top">
                <img src={BLUE_LOSE} className="fit-w"/>
              </div>
              <div className="res-card-middle blue-bg">
                <div className="res-card-teams">
                  <div className="res-team-row bottom-blue">
                    <div className="res-team-name">TEAM #1</div>
                    <div className="res-team-rank">#22</div>
                    <div className="res-team-flag">FLAG</div>
                  </div>
                  <div className="res-team-row bottom-blue">
                    <div className="res-team-name">TEAM #2</div>
                    <div className="res-team-rank">#1</div>
                    <div className="res-team-flag">FLAG</div>
                  </div>
                  <div className="res-team-row">
                    <div className="res-team-name">TEAM #3</div>
                    <div className="res-team-rank">#220</div>
                    <div className="res-team-flag">FLAG</div>
                  </div>
                </div>
                <div className="res-card-details">
                  <div className="res-detail-row bottom-blue">
                    <div className="res-detail-left right-blue">SOLAR</div>
                    <div className="res-detail-right">0</div>
                  </div>
                  <div className="res-detail-row bottom-blue">
                    <div className="res-detail-left right-blue">WIND</div>
                    <div className="res-detail-right">0</div>
                  </div>
                  <div className="res-detail-row bottom-blue">
                    <div className="res-detail-left right-blue">NUCLEAR</div>
                    <div className="res-detail-right">0</div>
                  </div>
                  <div className="res-detail-row bottom-blue">
                    <div className="res-detail-left right-blue">COAL</div>
                    <div className="res-detail-right">0</div>
                  </div>
                  <div className="res-detail-row bottom-blue">
                    <div className="res-detail-left right-blue">CO-OP</div>
                    <div className="res-detail-right">0</div>
                  </div>
                  <div className="res-detail-row bottom-blue">
                    <div className="res-detail-left right-blue">PARKING</div>
                    <div className="res-detail-right">0</div>
                  </div>
                  <div className="res-detail-row">
                    <div className="res-detail-left penalty right-blue">PENALTY</div>
                    <div className="res-detail-right penalty">0</div>
                  </div>
                </div>
              </div>
              <div className="res-card-bottom">
                <div className="res-alliance-total-left blue-bg">
                  <span>TOTAL:</span>
                </div>
                <div className="res-alliance-total-right blue-bg">
                  <span>187</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MatchResultsScreen;