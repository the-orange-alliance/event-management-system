import * as React from 'react';
import "./MatchPlayScreen.css";
import {
  Event, Match, MatchMode, MatchConfiguration, MatchParticipant, MatchTimer, RoverRuckusMatchDetails, SocketProvider, Ranking, Team
} from "@the-orange-alliance/lib-ems";
import FIRST_LOGO from "../res/FIRST_logo_transparent.png";
import RR_LOGO from "../res/rr_logo_transparent.png";

import MATCH_START from "../res/sounds/match_start.wav";
import MATCH_AUTO from "../res/sounds/match_auto_end_warning.wav";
import MATCH_TELE from "../res/sounds/match_tele_start.wav";
import MATCH_PRE_TELE from "../res/sounds/match_tele_pre_start.wav";
import MATCH_ENDGAME from "../res/sounds/match_end_start.wav";
import MATCH_END from "../res/sounds/match_end.wav";
import MATCH_ABORT from "../res/sounds/match_estop.wav";

const START_AUDIO = initAudio(MATCH_START);
const END_AUTO = initAudio(MATCH_AUTO);
const TELE_AUDIO = initAudio(MATCH_TELE);
const TELE_PRE_AUDIO = initAudio(MATCH_PRE_TELE);
const ENDGAME_AUDIO = initAudio(MATCH_ENDGAME);
const END_AUDIO = initAudio(MATCH_END);
const ABORT_AUDIO = initAudio(MATCH_ABORT);

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
      START_AUDIO.play();
      this._timer.matchConfig = new MatchConfiguration().fromJSON(timerJSON);
      this._timer.on("match-transition", () => {
        END_AUTO.play();
      });
      this._timer.on("match-tele", () => {
        console.log("should be playing sound...");
        TELE_AUDIO.play();
      });
      this._timer.on("match-endgame", () => {
        ENDGAME_AUDIO.play();
        this._timerStyle = "yellow-bar";
      });
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
          if (this._timer.mode !== MatchMode.ABORTED) {
            END_AUDIO.play();
          }
          this._timerStyle = "red-bar";
          this.updateTimer();
          global.clearInterval(timerID);
        }
      }, 1000);
    });
    SocketProvider.on("match-abort", () => {
      ABORT_AUDIO.play();
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
              <div className="center-left-items"><img alt={'FIRST logo'} src={FIRST_LOGO} className="fit-h"/></div>
              <div className="center-left-items">{match.matchName}</div>
            </div>
            <div id="rr-play-top-right">
              <div className="rr-play-event center-items">{event.eventName}</div>
              <div className="rr-play-logo center-right-items"><img alt={'Rover Ruckus logo'} src={RR_LOGO} className="fit-h"/></div>
            </div>
          </div>
          <div id="rr-play-bot" className="center-items">
            <div id="rr-play-base">
              <div id="rr-play-blue">
                {blueTeamsView}
                {
                  match.tournamentLevel >= 10 &&
                  <div className="rr-alliance-box center-items blue-bg"><span>{blueTeams[0].getAllianceRankFromKey()}</span></div>
                }
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
                {
                  match.tournamentLevel >= 10 &&
                  <div className="rr-alliance-box center-items red-bg"><span>{redTeams[0].getAllianceRankFromKey()}</span></div>
                }
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
    if (this._timer.mode === MatchMode.AUTONOMOUS || this._timer.mode === MatchMode.TELEOPERATED || this._timer.mode === MatchMode.TRANSITION) {
      displayTime = this._timer.modeTimeLeft;
    }
    if (this._timer.mode === MatchMode.TRANSITION && this._timer.modeTimeLeft === 3) {
      TELE_PRE_AUDIO.play();
    }
    this.setState({displayTime, timeLeft: this._timer.timeLeft});
  }
}

function initAudio(url: any): any {
  const audio = new Audio(url);
  audio.volume = 0.5;
  return audio;
}


export default MatchPlayScreen;
