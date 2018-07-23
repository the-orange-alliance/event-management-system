import * as moment from "moment";
import {TournamentLevels} from "../AppTypes";

export default class ScheduleItem implements IPostableObject {

  private readonly _type: TournamentLevels;
  private _key: string;
  private _name: string;
  private _day: number;
  private _startTime: moment.Moment;
  private _duration: number;
  private _isMatch: boolean;

  constructor(type: TournamentLevels) {
    this._type = type;
    this._key = "";
    this._name = "";
    this._day = -1;
    this._startTime = moment();
    this._duration = -1;
    this._isMatch = false;
  }

  public toJSON(): object {
    return {
      schedule_item_key: this.key,
      schedule_item_type: this.type,
      schedule_item_name: this.name,
      schedule_day: this.day,
      start_time: this.formattedStartTime,
      duration: this.duration,
      is_match: this.isMatch ? 1 : 0
    };
  }

  public fromJSON(json: any): ScheduleItem {
    const item: ScheduleItem = new ScheduleItem(json.schedule_item_type);
    item.key = json.schedule_item_key;
    item.name = json.schedule_item_name;
    item.day = json.schedule_day;
    item.startTime = moment(json.start_time, "dddd, MMMM Do YYYY, h:mm a");
    item.duration = json.duration;
    item.isMatch = json.is_match === 1;
    return item;
  };

  get formattedStartTime(): string {
    return this.startTime.format("dddd, MMMM Do YYYY, h:mm a");
  }

  get key(): string {
    return this._key;
  }

  set key(value: string) {
    this._key = value;
  }

  get type(): TournamentLevels {
    return this._type;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get day(): number {
    return this._day;
  }

  set day(value: number) {
    this._day = value;
  }

  get startTime(): moment.Moment {
    return this._startTime;
  }

  set startTime(value: moment.Moment) {
    this._startTime = value;
  }

  get duration(): number {
    return this._duration;
  }

  set duration(value: number) {
    this._duration = value;
  }

  get isMatch(): boolean {
    return this._isMatch;
  }

  set isMatch(value: boolean) {
    this._isMatch = value;
  }
}