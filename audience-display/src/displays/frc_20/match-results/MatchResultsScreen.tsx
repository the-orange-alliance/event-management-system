import * as React from 'react';
import "./MatchResultsScreen.css";
import {Event, Match, MatchParticipant, Ranking, InfiniteRechargeMatchDetails, Team} from "@the-orange-alliance/lib-ems";
import FIRST_LOGO from "../res/FIRST_logo_transparent.png";
import RR_LOGO from "../res/rr_logo_transparent.png";
import FTC_LOGO from "../res/FTC_logo_transparent.png";

interface IProps {
  event: Event;
  match: Match
}

class MatchResultsScreen extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = (match.matchDetails as InfiniteRechargeMatchDetails) || new InfiniteRechargeMatchDetails();
    const redAuto = details.getRedAutoScore();
    const redTele = details.getRedTeleScore();
    const redEnd = details.getRedEndScore();
    const redPen = (match.blueMinPen * 10) + (match.blueMajPen * 40);

    const blueAuto = details.getBlueAutoScore();
    const blueTele = details.getBlueTeleScore();
    const blueEnd = details.getBlueEndScore();
    const bluePen = (match.redMinPen * 10) + (match.redMajPen * 40);

    const redWin: boolean = match.redScore > match.blueScore;
    const tie: boolean = match.redScore === match.blueScore;

    let redResultView;
    let blueResultView;

    if (redWin) {
      redResultView = <div className="ir-result-text center-items red-border">Winner!</div>;
      blueResultView = <div className="ir-result-text center-items"/>;
    } else if (tie) {
      redResultView = <div className="ir-result-text center-items red-border">Tie!</div>;
      blueResultView = <div className="ir-result-text center-items blue-border">Tie!</div>;
    } else if (!redWin) {
      redResultView = <div className="ir-result-text center-items"/>;
      blueResultView = <div className="ir-result-text center-items blue-border">Winner!</div>;
    }

    return (
      <div id="ir-body">
        <div id="ir-container">
          <div id="ir-result-top" className="ir-border">
            <div className="col-left"><img src={FIRST_LOGO} className="fit-h"/></div>
            <div className="center-items ir-pre-match">{match.matchName}</div>
            <div className="col-right"><img src={RR_LOGO} className="fit-h"/></div>
          </div>
          <div id="ir-result-mid" className="ir-border">
            <div className="ir-result-alliance">
              <div className="ir-result-alliance-teams">
                {this.displayBlueAlliance()}
              </div>
              <div className="ir-result-alliance-breakdown">
                <div className="ir-result-alliance-score">
                  <span>Autonomous</span>
                  <span>{blueAuto}</span>
                </div>
                <div className="ir-result-alliance-score">
                  <span>Teleop</span>
                  <span>{blueTele}</span>
                </div>
                <div className="ir-result-alliance-score">
                  <span>End Game</span>
                  <span>{blueEnd}</span>
                </div>
                <div className="ir-result-alliance-score">
                  <span>Red Penalty</span>
                  <span>{bluePen}</span>
                </div>
              </div>
              <div className="ir-result-alliance-scores">
                {blueResultView}
                <div className="ir-result-score center-items blue-bg">{match.blueScore}</div>
              </div>
            </div>
            <div className="ir-result-alliance">
              <div className="ir-result-alliance-teams">
                {this.displayRedAlliance()}
              </div>
              <div className="ir-result-alliance-breakdown">
                <div className="ir-result-alliance-score">
                  <span>Autonomous</span>
                  <span>{redAuto}</span>
                </div>
                <div className="ir-result-alliance-score">
                  <span>Teleop</span>
                  <span>{redTele}</span>
                </div>
                <div className="ir-result-alliance-score">
                  <span>End Game</span>
                  <span>{redEnd}</span>
                </div>
                <div className="ir-result-alliance-score">
                  <span>Blue Penalty</span>
                  <span>{redPen}</span>
                </div>
              </div>
              <div className="ir-result-alliance-scores">
                {redResultView}
                <div className="ir-result-score center-items red-bg">{match.redScore}</div>
              </div>
            </div>
          </div>
          <div id="ir-result-bot" className="ir-border">
            <div className="col-left"><img src={FTC_LOGO} className="fit-h"/></div>
          </div>
        </div>
      </div>
    );
  }

  private displayRedAlliance() {
    const {match} = this.props;
    const participants: MatchParticipant[] = typeof match.participants !== "undefined" ? match.participants : [];
    const redAlliance: MatchParticipant[] = participants.filter((p: MatchParticipant) => p.station < 20);
    const redAllianceView = redAlliance.map((p: MatchParticipant) => {
      const team: Team = p.team;
      const rank: Ranking = p.teamRank;
      return (
        <div key={team.teamKey} className="ir-result-team-container red-border">
          <div className="ir-result-team center-items">{team.teamKey}</div>
          <div className="ir-result-name center-left-items">{team.teamNameShort}</div>
          <div className="ir-result-rank center-items">#{rank.rank}</div>
        </div>
      );
    });
    return (redAllianceView);
  }

  private displayBlueAlliance() {
    const {match} = this.props;
    const participants: MatchParticipant[] = typeof match.participants !== "undefined" ? match.participants : [];
    const blueAlliance: MatchParticipant[] = participants.filter((p: MatchParticipant) => p.station >= 20);
    const blueAllianceView = blueAlliance.map((p: MatchParticipant) => {
      const team: Team = p.team;
      const rank: Ranking = p.teamRank;
      return (
        <div key={team.teamKey} className="ir-result-team-container blue-border">
          <span className="ir-result-team center-items">{team.teamKey}</span>
          <span className="ir-result-name center-left-items">{team.teamNameShort}</span>
          <span className="ir-result-rank center-items">#{rank.rank}</span>
        </div>
      );
    });
    return (blueAllianceView);
  }

}

export default MatchResultsScreen;