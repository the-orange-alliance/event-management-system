import * as moment from "moment";
import DayBreak from "./DayBreak";

export default class Day implements IPostableObject {
  private _id: number;
  private _startTime: moment.Moment;
  private _endTime: moment.Moment;
  private _matchesScheduled: number;
  private _breaks: DayBreak[];

  constructor() {
    this._matchesScheduled = 0;
    this._breaks = [];
  }

  public toJSON(): object {
    return {
      id: this.id,
      startTime: this.formattedStartTime,
      endTime: this.formattedEndTime,
      matchesScheduled: this.matchesScheduled,
      breaks: this.breaks.map(dayBreak => dayBreak.toJSON())
    };
  }

  public fromJSON(json: any): Day {
    const day: Day = new Day();
    day.id = json.id;
    day.startTime = moment(json.startTime, "dddd, MMMM Do YYYY, h:mm a");
    day.endTime = moment(json.endTime, "dddd, MMMM Do YYYY, h:mm a");
    day.matchesScheduled = json.matchesScheduled;
    day.breaks = json.breaks.map((dayBreak: any) => new DayBreak().fromJSON(dayBreak));
    return day;
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

  get startTime(): moment.Moment {
    return this._startTime;
  }

  set startTime(value: moment.Moment) {
    this._startTime = value;
  }

  get endTime(): moment.Moment {
    return this._endTime;
  }

  set endTime(value: moment.Moment) {
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