import * as React from 'react';
import "./MatchTimerScreen.css";
import Match from "../../../shared/models/Match";

import FIRST_LOGO from "../res/FIRST_logo_transparent.png";
import RR_LOGO from "../res/rr_logo_transparent.png";
import FTC_LOGO from "../res/FTC_logo_transparent.png";
import Team from "../../../shared/models/Team";
import MatchParticipant from "../../../shared/models/MatchParticipant";

interface IProps {
  match: Match
}

interface IState {
  match: Match,
  teams: Team[]
}

class MatchTimerScreen extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      match: this.getUpdatedMatchInfo(),
      teams: this.getUpdatedTeamInfo()
    };
  }

  public componentDidUpdate(prevProps: IProps) {
    if (prevProps.match.matchKey !== this.props.match.matchKey) {
      this.setState({match: this.getUpdatedMatchInfo(), teams: this.getUpdatedTeamInfo()});
    }
  }

  public render() {
    const {match} = this.state;
    return (
      <div id="rr-body">
        <div id="rr-container">
          <div id="rr-mt-top" className="rr-border">
            <div className="col-left"><img src={FIRST_LOGO} className="fit-h"/></div>
            <div className="center-items rr-pre-match">{match.matchName}</div>
            <div className="col-right"><img src={RR_LOGO} className="fit-h"/></div>
          </div>
          <div id="rr-mt-mid" className="rr-border">
            <div id="rr-mt-left">
              <div className="center-items">3618</div>
              <div className="center-items">4003</div>
            </div>
            <div id="rr-mt-center">
              <div id="rr-mt-timer" className="center-items">
                <div>2:30</div>
              </div>
              <div id="rr-mt-scores">
                <div id="rr-mt-blue" className="center-items blue-bg">
                  230
                </div>
                <div id="rr-mt-red" className="center-items red-bg">
                  12
                </div>
              </div>
            </div>
            <div id="rr-mt-right">
              <div className="center-items">3618</div>
              <div className="center-items">4003</div>
            </div>
          </div>
          <div id="rr-mt-bot" className="rr-border">
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
}

export default MatchTimerScreen;