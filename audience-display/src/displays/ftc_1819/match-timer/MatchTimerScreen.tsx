import * as React from 'react';
import * as moment from 'moment';
import "./MatchTimerScreen.css";
import Match from "../../../shared/models/Match";

import FIRST_LOGO from "../res/FIRST_logo_transparent.png";
import RR_LOGO from "../res/rr_logo_transparent.png";
import FTC_LOGO from "../res/FTC_logo_transparent.png";
import Team from "../../../shared/models/Team";
import MatchParticipant from "../../../shared/models/MatchParticipant";
import MatchTimer from "../../../shared/scoring/MatchTimer";
import RoverRuckusMatchDetails from "../../../shared/models/RoverRuckusMatchDetails";
import SocketProvider from "../../../shared/providers/SocketProvider";
import MatchConfiguration from "../../../shared/models/MatchConfiguration";
import {MatchMode} from "../../../shared/scoring/MatchMode";

interface IProps {
  match: Match
}

interface IState {
  activeMatch: Match,
  match: Match,
  teams: Team[],
  timeLeft: number,
  displayTime: number
}

class MatchTimerScreen extends React.Component<IProps, IState> {
  private _timer: MatchTimer;

  constructor(props: IProps) {
    super(props);

    this._timer = new MatchTimer();

    const match: Match = new Match();
    match.matchDetails = new RoverRuckusMatchDetails();

    this.state = {
      activeMatch: match,
      match: this.getUpdatedMatchInfo(),
      teams: this.getUpdatedTeamInfo(),
      timeLeft: this._timer.timeLeft,
      displayTime: this._timer.timeLeft
    };
  }

  public componentDidUpdate(prevProps: IProps) {
    if (prevProps.match.matchKey !== this.props.match.matchKey) {
      this.setState({match: this.getUpdatedMatchInfo(), teams: this.getUpdatedTeamInfo()});
    }
  }

  public componentDidMount() {
    SocketProvider.on("score-update", (matchJSON: any) => {
      const match: Match = new Match().fromJSON(matchJSON);
      if (typeof matchJSON.details !== "undefined") {
        const seasonKey: number = parseInt(match.matchKey.split("-")[0], 10);
        match.matchDetails = Match.getDetailsFromSeasonKey(seasonKey).fromJSON(matchJSON.details);
      }
      if (typeof matchJSON.participants !== "undefined") {
        match.participants = matchJSON.participants.map((p: any) => new MatchParticipant().fromJSON(p));
      }
      this.setState({activeMatch: match});
    });
    SocketProvider.on("match-start", (timerJSON: any) => {
      this._timer.matchConfig = new MatchConfiguration().fromJSON(timerJSON);
      this._timer.on("match-end", () => {
        this._timer.removeAllListeners("match-transition");
        this._timer.removeAllListeners("match-tele");
        this._timer.removeAllListeners("match-endgame");
        this._timer.removeAllListeners("match-abort");
      });
      this._timer.start();
      this.updateTimer();
      const timerID = global.setInterval(() => {
        this.updateTimer();
        if (this._timer.timeLeft <= 0) {
          this.updateTimer();
          global.clearInterval(timerID);
        }
      }, 1000);
    });
    SocketProvider.on("match-abort", () => {
      this._timer.abort();
      this.updateTimer();
      this._timer.removeAllListeners("match-transition");
      this._timer.removeAllListeners("match-tele");
      this._timer.removeAllListeners("match-endgame");
      this._timer.removeAllListeners("match-end");
    });
  }

  public componentWillUnmount() {
    SocketProvider.off("score-update");
    SocketProvider.off("match-start");
    SocketProvider.off("match-abort");
  }

  public render() {
    const {activeMatch, match, displayTime} = this.state;
    const redTeams: MatchParticipant[] = [];
    const blueTeams: MatchParticipant[] = [];

    for (let i = 0; i < match.participants.length / 2; i++) {
      redTeams.push(match.participants[i]);
    }

    for (let i = match.participants.length / 2; i < match.participants.length; i++) {
      blueTeams.push(match.participants[i]);
    }

    const redTeamsView = redTeams.map((participant: MatchParticipant) => {
      return (
        <div key={participant.matchParticipantKey} className="center-items">{participant.teamKey}</div>
      );
    });

    const blueTeamsView = blueTeams.map((participant: MatchParticipant) => {
      return (
        <div key={participant.matchParticipantKey} className="center-items">{participant.teamKey}</div>
      );
    });

    const matchDuration = moment.duration(displayTime, "seconds");
    const disMin = matchDuration.minutes() < 10 ? "0" + matchDuration.minutes().toString() : matchDuration.minutes().toString();
    const disSec = matchDuration.seconds() < 10 ? "0" + matchDuration.seconds().toString() : matchDuration.seconds().toString();

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
              {blueTeamsView}
            </div>
            <div id="rr-mt-center">
              <div id="rr-mt-timer" className="center-items">
                <div>{disMin}:{disSec}</div>
              </div>
              <div id="rr-mt-scores">
                <div id="rr-mt-blue" className="center-items blue-bg">
                  {activeMatch.blueScore}
                </div>
                <div id="rr-mt-red" className="center-items red-bg">
                  {activeMatch.redScore}
                </div>
              </div>
            </div>
            <div id="rr-mt-right">
              {redTeamsView}
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

  private updateTimer() {
    let displayTime: number = this._timer.timeLeft;
    if (this._timer.mode === MatchMode.TRANSITION) {
      displayTime = this._timer.modeTimeLeft;
    }
    if (this._timer.mode === MatchMode.AUTONOMOUS && this._timer.matchConfig.transitionTime > 0) {
      displayTime = this._timer.timeLeft - this._timer.matchConfig.transitionTime;
    }
    this.setState({displayTime, timeLeft: this._timer.timeLeft});
  }
}

export default MatchTimerScreen;