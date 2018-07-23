import {Moment} from "moment";
import DayBreak from "./DayBreak";

export default class Day {
  private _id: number;
  private _startTime: Moment;
  private _endTime: Moment;
  private _matchesScheduled: number;
  private _breaks: DayBreak[];

  constructor() {
    this._matchesScheduled = 0;
    this._breaks = [];
  }

  public isValid(): boolean {
    return this.matchesScheduled > 0;
  }

  public addBreak(): void {
    const dayBreak: DayBreak = new DayBreak();
    dayBreak.id = this._breaks.length;
    dayBreak.startTime = this.startTime;
    this._breaks.push(dayBreak);
  }

  public removeBreak(): void {
    if (this._breaks.length > 0) {
      this._breaks.pop();
    }
  }

  get formattedStartTime(): string {
    return this.startTime.format("dddd, MMMM Do YYYY, h:mm a");
  }

  get formattedEndTime(): string {
    return this.endTime.format("dddd, MMMM Do YYYY, h:mm a");
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get startTime(): Moment {
    return this._startTime;
  }

  set startTime(value: Moment) {
    this._startTime = value;
  }

  get endTime(): Moment {
    return this._endTime;
  }

  set endTime(value: Moment) {
    this._endTime = value;
  }

  get matchesScheduled(): number {
    return this._matchesScheduled;
  }

  set matchesScheduled(value: number) {
    this._matchesScheduled = value;
  }

  get breaks(): DayBreak[] {
    return this._breaks;
  }

  set breaks(value: DayBreak[]) {
    this._breaks = value;
  }
}