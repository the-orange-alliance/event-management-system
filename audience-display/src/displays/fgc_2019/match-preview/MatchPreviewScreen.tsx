import * as React from "react";
import {Match, MatchParticipant, Ranking, Team} from "@the-orange-alliance/lib-ems";
import "./MatchPreviewScreen.css";
import FGC_LOGO from "../res/Before_Screen_Logo.png";
import RED_FLAG from "../res/Red_Team_Tag.png";
import BLUE_FLAG from "../res/Blue_Team_Tag.png";

interface IProps {
  match: Match,
}

class MatchPreviewScreen extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const {match} = this.props;
    const matchLabel = match.tournamentLevel > -1 ? match.abbreviatedName : "TEST";
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
                <span>{matchLabel}</span>
              </div>
            </div>
            <div id="fgc-pre-match-info-left">
              <div className="pre-match-info-left center-items">
                <span>FIELD</span>
              </div>
              <div className="pre-match-info-right center-items">
                <span>{match.fieldNumber}</span>
              </div>
            </div>
          </div>
          <div className="pre-match-alliance">
            <div className="pre-match-alliance-left">
              <img src={RED_FLAG} className="auto-w"/>
            </div>
            <div className="pre-match-alliance-right">
              {this.renderRedAlliance()}
            </div>
          </div>
          <div className="pre-match-alliance">
            <div className="pre-match-alliance-left">
              <img src={BLUE_FLAG} className="auto-w"/>
            </div>
            <div className="pre-match-alliance-right">
              {this.renderBlueAlliance()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  private renderRedAlliance() {
    const {match} = this.props;
    const isMatchTest = match.tournamentLevel <= 0;
    const redAlliance: MatchParticipant[] = match.participants.filter((p: MatchParticipant) => p.station < 20);
    const redAllianceView = redAlliance.map((participant: MatchParticipant) => {
      // TODO - Get Team Identifier
      const team: Team = participant.team;
      const rank: Ranking = participant.teamRank;
      return (
        <div key={participant.matchParticipantKey} className="pre-match-alliance-row pre-match-border">
          <div className={"pre-match-flag " + (isMatchTest ? "match-test-flag" : "")}><span className={"flag-icon flag-border flag-icon-" + team.countryCode}/></div>
          <div className={"pre-match-team " + (isMatchTest ? "match-test-team" : "")}>({team.country}) {team.teamNameShort}</div>
          {
            isMatchTest &&
            <div className="pre-match-rank">{rank.rank}</div>
          }
        </div>
      );
    });
    return (redAllianceView);
  }

  private renderBlueAlliance() {
    const {match} = this.props;
    const isMatchTest = match.tournamentLevel <= 0;
    const blueAlliance: MatchParticipant[] = match.participants.filter((p: MatchParticipant) => p.station > 20);
    const blueAllianceView = blueAlliance.map((participant: MatchParticipant) => {
      // TODO - Get Team Identifier
      const team: Team = participant.team;
      const rank: Ranking = participant.teamRank;
      return (
        <div key={participant.matchParticipantKey} className="pre-match-alliance-row pre-match-border">
          <div className={"pre-match-flag " + (isMatchTest ? "match-test-flag" : "")}><span className={"flag-icon flag-border flag-icon-" + team.countryCode}/></div>
          <div className={"pre-match-team " + (isMatchTest ? "match-test-team" : "")}>({team.country}) {team.teamNameShort}</div>
          {
            isMatchTest &&
            <div className="pre-match-rank">{rank.rank}</div>
          }
        </div>
      );
    });
    return (blueAllianceView);
  }
}

export default MatchPreviewScreen;