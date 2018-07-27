import * as React from "react";
import ScoringComponent from "./ScoringComponent";

import "./MatchPlayScreen.css";
import FGC_LOGO from "../res/Global_Logo.png";

import REACTOR_BASE from "../res/Grey_Reactor_Icon.png";
import BLUE_REACTOR_STARTED from "../res/Blue_Reactor_Core_Icon.png";
import BLUE_REACTOR_COMPLETE from "../res/Blue_Reactor_Complete_Icon.png";
import RED_REACTOR_STARTED from "../res/Red_Reactor_Core_Icon.png";
import RED_REACTOR_COMPLETE from "../res/Red_Reactor_Complete_Icon.png";

import COMBUSTION_BASE from "../res/Grey_Burning_Icon.png";
import BLUE_COMBUSTION_STARTED from "../res/Blue_Burning_Complete_Icon.png";
import BLUE_COMBUSTION_COMPLETE from "../res/Blue_Burning_Complete_Icon.png";
import RED_COMBUSTION_STARTED from "../res/Red_Burning_Complete_Icon.png";
import RED_COMBUSTION_COMPLETE from "../res/Red_Burning_Complete_Icon.png";

import TURBINE_BASE from "../res/Grey_Wind_Icon.png";
import BLUE_TURBINE_STARTED from "../res/Blue_Wind_Core_Icon.png";
import BLUE_TURBINE_COMPLETE from "../res/Blue_Wind_Complete_Icon.png";
import RED_TURBINE_STARTED from "../res/Red_Wind_Core_Icon.png";
import RED_TURBINE_COMPLETE from "../res/Red_Wind_Complete_Icon.png";
import TeamCardStatus from "./TeamCardStatus";
import SolarCapsule from "./ScoringCapsule";

class MatchPlayScreen extends React.Component {
  public render() {
    return (
      <div>
        <div id="play-display-base">
          <div id="play-display-base-top">
            <div id="play-display-left-details">
              <div className="top-details">
                <ScoringComponent baseImg={REACTOR_BASE} startedImg={RED_REACTOR_STARTED} completedImg={RED_REACTOR_COMPLETE} started={false} completed={false}/>
                <ScoringComponent baseImg={COMBUSTION_BASE} startedImg={RED_COMBUSTION_STARTED} completedImg={RED_COMBUSTION_COMPLETE} started={false} completed={false}/>
                <ScoringComponent baseImg={TURBINE_BASE} startedImg={RED_TURBINE_STARTED} completedImg={RED_TURBINE_COMPLETE} started={false} completed={false}/>
              </div>
              <div className="bottom-details">
                <SolarCapsule allianceColor="red" solarPanelCount={0}/>
              </div>
            </div>
            <div id="play-display-left-score">
              <div className="teams red-bg left-score">
                <div className="team">
                  <TeamCardStatus cardStatus={0}/>
                  <div className="team-name-left">
                    <span>USA</span>
                  </div>
                  <div className="team-flag">
                    f
                  </div>
                </div>
                <div className="team">
                  <TeamCardStatus cardStatus={0}/>
                  <div className="team-name-left">
                    <span>USA</span>
                  </div>
                  <div className="team-flag">
                    f
                  </div>
                </div>
                <div className="team">
                  <TeamCardStatus cardStatus={0}/>
                  <div className="team-name-left">
                    <span>USA</span>
                  </div>
                  <div className="team-flag">
                    f
                  </div>
                </div>
              </div>
            </div>
            <div id="play-display-center">
              <div id="score-container-header">
                <img src={FGC_LOGO} className="fit"/>
              </div>
              <div id="score-container-timer">
                <span>2:30</span>
              </div>
              <div id="score-container-scores">
                <div id="score-container-red">
                  <div className="red-bg center-items">
                    <span>100</span>
                  </div>
                </div>
                <div id="score-container-blue">
                  <div className="blue-bg center-items">
                    <span>200</span>
                  </div>
                </div>
              </div>
            </div>
            <div id="play-display-right-score">
              <div className="teams blue-bg right-score">
                <div className="team">
                  <div className="team-flag">
                    f
                  </div>
                  <div className="team-name-left">
                    <span>USA</span>
                  </div>
                  <TeamCardStatus cardStatus={0}/>
                </div>
                <div className="team">
                  <div className="team-flag">
                    f
                  </div>
                  <div className="team-name-left">
                    <span>USA</span>
                  </div>
                  <TeamCardStatus cardStatus={0}/>
                </div>
                <div className="team">
                  <div className="team-flag">
                    f
                  </div>
                  <div className="team-name-left">
                    <span>USA</span>
                  </div>
                  <TeamCardStatus cardStatus={0}/>
                </div>
              </div>
            </div>
            <div id="play-display-right-details">
              <div className="top-details">
                <ScoringComponent baseImg={REACTOR_BASE} startedImg={BLUE_REACTOR_STARTED} completedImg={BLUE_REACTOR_COMPLETE} started={false} completed={false}/>
                <ScoringComponent baseImg={COMBUSTION_BASE} startedImg={BLUE_COMBUSTION_STARTED} completedImg={BLUE_COMBUSTION_COMPLETE} started={false} completed={false}/>
                <ScoringComponent baseImg={TURBINE_BASE} startedImg={BLUE_TURBINE_STARTED} completedImg={BLUE_TURBINE_COMPLETE} started={false} completed={false}/>
              </div>
              <div className="bottom-details">
                <SolarCapsule allianceColor="blue" solarPanelCount={1}/>
              </div>
            </div>
          </div>
          <div id="play-display-base-bottom">
            <div className="info-col">
              <span className="info-field">MATCH: 1</span>
              <span className="info-field">FIELD: 1</span>
            </div>
            <div className="info-col">
              <span className="info-field">SPONSORED BY: REV Robotics</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MatchPlayScreen;