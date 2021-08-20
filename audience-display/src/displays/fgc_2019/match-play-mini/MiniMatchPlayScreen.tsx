import * as React from "react";
import {Match, MatchConfiguration, MatchMode, MatchTimer, SocketProvider} from "@the-orange-alliance/lib-ems";
import moment from "moment";

import "./MiniMatchPlayScreen.css";

import FGC_LOGO from "../res/Logo-H-Narrow.png";
import MatchParticipant from "@the-orange-alliance/lib-ems/dist/models/ems/MatchParticipant";

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
  match: Match,
  position: string,
}

interface IState {
  match: Match
  timeLeft: number
}

class MiniMatchPlayScreen extends React.Component<IProps, IState> {
  private _timer: MatchTimer;
  private _matchEnded: boolean;

  constructor(props: IProps) {
    super(props);

    this._timer = new MatchTimer();
    this._matchEnded = false;

    this.state = {
      match: this.props.match,
      timeLeft: this._timer.timeLeft
    };
  }

  public componentDidMount() {
    SocketProvider.on("match-start", (timerJSON: any) => {
      START_AUDIO.play();
      this._timer.matchConfig = new MatchConfiguration().fromJSON(timerJSON);
      this._timer.on("match-transition", () => {
        END_AUTO.play();
      });
      this._timer.on("match-tele", () => {
        TELE_AUDIO.play();
      });
      this._timer.on("match-endgame", () => {
        ENDGAME_AUDIO.play();
      });
      this._timer.on("match-end", () => {
        this._timer.removeAllListeners("match-transition");
        this._timer.removeAllListeners("match-tele");
        this._timer.removeAllListeners("match-endgame");
        this._timer.removeAllListeners("match-abort");
        this._matchEnded = true;
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
    const {match} = this.state;
    const {timeLeft} = this.state;
    const {position} = this.props;
    const time = moment.duration(timeLeft, "seconds");
    const disMin = time.minutes() < 10 ? "0" + time.minutes().toString() : time.minutes().toString();
    const disSec = time.seconds() < 10 ? "0" + time.seconds().toString() : time.seconds().toString();

    let positionClass: any = "";
    if (position.indexOf("top-left") > -1) {
      positionClass = "mini-top-left";
    } else if (position.indexOf("top-right") > -1) {
      positionClass = "mini-top-right";
    } else if (position.indexOf("bot-left") > -1) {
      positionClass = "mini-bot-left";
    } else if (position.indexOf("bot-right") > -1) {
      positionClass = "mini-bot-right";
    }

    return (
      <div>
        <div id="mini-play-display-center" className={positionClass}>
          <div id="mini-score-container-header">
            <img alt={'fgc logo'} src={FGC_LOGO} className="fit-w"/>
          </div>

          <div id="mini-score-container-scores">
            <div id="mini-score-container-red">
              <div className="red-bg center-items">
                <span>{match.redScore}</span>
              </div>
            </div>
            <div id="mini-score-container-blue">
              <div className="blue-bg center-items">
                <span>{match.blueScore}</span>
              </div>
            </div>
          </div>

          <div id="mini-score-container-timer">
            <span>{disMin}:{disSec}</span>
          </div>
        </div>
      </div>
    );
  }

  private updateTimer() {
    if (this._timer.mode === MatchMode.TRANSITION && this._timer.modeTimeLeft === 3) {
      TELE_PRE_AUDIO.play();
    }
    this.setState({timeLeft: this._timer.timeLeft});
  }
}

function initAudio(url: any): any {
  const audio = new Audio(url);
  audio.volume = 0.5;
  return audio;
}

export default MiniMatchPlayScreen;
