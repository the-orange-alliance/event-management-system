import * as React from 'react';
import "./MatchResultsScreen.css";
import {Event, Match, MatchParticipant, Ranking, InfiniteRechargeMatchDetails, Team} from "@the-orange-alliance/lib-ems";
import FACC_LOGO from "../res/facc-large-bg-dark.png";
import FACC_LOGO_TEXT from "../res/facc-large-text-underneath-bg-dark.png";
import TOA_LOGO from "../res/toa-generic-lol.png";

interface IProps {
  event: Event;
  match: Match
}

class MatchResultsScreen extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const {event, match} = this.props;
    const details: InfiniteRechargeMatchDetails = (match.matchDetails as InfiniteRechargeMatchDetails) || new InfiniteRechargeMatchDetails();
    const redAuto = details.getRedAutoScore();
    const redTele = details.getRedTeleScore();
    const redEnd = details.getRedEndScore();
    const redPen = details.getRedPenalty(match.blueMinPen ? match.blueMinPen : 0, match.blueMajPen ? match.blueMajPen : 0);
    const redAutoCells: number = (details.redAutoInnerCells * 6) + (details.redAutoOuterCells * 4) + (details.redAutoBottomCells * 2);
    const redAutoLine: number = (details.redAutoRobotOneCrossed ? 5 : 0) + (details.redAutoRobotTwoCrossed ? 5 : 0) + (details.redAutoRobotThreeCrossed ? 5 : 0);
    const redTeleCells: number = (details.redTeleInnerCells * 3) + (details.redTeleOuterCells * 2) + details.redTeleBottomCells;
    const redControl: number = (details.redRotationControl ? 10 : 0) + (details.redPositionControl ? 20 : 0);
    const redEqualized: number = details.redEndEqualized ? 15 : 0;
    const redHangs: number = redEnd - redEqualized;

    const blueAuto = details.getBlueAutoScore();
    const blueTele = details.getBlueTeleScore();
    const blueEnd = details.getBlueEndScore();
    const bluePen = details.getBluePenalty(match.redMinPen ? match.redMinPen : 0, match.redMajPen ? match.redMajPen : 0);
    const blueAutoCells: number = (details.blueAutoInnerCells * 6) + (details.blueAutoOuterCells * 4) + (details.blueAutoBottomCells * 2);
    const blueAutoLine: number = (details.blueAutoRobotOneCrossed ? 5 : 0) + (details.blueAutoRobotTwoCrossed ? 5 : 0) + (details.blueAutoRobotThreeCrossed ? 5 : 0);
    const blueTeleCells: number = (details.blueTeleInnerCells * 3) + (details.blueTeleOuterCells * 2) + details.blueTeleBottomCells;
    const blueControl: number = (details.blueRotationControl ? 10 : 0) + (details.bluePositionControl ? 20 : 0);
    const blueEqualized: number = details.blueEndEqualized ? 15 : 0;
    const blueHangs: number = blueEnd - blueEqualized;

    const redWin: boolean = match.redScore > match.blueScore;
    const tie: boolean = match.redScore === match.blueScore;

    const redEnergizedRp = (details.redStageOneCells >= 9 && details.redStageTwoCells >= 20 && details.redStageThreeCells >= 20 && details.redRotationControl && details.redPositionControl && details.redStage === 3) ? 1 : 0;
    const redOperationalRp = (details.getRedEndScore() >= 65 && details.redEndEqualized) ? 1 : 0;
    const blueEnergizedRp = (details.blueStageOneCells >= 9 && details.blueStageTwoCells >= 20 && details.blueStageThreeCells >= 20 && details.blueRotationControl && details.bluePositionControl && details.blueStage === 3) ? 1 : 0;
    const blueOperationalRp = (details.getBlueEndScore() >= 65 && details.blueEndEqualized) ? 1 : 0;
    const redRP: number = redEnergizedRp + redOperationalRp + (tie ? 1 : redWin ? 2 : 0);
    const blueRP: number = blueEnergizedRp + blueOperationalRp + (tie ? 1 : !redWin ? 2 : 0);

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
            <div className="col-left"><img alt={'toa logo'} src={TOA_LOGO} className="fit-h"/></div>
            <div className="center-items ir-pre-match">{match.matchName}</div>
            <div className="col-right"><img alt={'facc logo'} src={FACC_LOGO} className="fit-h"/></div>
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
                <div className="ir-result-alliance-score-sub">
                  <span>Power Cell</span>
                  <span>{blueAutoCells}</span>
                </div>
                <div className="ir-result-alliance-score-sub">
                  <span>Initiation Line</span>
                  <span>{blueAutoLine}</span>
                </div>
                <div className="ir-result-alliance-score">
                  <span>Teleop</span>
                  <span>{blueTele}</span>
                </div>
                <div className="ir-result-alliance-score-sub">
                  <span>Power Cell</span>
                  <span>{blueTeleCells}</span>
                </div>
                <div className="ir-result-alliance-score-sub">
                  <span>Control Panel</span>
                  <span>{blueControl}</span>
                </div>
                <div className="ir-result-alliance-score">
                  <span>End Game</span>
                  <span>{blueEnd}</span>
                </div>
                <div className="ir-result-alliance-score-sub">
                  <span>Equalization</span>
                  <span>{blueEqualized}</span>
                </div>
                <div className="ir-result-alliance-score-sub">
                  <span>Hanging</span>
                  <span>{blueHangs}</span>
                </div>
                <div className="ir-result-alliance-score">
                  <span>Red Penalty</span>
                  <span>{bluePen}</span>
                </div>
              </div>
              <div className="ir-result-alliance-scores">
                {blueResultView}
                <div className="ir-result-score center-items blue-bg">{match.blueScore}</div>
                <div className="ir-result-score-rp blue-bg">
                  +{blueRP} RP
                </div>
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
                <div className="ir-result-alliance-score-sub">
                  <span>Power Cell</span>
                  <span>{redAutoCells}</span>
                </div>
                <div className="ir-result-alliance-score-sub">
                  <span>Initiation Line</span>
                  <span>{redAutoLine}</span>
                </div>
                <div className="ir-result-alliance-score">
                  <span>Teleop</span>
                  <span>{redTele}</span>
                </div>
                <div className="ir-result-alliance-score-sub">
                  <span>Power Cell</span>
                  <span>{redTeleCells}</span>
                </div>
                <div className="ir-result-alliance-score-sub">
                  <span>Control Panel</span>
                  <span>{redControl}</span>
                </div>
                <div className="ir-result-alliance-score">
                  <span>End Game</span>
                  <span>{redEnd}</span>
                </div>
                <div className="ir-result-alliance-score-sub">
                  <span>Equalization</span>
                  <span>{redEqualized}</span>
                </div>
                <div className="ir-result-alliance-score-sub">
                  <span>Hanging</span>
                  <span>{redHangs}</span>
                </div>
                <div className="ir-result-alliance-score">
                  <span>Blue Penalty</span>
                  <span>{redPen}</span>
                </div>
              </div>
              <div className="ir-result-alliance-scores">
                {redResultView}
                <div className="ir-result-score center-items red-bg">{match.redScore}</div>
                <div className="ir-result-score-rp red-bg">
                  +{redRP} RP
                </div>
              </div>
            </div>
          </div>
          <div id="ir-result-bot" className="ir-border">
            <div className="ir-bot-logo"><img alt={'facc logo text'} src={FACC_LOGO_TEXT} className="fit-h"/></div>
            <div className="ir-bot-text">
              <span>{event.eventName}</span>
              <span>Watch live! https://twitch.tv/FirstUpdatesNow</span>
            </div>
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
