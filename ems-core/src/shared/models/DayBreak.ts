import * as moment from "moment";

export default class DayBreak implements IPostableObject {
  private _id: number;
  private _name: string;
  private _startTime: moment.Moment;
  private _endTime: moment.Moment;
  private _duration: number;
  private _match: number;

  constructor() {
    this._name = "Break";
    this._duration = 30;
    this._match = 0;
  }

  public toJSON(): object {
    return {
      id: this.id,
      name: this.name,
      startTime: this.formattedStartTime,
      duration: this.duration,
      match: this.match
    };
  }

  public fromJSON(json: any): DayBreak {
    const dayBreak: DayBreak = new DayBreak();
    dayBreak.id = json.id;
    dayBreak.name = json.name;
    dayBreak.startTime = moment(json.startTime, "dddd, MMMM Do YYYY, h:mm a");
    dayBreak.duration = json.duration;
    dayBreak.match = json.match;
    return dayBreak;
  }

  public isValid(): boolean {
    return this.isValidMatch() && this.isValidDuration();
  }

  public isValidMatch(): boolean {
    return this.match > 0;
  }

  public isValidDuration(): boolean {
    return this.duration > 0;
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

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get startTime(): moment.Moment {
    return this._startTime;
  }

  set startTime(value: moment.Moment) {
    this.endTime = moment(value).add(this.duration, "minutes");
    this._startTime = value;
  }

  get endTime(): moment.Moment {
    return this._endTime;
  }

  set endTime(value: moment.Moment) {
    this._endTime = value;
  }

  get duration(): number {
    return this._duration;
  }

  set duration(value: number) {
    this.endTime = moment(this.startTime).add(value, "minutes");
    this._duration = value;
  }

  get match(): number {
    return this._match;
  }

  set match(value: number) {
    this._match = value;
  }
}