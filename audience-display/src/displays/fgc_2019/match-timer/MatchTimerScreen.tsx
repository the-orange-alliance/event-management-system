import * as React from "react";
import {Match, MatchConfiguration, MatchMode, MatchTimer, SocketProvider} from "@the-orange-alliance/lib-ems";
import moment from "moment";

import "./MatchTimerScreen.css";

import FGC_LEFT_LOGO from "../res/Logo-V.png";
import FGC_RIGHT_LOGO from "../res/Powered by.png";
import MatchParticipant from "@the-orange-alliance/lib-ems/dist/models/ems/MatchParticipant";

import MATCH_START from "../res/sounds/match_start.wav";
import MATCH_AUTO from "../res/sounds/match_auto_end_warning.wav";
import MATCH_TELE from "../res/sounds/match_tele_start.wav";
import MATCH_PRE_TELE from "../res/sounds/match_tele_pre_start.wav";
import MATCH_ENDGAME from "../res/sounds/match_end_start.wav";
import MATCH_END from "../res/sounds/match_end.wav";
import MATCH_ABORT from "../res/sounds/match_estop.wav";
// import VerticalBar from "./VerticalBar";
// import OceanOpportunitiesMatchDetails from "@the-orange-alliance/lib-ems/dist/models/ems/games/ocean-opportunities/OceanOpportunitiesMatchDetails";
// import CoopertitionBar from "./CoopertitionBar";

const START_AUDIO = initAudio(MATCH_START);
const END_AUTO = initAudio(MATCH_AUTO);
const TELE_AUDIO = initAudio(MATCH_TELE);
const TELE_PRE_AUDIO = initAudio(MATCH_PRE_TELE);
const ENDGAME_AUDIO = initAudio(MATCH_ENDGAME);
const END_AUDIO = initAudio(MATCH_END);
const ABORT_AUDIO = initAudio(MATCH_ABORT);

interface IProps {
  match: Match
}

interface IState {
  match: Match
  timeLeft: number
}

class MatchTimerScreen extends React.Component<IProps, IState> {
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
    // const details = match.matchDetails as OceanOpportunitiesMatchDetails || new OceanOpportunitiesMatchDetails();
    const time = moment.duration(timeLeft, "seconds");
    const disMin = time.minutes() < 10 ? "0" + time.minutes().toString() : time.minutes().toString();
    const disSec = time.seconds() < 10 ? "0" + time.seconds().toString() : time.seconds().toString();
    const matchLabel = match.tournamentLevel > -1 ? match.abbreviatedName : "TEST";

    return (
      <div id={"fgc-body"}>

        <div id="timer-info">
          <div id="timer-info-left">
            <div className="timer-info-left center-items">
              <span>MATCH</span>
            </div>
            <div className="timer-info-right center-items">
              <span>{matchLabel}</span>
            </div>
          </div>
          <div id="timer-info-left">
            <div className="timer-info-left center-items">
              <span>FIELD</span>
            </div>
            <div className="timer-info-right center-items">
              <span>{match.fieldNumber}</span>
            </div>
          </div>
        </div>

        <div id={"fgc-timer-container"}>
          <div id={"fgc-timer-top"}>
            <div id={"fgc-timer-display"}>
              <span>{disMin}:{disSec}</span>
            </div>
          </div>
          <div id={"fgc-timer-bot"}>
            <div id={"fgc-timer-bot-left"} className={"teams-container teams-container-left"}>

              <div className={"teams red-bg"}>
                {this.displayRedAlliance()}
              </div>

            </div>
            <div id={"fgc-timer-bot-center"}>
              <div className={"timer-score timer-score-left red-bg"}>
                <span>{match.redScore}</span>
              </div>
              <div className={"timer-score timer-score-right blue-bg"}>
                <span>{match.blueScore}</span>
              </div>
            </div>
            <div id={"fgc-timer-bot-right"} className={"teams-container teams-container-right"}>

              <div className={"teams blue-bg"}>
                {this.displayBlueAlliance()}
              </div>

            </div>
          </div>
        </div>

        <div id={"timer-left-side-logo"} className={"center-items"}>
          <img src={FGC_LEFT_LOGO} className={"fit-w"}/>
        </div>

        <div id={"timer-right-side-logo"} className={"center-items"}>
          <img src={FGC_RIGHT_LOGO} className={"fit-w"}/>
        </div>

      </div>
    );
  }

  private displayRedAlliance() {
    const {match} = this.state;
    const participants: MatchParticipant[] = typeof match.participants !== "undefined" ? match.participants : [];
    const redAlliance: MatchParticipant[] = participants.filter((p: MatchParticipant) => p.station < 20);
    const redAllianceView = redAlliance.map((p: MatchParticipant) => {
      return (
        <div key={p.matchParticipantKey} className="team left-team">
          <div className="team-name-left">
            <span>{p.team.country}</span>
          </div>
          <div className="team-flag">
            <span className={"flag-icon flag-icon-" + p.team.countryCode}/>
          </div>
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
      return (
        <div key={p.matchParticipantKey} className="team right-team">
          <div className="team-flag">
            <span className={"flag-icon flag-icon-" + p.team.countryCode}/>
          </div>
          <div className="team-name-right">
            <span>{p.team.country}</span>
          </div>
        </div>
      );
    });
    return (blueAllianceView);
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

export default MatchTimerScreen;
