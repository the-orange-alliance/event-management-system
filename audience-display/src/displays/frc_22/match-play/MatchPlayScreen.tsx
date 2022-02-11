import * as React from 'react';
import "./MatchPlayScreen.css";
import {
  Event,
  Match,
  MatchConfiguration,
  MatchMode,
  MatchParticipant,
  MatchTimer,
  SocketProvider
} from "@the-orange-alliance/lib-ems";
import FACC_LOGO from "../res/facc-med-bg-light.png";
import TOA_LOGO from "../res/toa-generic-lol-black.png";

import MATCH_START from "../res/sounds/match_start.wav";
import MATCH_AUTO from "../res/sounds/match_auto_end_warning.wav";
import MATCH_TELE from "../res/sounds/match_tele_start.wav";
import MATCH_ENDGAME from "../res/sounds/match_end_start.wav";
import MATCH_END from "../res/sounds/match_end.wav";
import MATCH_ABORT from "../res/sounds/match_estop.wav";

const START_AUDIO = initAudio(MATCH_START);
const END_AUTO = initAudio(MATCH_AUTO);
const TELE_AUDIO = initAudio(MATCH_TELE);
const ENDGAME_AUDIO = initAudio(MATCH_ENDGAME);
const END_AUDIO = initAudio(MATCH_END);
const ABORT_AUDIO = initAudio(MATCH_ABORT);

interface IProps {
  event: Event;
  match: Match;
}

interface IState {
  match: Match;
  timeLeft: number;
  displayTime: number;
}

class MatchPlayScreen extends React.Component<IProps, IState> {
  private _timer: MatchTimer;
  private _timerStyle: string;
  private _matchEnded: boolean;

  constructor(props: IProps) {
    super(props);

    this._timer = new MatchTimer();
    this._timerStyle = "green-bar";
    this._matchEnded = false;

    this.state = {
      match: this.props.match,
      timeLeft: this._timer.timeLeft,
      displayTime: this._timer.modeTimeLeft
    };
  }

  public componentDidMount() {
    // If this page loads while a match is running, attempt to get the current timer state
    SocketProvider.once('get-timer-response', (mode, timeLeft, modeTimeLeft, matchConfig) => {
      this._timer.matchConfig = matchConfig;
      if(timeLeft > 0) {
        this.onMatchStart();
      }
      this._timer.timeLeft = timeLeft;
      this._timer.mode = mode;
      this._timer.modeTimeLeft = modeTimeLeft;
    });
    SocketProvider.emit('get-timer');

    SocketProvider.on("match-start", (timerJSON: any) => {
      START_AUDIO.play();
      this._timer.matchConfig = new MatchConfiguration().fromJSON(timerJSON);
      this.onMatchStart();
    });
    SocketProvider.on("match-abort", () => {
      ABORT_AUDIO.play();
      this._timer.abort();
      this.updateTimer();
      this._timer.removeAllListeners("match-transition");
      this._timer.removeAllListeners("match-tele");
      this._timer.removeAllListeners("match-endgame");
      this._timer.removeAllListeners("match-end");
      this._timerStyle = "red-bar";
      this.forceUpdate();
    });
    SocketProvider.on("score-update", (matchJSON: any) => {
      if (!this._matchEnded) {
        const oldMatch = this.props.match;
        const match: Match = new Match().fromJSON(matchJSON);
        const seasonKey: string = match.matchKey.split("-")[0];
        match.matchDetails = Match.getDetailsFromSeasonKey(seasonKey).fromJSON(matchJSON.details);
        match.participants = matchJSON.participants.map((pJSON: any) => new MatchParticipant().fromJSON(pJSON));
        match.participants.sort((a: MatchParticipant, b: MatchParticipant) => a.station - b.station);
        for (let i = 0; i < match.participants.length; i++) {
          if (typeof oldMatch.participants !== "undefined" && typeof oldMatch.participants[i].team !== "undefined") {
            match.participants[i].team = oldMatch.participants[i].team; // Both are sorted by station, so we can safely assume/do this.
          }
        }
        this.setState({match: match});
      }
    });
  }

  private onMatchStart() {
    this._timer.on("match-transition", () => {
      END_AUTO.play();
    });
    this._timer.on("match-tele", () => {
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
      this._timerStyle = "red-bar";
      this._matchEnded = true;
      this.forceUpdate();
    });
    this._timer.start();
    this.updateTimer();
    const timerID = global.setInterval(() => {
      this.updateTimer();
      if (this._timer.timeLeft <= 0) {
        if (this._timer.mode !== MatchMode.ABORTED) {
          END_AUDIO.play();
        }
        this.updateTimer();
        global.clearInterval(timerID);
      }
    }, 1000);
  }

