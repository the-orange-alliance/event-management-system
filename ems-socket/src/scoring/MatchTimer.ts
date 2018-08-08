import {MatchMode} from "./MatchMode";
import logger from "../logger";
import events = require("events");

export default class MatchTimer extends events.EventEmitter {
  // Time/state variables
  private _delayTime: number;
  private _autoTime: number;
  private _teleTime: number;
  private _endTime: number;
  private _totalTime: number;

  // Dynamic timer variables
  private _mode: MatchMode;
  private _timerID: any;
  private _timeLeft: number;
  private _modeTimeLeft: number;

  constructor() {
    super();
    this._delayTime = 0;
    this._autoTime = 0;
    this._teleTime = 150;
    this._endTime = 30;
    this._totalTime = 150;

    this._mode = MatchMode.RESET;
    this._timerID = null;
    this._timeLeft = this._totalTime;
    this._modeTimeLeft = this._delayTime;
  }

  public start() {
    if (!this.inProgress()) {
      if (this.delayTime > 0) {
        this._mode = MatchMode.PRESTART;
        this._modeTimeLeft = this.delayTime;
      } else if (this.autoTime > 0) {
        this._mode = MatchMode.AUTONOMOUS;
        this._modeTimeLeft = this.autoTime;
      } else {
        this._mode = MatchMode.TELEOPERATED;
        this._modeTimeLeft = this.teleTime;
      }
      this._timeLeft = this._totalTime;
      this.emit("match-start", this._timeLeft);
      logger.info("Starting a match.");
      this.tick();
      this._timerID = global.setInterval(() => {
        this.tick();
      }, 1000);
    }
  }

  public stop() {
    if (this.inProgress()) {
      global.clearInterval(this._timerID);
      this._timerID = null;
      this._mode = MatchMode.ENDED;
      this.emit("match-end");
      logger.info("Ended a match");
    }
  }

  public abort() {
    if (this.inProgress()) {
      global.clearInterval(this._timerID);
      this._timerID = null;
      this._mode = MatchMode.ABORTED;
      this.emit("match-abort");
      logger.info("Aborted a match");
    }
  }

  public inProgress() {
    return this._timerID !== null;
  }

  private tick() {
    logger.info(this._modeTimeLeft + "s");
    if (this._timeLeft === 0) {
      this.stop();
    }

    if (this._modeTimeLeft === 0) {
      switch (this._mode) {
        case MatchMode.PRESTART:
          if (this.autoTime > 0) {
            this._mode = MatchMode.AUTONOMOUS;
            this._modeTimeLeft = this.autoTime;
            this.emit("match-auto");
            logger.info("Autonomous period started.");
          } else {
            this._mode = MatchMode.TELEOPERATED;
            this._modeTimeLeft = this.teleTime;
            this.emit("match-tele");
            logger.info("Teleoperated period started.");
          }
          break;
        case MatchMode.AUTONOMOUS:
          if (this.teleTime > 0) {
            this._mode = MatchMode.TELEOPERATED;
            this._modeTimeLeft = this.teleTime;
            logger.info("Teleoperated period started.");
          } else {
            this.stop();
          }
      }
    } else {
      this._modeTimeLeft--;
      this._timeLeft--;

      if (this.endTime > 0 && this._timeLeft === this.endTime) {
        this.emit("match-endgame");
        logger.info("Endgame started.")
      }
    }
  }

  get delayTime(): number {
    return this._delayTime;
  }

  set delayTime(value: number) {
    this._totalTime = this._delayTime + this._autoTime + this._teleTime;
    this._delayTime = value;
  }

  get autoTime(): number {
    return this._autoTime;
  }

  set autoTime(value: number) {
    this._totalTime = this._delayTime + this._autoTime + this._teleTime;
    this._autoTime = value;
  }

  get teleTime(): number {
    return this._teleTime;
  }

  set teleTime(value: number) {
    this._totalTime = this._delayTime + this._autoTime + this._teleTime;
    this._teleTime = value;
  }

  get endTime(): number {
    return this._endTime;
  }

  set endTime(value: number) {
    this._endTime = value;
  }

  get totalTime(): number {
    return this._totalTime;
  }

  get mode(): MatchMode {
    return this._mode;
  }

  set mode(value: MatchMode) {
    this._mode = value;
  }
}
