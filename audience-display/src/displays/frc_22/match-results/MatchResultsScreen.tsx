import * as React from 'react';
import "./MatchResultsScreen.css";
import {Event, Match, MatchParticipant, Ranking, RapidReactMatchDetails, Team} from "@the-orange-alliance/lib-ems";
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
    const details: RapidReactMatchDetails = (match.matchDetails as RapidReactMatchDetails) || new RapidReactMatchDetails();
    console.log(match);

    const redAuto = details.getRedAutoScore();
    const redTele = details.getRedTeleScore();
    const redEnd = details.getRedEndScore();
    const redPen = details.getRedPenalty(match.blueMinPen ? match.blueMinPen : 0, match.blueMajPen ? match.blueMajPen : 0);

    const redAutoCargo: number = (details.redAutoCargoLow * 2) + (details.redAutoCargoHigh * 4)
    const redTaxi: number = (details.redAutoTaxiRobot1 ? 2 : 0) + (details.redAutoTaxiRobot2 ? 2 : 0) + (details.redAutoTaxiRobot3 ? 2 : 0);

    const redTeleCargo: number = details.redTeleCargoLow + (details.redTeleCargoHigh * 2)

    const redHangs: number = redEnd;

    const blueAuto = details.getBlueAutoScore();
    const blueTele = details.getBlueTeleScore();
    const blueEnd = details.getBlueEndScore();
    const bluePen = details.getBluePenalty(match.redMinPen ? match.redMinPen : 0, match.redMajPen ? match.redMajPen : 0);

    const blueAutoCargo: number = (details.blueAutoCargoLow * 2) + (details.blueAutoCargoHigh * 4)
    const blueTaxi: number = (details.blueAutoTaxiRobot1 ? 2 : 0) + (details.blueAutoTaxiRobot2 ? 2 : 0) + (details.blueAutoTaxiRobot3 ? 2 : 0);

    const blueTeleCargo: number = details.blueTeleCargoLow + (details.blueTeleCargoHigh * 2)

    const blueHangs: number = blueEnd


    const redWin: boolean = match.redScore > match.blueScore;
    const tie: boolean = match.redScore === match.blueScore;

    const redCargoRp = details.redCargoBonus ? 1 : 0;
    const redHangarRp = details.redHangarBonus ? 1 : 0;
    const blueCargoRp = details.blueCargoBonus ? 1 : 0;
    const blueHangarRp = details.blueHangarBonus ? 1 : 0;
    const redRP: number = redCargoRp + redHangarRp + (tie ? 1 : redWin ? 2 : 0);
    const blueRP: number = blueCargoRp + blueHangarRp + (tie ? 1 : !redWin ? 2 : 0);

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
                  <span>Cargo Hub</span>
                  <span>{blueAutoCargo}</span>
                </div>
                <div className="ir-result-alliance-score-sub">
                  <span>Taxi</span>
                  <span>{blueTaxi}</span>
                </div>
                <div className="ir-result-alliance-score">
                  <span>Teleop</span>
                  <span>{blueTele}</span>
                </div>
                <div className="ir-result-alliance-score-sub">
                  <span>Cargo Hub</span>
                  <span>{blueTeleCargo}</span>
                </div>
                <div className="ir-result-alliance-score">
                  <span>End Game</span>
                  <span>{blueEnd}</span>
                </div>
                <div className="ir-result-alliance-score-sub">
                  <span>Hangar</span>
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
                  <span>Cargo Hub</span>
                  <span>{redAutoCargo}</span>
                </div>
                <div className="ir-result-alliance-score-sub">
                  <span>Taxi</span>
                  <span>{redTaxi}</span>
                </div>
                <div className="ir-result-alliance-score">
                  <span>Teleop</span>
                  <span>{redTele}</span>
                </div>
                <div className="ir-result-alliance-score-sub">
                  <span>Cargo Hub</span>
                  <span>{redTeleCargo}</span>
                </div>
                <div className="ir-result-alliance-score">
                  <span>End Game</span>
                  <span>{redEnd}</span>
                </div>
                <div className="ir-result-alliance-score-sub">
                  <span>Hangar</span>
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
