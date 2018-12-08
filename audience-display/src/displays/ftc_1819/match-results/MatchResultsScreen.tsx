import * as React from 'react';
import "./MatchResultsScreen.css";
import Match from "../../../shared/models/Match";

import FIRST_LOGO from "../res/FIRST_logo_transparent.png";
import RR_LOGO from "../res/rr_logo_transparent.png";
import FTC_LOGO from "../res/FTC_logo_transparent.png";
import Team from "../../../shared/models/Team";
import Ranking from "../../../shared/models/Ranking";
import MatchParticipant from "../../../shared/models/MatchParticipant";
import RoverRuckusMatchDetails from "../../../shared/models/RoverRuckusMatchDetails";

interface IProps {
  match: Match
}

interface IState {
  match: Match,
  teams: Team[],
  ranks: Ranking[]
}
class MatchResultsScreen extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      match: this.getUpdatedMatchInfo(),
      teams: this.getUpdatedTeamInfo(),
      ranks: this.getUpdatedRankInfo()
    };
  }

  public render() {
    const {match, teams, ranks} = this.state;
    const redTeams: Team[] = [];
    const blueTeams: Team[] = [];
    const details: RoverRuckusMatchDetails = (match.matchDetails as RoverRuckusMatchDetails) || new RoverRuckusMatchDetails();
    console.log(details, match.matchDetails);
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
      redResultView = <div className="rr-result-text center-items red-border">Winner!</div>;
      blueResultView = <div className="rr-result-text center-items"/>;
    } else if (tie) {
      redResultView = <div className="rr-result-text center-items red-border">Tie!</div>;
      blueResultView = <div className="rr-result-text center-items blue-border">Tie!</div>;
    } else if (!redWin) {
      redResultView = <div className="rr-result-text center-items"/>;
      blueResultView = <div className="rr-result-text center-items blue-border">Winner!</div>;
    }

    for (let i = 0; i < teams.length / 2; i++) {
      redTeams.push(teams[i]);
    }

    for (let i = teams.length / 2; i < teams.length; i++) {
      blueTeams.push(teams[i]);
    }

    const redTeamsView = redTeams.map((team: Team, index: number) => {
      return (
        <div key={team.teamKey} className="rr-result-team-container red-border">
          <div className="rr-result-team center-items">{team.teamKey}</div>
          <div className="rr-result-name center-left-items">{team.teamNameShort}</div>
          <div className="rr-result-rank center-items">#{ranks[index].rank}</div>
        </div>
      );
    });

    const blueTeamsView = blueTeams.map((team: Team, index: number) => {
      return (
        <div key={team.teamKey} className="rr-result-team-container blue-border">
          <span className="rr-result-team center-items">{team.teamKey}</span>
          <span className="rr-result-name center-left-items">{team.teamNameShort}</span>
          <span className="rr-result-rank center-items">#{ranks[index + teams.length / 2].rank}</span>
        </div>
      );
    });

    return (
      <div id="rr-body">
        <div id="rr-container">
          <div id="rr-result-top" className="rr-border">
            <div className="col-left"><img src={FIRST_LOGO} className="fit-h"/></div>
            <div className="center-items rr-pre-match">{match.matchName}</div>
            <div className="col-right"><img src={RR_LOGO} className="fit-h"/></div>
          </div>
          <div id="rr-result-mid" className="rr-border">
            <div className="rr-result-alliance">
              <div className="rr-result-alliance-teams">
                {blueTeamsView}
              </div>
              <div className="rr-result-alliance-breakdown">
                <div className="rr-result-alliance-score">
                  <span>Autonomous</span>
                  <span>{blueAuto}</span>
                </div>
                <div className="rr-result-alliance-score">
                  <span>Teleop</span>
                  <span>{blueTele}</span>
                </div>
                <div className="rr-result-alliance-score">
                  <span>End Game</span>
                  <span>{blueEnd}</span>
                </div>
                <div className="rr-result-alliance-score">
                  <span>Red Penalty</span>
                  <span>{bluePen}</span>
                </div>
              </div>
              <div className="rr-result-alliance-scores">
                {blueResultView}
                <div className="rr-result-score center-items blue-bg">{match.blueScore}</div>
              </div>
            </div>
            <div className="rr-result-alliance">
              <div className="rr-result-alliance-teams">
                {redTeamsView}
              </div>
              <div className="rr-result-alliance-breakdown">
                <div className="rr-result-alliance-score">
                  <span>Autonomous</span>
                  <span>{redAuto}</span>
                </div>
                <div className="rr-result-alliance-score">
                  <span>Teleop</span>
                  <span>{redTele}</span>
                </div>
                <div className="rr-result-alliance-score">
                  <span>End Game</span>
                  <span>{redEnd}</span>
                </div>
                <div className="rr-result-alliance-score">
                  <span>Blue Penalty</span>
                  <span>{redPen}</span>
                </div>
              </div>
              <div className="rr-result-alliance-scores">
                {redResultView}
                <div className="rr-result-score center-items red-bg">{match.redScore}</div>
              </div>
            </div>
          </div>
          <div id="rr-result-bot" className="rr-border">
            <div className="col-left"><img src={FTC_LOGO} className="fit-h"/></div>
          </div>
        </div>
      </div>
    );
  }

  private getUpdatedMatchInfo(): Match {
    if (this.props.match.matchKey.length === 0) {
      const match: Match = new Match();
      match.matchName = "MATCH TEST";
      match.fieldNumber = 1; // TODO - Change field number in EMS

      const participants: MatchParticipant[] = [];
      for (let i = 0; i < 6; i++) {
        participants.push(new MatchParticipant().fromJSON({team_key: (i + 1), country_code: "us", card_status: 0}));
      }

      match.participants = participants;
      return match;
    } else {
      return this.props.match;
    }
  }

  private getUpdatedTeamInfo(): Team[] {
    if (typeof this.props.match.participants === "undefined") {
      const teams: Team[] = [];
      for (let i = 0; i < 6; i++) {
        teams.push(new Team().fromJSON({
          team_key: i,
          team_name_short: "TEST TEAM #" + (i + 1),
          country: "TST",
          country_code: "us"
        }));
      }
      return teams;
    } else {
      const teams: Team[] = [];
      for (const participant of this.props.match.participants) {
        teams.push(participant.team);
      }
      return teams;
    }
  }

  private getUpdatedRankInfo(): Ranking[] {
    if (typeof this.props.match.participants === "undefined") {
      const ranks: Ranking[] = [];
      for (let i = 0; i < 6; i++) {
        ranks.push(new Ranking().fromJSON({
          rank: 0
        }));
      }
      return ranks;
    } else {
      const ranks: Ranking[] = [];
      for (const participant of this.props.match.participants) {
        ranks.push(participant.teamRank);
      }
      return ranks;
    }
  }
}

export default MatchResultsScreen;