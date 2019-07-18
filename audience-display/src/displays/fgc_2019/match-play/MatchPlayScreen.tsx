import * as React from "react";
import {Match} from "@the-orange-alliance/lib-ems";

import "./MatchPlayScreen.css";

import FGC_LOGO from "../res/Global_Logo.png";
import TeamCardStatus from "./TeamCardStatus";
import MatchParticipant from "@the-orange-alliance/lib-ems/dist/models/ems/MatchParticipant";

interface IProps {
  match: Match
}

class MatchPlayScreen extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  // public componentDidMount() {
  //
  // }
  //
  // public componentWillUnmount() {
  //
  // }

  public render() {
    const {match} = this.props;
    return (
      <div>
        <div id="play-display-base">
          <div id="play-display-base-top">
            <div id="play-display-left-details">
              <div className="top-details"/>
              <div className="bottom-details"/>
            </div>
            <div id="play-display-left-score">
              <div className="teams red-bg left-score">
                {this.displayRedAlliance()}
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
                    <span>{match.redScore}</span>
                  </div>
                </div>
                <div id="score-container-blue">
                  <div className="blue-bg center-items">
                    <span>{match.blueScore}</span>
                  </div>
                </div>
              </div>
            </div>
            <div id="play-display-right-score">
              <div className="teams blue-bg right-score">
                {this.displayBlueAlliance()}
              </div>
            </div>
            <div id="play-display-right-details">
              <div className="top-details"/>
              <div className="bottom-details"/>
            </div>
          </div>
          <div id="play-display-base-bottom">
            <div className="info-col">
              <span className="info-field">MATCH: {match.matchName}</span>
              <span className="info-field">FIELD: {match.fieldNumber}</span>
            </div>
            <div className="info-col">
              <span className="info-field">FIRST Global 2018</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private displayRedAlliance() {
    const {match} = this.props;
    const redAlliance: MatchParticipant[] = match.participants.filter((p: MatchParticipant) => p.station < 20);
    const redAllianceView = redAlliance.map((p: MatchParticipant) => {
      return (
        <div key={p.matchParticipantKey} className="team">
          <TeamCardStatus cardStatus={p.cardStatus}/>
          <div className="team-name-left">
            <span>{p.team.country}</span>
          </div>
          <div className="team-flag">
            <span className={"flag-icon flag-icon-" + p.team.countryCode}/>
          </div>
        </div>
      );
    });
    return (redAllianceView);
  }

  private displayBlueAlliance() {
    const {match} = this.props;
    const blueAlliance: MatchParticipant[] = match.participants.filter((p: MatchParticipant) => p.station >= 20);
    const blueAllianceView = blueAlliance.map((p: MatchParticipant) => {
      return (
        <div key={p.matchParticipantKey} className="team">
          <div className="team-flag">
            <span className={"flag-icon flag-icon-" + p.team.countryCode}/>
          </div>
          <div className="team-name-right">
            <span>{p.team.country}</span>
          </div>
          <TeamCardStatus cardStatus={p.cardStatus}/>
        </div>
      );
    });
    return (blueAllianceView);
  }
}

export default MatchPlayScreen;