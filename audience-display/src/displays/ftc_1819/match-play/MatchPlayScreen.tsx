import * as React from 'react';
import "./MatchPlayScreen.css";
import Match from "../../../shared/models/Match";

import FIRST_LOGO from "../res/FIRST_logo_transparent.png";
import RR_LOGO from "../res/rr_logo_transparent.png";
import Team from "../../../shared/models/Team";
import Ranking from "../../../shared/models/Ranking";
import MatchParticipant from "../../../shared/models/MatchParticipant";
import Event from "../../../shared/models/Event";
import SocketProvider from "../../../shared/providers/SocketProvider";
import RoverRuckusMatchDetails from "../../../shared/models/RoverRuckusMatchDetails";
import MatchTimer from "../../../shared/scoring/MatchTimer";
import MatchConfiguration from "../../../shared/models/MatchConfiguration";
import {MatchMode} from "../../../shared/scoring/MatchMode";

interface IProps {
  event: Event,
  match: Match
}

interface IState {
  activeMatch: Match,
  match: Match,
  teams: Team[],
  ranks: Ranking[],
  timeLeft: number,
  displayTime: number
}

class MatchPlayScreen extends React.Component<IProps, IState> {
  private _timer: MatchTimer;
  private _timerStyle: string;

  constructor(props: IProps) {
    super(props);

    this._timer = new MatchTimer();
    this._timerStyle = "green-bar";

    const match: Match = new Match();
    match.matchDetails = new RoverRuckusMatchDetails();

    this.state = {
      activeMatch: match,
      match: this.getUpdatedMatchInfo(),
      teams: this.getUpdatedTeamInfo(),
      ranks: this.getUpdatedRankInfo(),
      timeLeft: this._timer.timeLeft,
      displayTime: this._timer.timeLeft
    };
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
      this._timer.on("match-endgame", () => {
        this._timerStyle = "yellow-bar";
      });
      this._timer.start();
      this.updateTimer();
      const timerID = global.setInterval(() => {
        this.updateTimer();
        if (this._timer.timeLeft <= 0) {
          this._timerStyle = "red-bar";
          this.updateTimer();
          global.clearInterval(timerID);
        }
      }, 1000);
    });
    SocketProvider.on("match-abort", () => {
      this._timer.abort();
      this.updateTimer();
    });
  }

  public componentWillUnmount() {
    SocketProvider.off("score-update");
    SocketProvider.off("match-start");
    SocketProvider.off("match-abort");
  }

  public componentDidUpdate(prevProps: IProps) {
    if (prevProps.match.matchKey !== this.props.match.matchKey) {
      this.setState({match: this.getUpdatedMatchInfo(), teams: this.getUpdatedTeamInfo(), ranks: this.getUpdatedRankInfo()});
    }
  }

  public render() {
    const {event} = this.props;
    const {activeMatch, match, timeLeft, displayTime} = this.state;
    const redTeams: MatchParticipant[] = [];
    const blueTeams: MatchParticipant[] = [];

    for (let i = 0; i < match.participants.length / 2; i++) {
      redTeams.push(match.participants[i]);
    }

    for (let i = match.participants.length / 2; i < match.participants.length; i++) {
      blueTeams.push(match.participants[i]);
    }

    const redTeamsView = redTeams.map((participant: MatchParticipant, index: number) => {
      let cardStyle = "";
      if (typeof activeMatch.participants !== "undefined") {
        if (activeMatch.participants[index].cardStatus === 1) {
          cardStyle = "yellow-card-bg";
        }
        if (activeMatch.participants[index].cardStatus === 2) {
          cardStyle = "red-card-bg";
        }
      }
      return (
        <div key={participant.matchParticipantKey} className="rr-play-team">
          <span>{participant.teamKey}</span>
          <span className={"rr-card-status " + cardStyle}/>
        </div>
      );
    });

    const blueTeamsView = blueTeams.map((participant: MatchParticipant, index: number) => {
      let cardStyle = "";
      if (typeof activeMatch.participants !== "undefined") {
        if (activeMatch.participants[index + activeMatch.participants.length / 2].cardStatus === 1) {
          cardStyle = "yellow-card-bg";
        }
        if (activeMatch.participants[index + activeMatch.participants.length / 2].cardStatus === 2) {
          cardStyle = "red-card-bg";
        }
      }
      return (
        <div key={participant.matchParticipantKey} className="rr-play-team">
          <span className={"rr-card-status " + cardStyle}/>
          <span>{participant.teamKey}</span>
        </div>
      );
    });

    const barWidth: number = (((this._timer.matchConfig.totalTime - timeLeft) / this._timer.matchConfig.totalTime) * 100);

    const barStyle = {
      width: barWidth + "%",
      borderTopRightRadius: barWidth >= 99 ? 0 : undefined,
      borderBottomRightRadius: barWidth >= 99 ? 0 : undefined
    };

    return (
      <div>
        <div id="rr-play-container">
          <div id="rr-play-top" className="center-items">
            <div id="rr-play-top-left" className="center-items">
              <div className="center-left-items"><img src={FIRST_LOGO} className="fit-h"/></div>
              <div className="center-left-items">{match.matchName}</div>
            </div>
            <div id="rr-play-top-right">
              <div className="rr-play-event center-items">{event.eventName}</div>
              <div className="rr-play-logo center-right-items"><img src={RR_LOGO} className="fit-h"/></div>
            </div>
          </div>
          <div id="rr-play-bot" className="center-items">
            <div id="rr-play-base">
              <div id="rr-play-blue">
                {blueTeamsView}
                {/*<div className="rr-alliance-box center-items blue-bg"><span>EDI</span></div>*/}
              </div>
              <div id="rr-play-mid">
                <div id="rr-play-mid-timer" className="center-items">
                  <div id="rr-play-mid-timer-bar" style={barStyle} className={this._timerStyle}/>
                  <div id="rr-play-mid-timer-time" className="center-items">{displayTime}</div>
                </div>
                <div id="rr-play-mid-scores">
                  <div id="rr-play-mid-blue" className="center-items blue-bg">
                    {activeMatch.blueScore}
                  </div>
                  <div id="rr-play-mid-red" className="center-items red-bg">
                    {activeMatch.redScore}
                  </div>
                </div>
              </div>
              <div id="rr-play-red">
                {redTeamsView}
                {/*<div className="rr-alliance-box center-items red-bg"><span>FRA</span></div>*/}
              </div>
            </div>
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

  private updateTimer() {
    let displayTime: number = this._timer.timeLeft;
    if (this._timer.mode === MatchMode.AUTONOMOUS || this._timer.mode === MatchMode.TELEOPERATED) {
      displayTime = this._timer.modeTimeLeft;
    }
    this.setState({displayTime, timeLeft: this._timer.timeLeft});
  }
}

export default MatchPlayScreen;