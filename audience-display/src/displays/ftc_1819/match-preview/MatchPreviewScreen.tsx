import * as React from 'react';
import "./MatchPreviewScreen.css";
import Match from "../../../shared/models/Match";

import FIRST_LOGO from "../res/FIRST_logo_transparent.png";
import RR_LOGO from "../res/rr_logo_transparent.png";
import FTC_LOGO from "../res/FTC_logo_transparent.png";
import MatchParticipant from "../../../shared/models/MatchParticipant";
import Team from "../../../shared/models/Team";
import Ranking from "../../../shared/models/Ranking";

interface IProps {
  match: Match
}

interface IState {
  match: Match,
  teams: Team[],
  ranks: Ranking[]
}

class MatchPreviewScreen extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      match: this.getUpdatedMatchInfo(),
      teams: this.getUpdatedTeamInfo(),
      ranks: this.getUpdatedRankInfo()
    };
  }

  public componentDidUpdate(prevProps: IProps) {
    if (prevProps.match.matchKey !== this.props.match.matchKey) {
      this.setState({match: this.getUpdatedMatchInfo(), teams: this.getUpdatedTeamInfo(), ranks: this.getUpdatedRankInfo()});
    }
  }

  public render() {
    const {match, teams, ranks} = this.state;
    const redTeams: Team[] = [];
    const blueTeams: Team[] = [];

    for (let i = 0; i < teams.length / 2; i++) {
      redTeams.push(teams[i]);
    }

    for (let i = teams.length / 2; i < teams.length; i++) {
      blueTeams.push(teams[i]);
    }

    const redTeamsView = redTeams.map((team: Team, index: number) => {
      const rank = match.tournamentLevel >= 10 ? match.participants[index].getAllianceRankFromKey() : ranks[index].rank;
      return (
        <div key={team.teamKey} className="center-items red-border">
          <div className="rr-pre-team center-left-items">{team.teamKey}</div>
          <div className="rr-pre-name center-left-items">{team.teamNameShort}</div>
          <div className="rr-pre-rank center-items">#{rank}</div>
        </div>
      );
    });

    const blueTeamsView = blueTeams.map((team: Team, index: number) => {
      const rank = match.tournamentLevel >= 10 ? match.participants[index + teams.length / 2].getAllianceRankFromKey() : ranks[index + teams.length / 2].rank;
      return (
        <div key={team.teamKey} className="center-items blue-border">
          <div className="rr-pre-team center-left-items">{team.teamKey}</div>
          <div className="rr-pre-name center-left-items">{team.teamNameShort}</div>
          <div className="rr-pre-rank center-items">#{rank}</div>
        </div>
      );
    });

    return (
      <div id="rr-body">
        <div id="rr-container">
          <div id="rr-pre-top" className="rr-border">
            <div className="col-left"><img src={FIRST_LOGO} className="fit-h"/></div>
            <div className="center-items rr-pre-match">{match.matchName}</div>
            <div className="col-right"><img src={RR_LOGO} className="fit-h"/></div>
          </div>
          <div id="rr-pre-mid" className="rr-border">
            <div id="rr-pre-mid-labels" className="center-items">
              <div className="rr-pre-team">Team #</div>
              <div className="rr-pre-name">Nickname</div>
              <div className="rr-pre-rank">Rank #</div>
            </div>
            <div className="rr-pre-mid-alliance">
              {blueTeamsView}
            </div>
            <div className="rr-pre-mid-alliance">
              {redTeamsView}
            </div>
          </div>
          <div id="rr-pre-bot" className="rr-border">
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

export default MatchPreviewScreen;