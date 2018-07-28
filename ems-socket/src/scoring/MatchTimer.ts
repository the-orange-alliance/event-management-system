import EventEmitter = NodeJS.EventEmitter;
import {MatchMode} from "./MatchMode";
import Timer = NodeJS.Timer;

class MatchTimer extends EventEmitter {
  // Time/state variables
  private _delayTime: number;
  private _autoTime: number;
  private _teleTime: number;
  private _endTime: number;
  private _totalTime: number;

  // Dynamic timer variables
  private _mode: MatchMode;
  private _timerID: Timer | null;
  private _timeLeft: number;
  private _modeTimeLeft: number;

  constructor() {
    super();
    this._delayTime = 0;
    this._autoTime = 15;
    this._teleTime = 135;
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
      this._timerID = setInterval(() => {
        // tick
      }, 1000);
    }
  }

  public stop() {
    if (this.inProgress()) {
      clearInterval((this._timerID as Timer));
      this._timerID = null;
    }
  }

  public inProgress() {
    return this._timerID !== null;
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