  public componentWillUnmount() {
    SocketProvider.off("score-update");
    SocketProvider.off("match-start");
    SocketProvider.off("match-abort");
  }

  public componentDidUpdate(prevProps: IProps) {
    // This should only matter if score-update processes faster than prestart-response, of which we override score-update and take the prestart-response match.
    if (prevProps.match.matchKey.length !== this.props.match.matchKey.length && this.props.match.matchKey.length > 0) {
      this.setState({match: this.props.match});
    }
  }

  public render() {
    const {event} = this.props;
    const {match, timeLeft, displayTime} = this.state;
    const barWidth: number = (((this._timer.matchConfig.totalTime - timeLeft) / this._timer.matchConfig.totalTime) * 100);

    const barStyle = {
      width: barWidth + "%",
      borderTopRightRadius: barWidth >= 99 ? 0 : undefined,
      borderBottomRightRadius: barWidth >= 99 ? 0 : undefined
    };

    return (
      <div>
        <div id="ir-play-container">
          <div id="ir-play-top" className="center-items">
            <div id="ir-play-top-left" className="center-items">
              <div className="center-left-items"><img alt={'toa logo'} src={TOA_LOGO} className="fit-h"/></div>
              <div className="center-left-items">{match.matchName}</div>
            </div>
            <div id="ir-play-top-right">
              <div className="ir-play-event center-items">{event.eventName}</div>
              <div className="ir-play-logo center-right-items"><img alt={'facc logo'} src={FACC_LOGO}className="fit-h"/></div>
            </div>
          </div>
          <div id="ir-play-bot" className="center-items">
            <div id="ir-play-base">
              <div id="ir-play-blue">
                {this.displayBlueAlliance()}
              </div>
              <div id="ir-play-mid">
                <div id="ir-play-mid-timer" className="center-items">
                  <div id="ir-play-mid-timer-bar" style={barStyle} className={this._timerStyle}/>
                  <div id="ir-play-mid-timer-time" className="center-items">{displayTime}</div>
                </div>
                <div id="ir-play-mid-scores">
                  <div id="ir-play-mid-blue" className="center-items blue-bg">
                    {match.blueScore}
                  </div>
                  <div id="ir-play-mid-red" className="center-items red-bg">
                    {match.redScore}
                  </div>
                </div>
              </div>
              <div id="ir-play-red">
                {this.displayRedAlliance()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private displayRedAlliance() {
    const {match} = this.state;
    const participants: MatchParticipant[] = typeof match.participants !== "undefined" ? match.participants : [];
    const redAlliance: MatchParticipant[] = participants.filter((p: MatchParticipant) => p.station < 20);
    const redAllianceView = redAlliance.map((p: MatchParticipant) => {
      let cardStyle = "";
      if (p.cardStatus === 1) {
        cardStyle = "yellow-card-bg";
      }
      if (p.cardStatus === 2) {
        cardStyle = "red-card-bg";
      }
      return (
        <div key={p.matchParticipantKey} className="ir-play-team">
          {!p.team && <span>{p.teamKey}</span>}
          {p.team && <span>{p.team.robotName}</span>}
          <span className={"ir-card-status " + cardStyle}/>
        </div>
      );
    });
    return (redAllianceView);
  }

  private displayBlueAlliance() {
    const {match} = this.state;
    const participants: MatchParticipant[] = typeof match.participants !== "undefined" ? match.participants : [];
    const blueAlliance: MatchParticipant[] = participants.filter((p: MatchParticipant) => p.station >= 20);
    const blueAllianceView = blueAlliance.map((p: MatchParticipant) => {
      let cardStyle = "";
      if (p.cardStatus === 1) {
        cardStyle = "yellow-card-bg";
      }
      if (p.cardStatus === 2) {
        cardStyle = "red-card-bg";
      }
      return (
        <div key={p.matchParticipantKey} className="ir-play-team">
          <span className={"ir-card-status " + cardStyle}/>
          {!p.team && <span>{p.teamKey}</span>}
          {p.team && <span>{p.team.robotName}</span>}
        </div>
      );
    });
    return (blueAllianceView);
  }

  private updateTimer() {
    let displayTime: number;
    if (this._timer.mode === MatchMode.AUTONOMOUS) {
      displayTime = this._timer.modeTimeLeft;
    } else {
      displayTime = this._timer.timeLeft;
    }
    this.setState({timeLeft: this._timer.timeLeft, displayTime});
  }
}

function initAudio(url: any): any {
  const audio = new Audio(url);
  audio.volume = 0.5;
  return audio;
}

export default MatchPlayScreen;
