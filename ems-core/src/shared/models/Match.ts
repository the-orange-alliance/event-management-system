import * as moment from "moment";
import MatchParticipant from "./MatchParticipant";
import MatchDetails from "./MatchDetails";
import RoverRuckusMatchDetails from "./RoverRuckusMatchDetails";
import EnergyImpactMatchDetails from "./EnergyImpactMatchDetails";

export default class Match implements IPostableObject {
  private _matchKey: string;
  private _matchDetailKey: string;
  private _matchName: string;
  private _tournamentLevel: number;
  private _scheduledStartTime: moment.Moment;
  private _startTime: moment.Moment;
  private _prestartTime: moment.Moment;
  private _fieldNumber: number;
  private _cycleTime: number;
  private _redScore: number;
  private _blueScore: number;
  private _redMinPen: number;
  private _redMajPen: number;
  private _blueMinPen: number;
  private _blueMajPen: number;
  private _active: number;
  private _uploaded: boolean;

  // This item is separate, and not recorded directly in the 'Match' table.
  private _matchDetails: MatchDetails;
  private _participants: MatchParticipant[];

  constructor() {
    this._matchKey = "";
    this._matchDetailKey = "";
    this._matchName = "";
    this._tournamentLevel = -1;
    this._scheduledStartTime = moment();
    this._fieldNumber = -1;
    this._active = 0;
  }

  public static getDetailsFromSeasonKey(seasonKey: number | string): MatchDetails {
    const key: number = parseInt(seasonKey.toString(), 10);
    switch (key) {
      case 2018:
        return new EnergyImpactMatchDetails();
      case 1819:
        return new RoverRuckusMatchDetails();
      default:
        return new MatchDetails();
    }
  }

  public toJSON(): object {
    return {
      match_key: this.matchKey,
      match_detail_key: this.matchDetailKey,
      match_name: this.matchName,
      tournament_level: this.tournamentLevel,
      scheduled_time: this.scheduledStartTime,
      start_time: this.startTime,
      prestart_time: this.prestartTime,
      field_number: this.fieldNumber,
      cycle_time: this.cycleTime,
      red_score: this.redScore,
      red_min_pen: this.redMinPen,
      red_maj_pen: this.redMajPen,
      blue_score: this.blueScore,
      blue_min_pen: this.blueMinPen,
      blue_maj_pen: this.blueMajPen,
      active: this.active,
      uploaded: this.uploaded ? 1 : 0
    };
  }

  public fromJSON(json: any): Match {
    const match: Match = new Match();
    match.matchKey = json.match_key;
    match.matchDetailKey = json.match_detail_key;
    match.matchName = json.match_name;
    match.tournamentLevel = json.tournament_level;
    match.scheduledStartTime = moment(json.scheduled_time);
    match.startTime = moment(json.start_time);
    match.prestartTime = moment(json.prestart_time);
    match.fieldNumber = json.field_number;
    match.cycleTime = json.cycle_time;
    match.redScore = json.red_score;
    match.redMinPen = json.red_min_pen;
    match.redMajPen = json.red_maj_pen;
    match.blueScore = json.blue_score;
    match.blueMinPen = json.blue_min_pen;
    match.blueMajPen = json.blue_maj_pen;
    match.active = json.active;
    match.uploaded = json.uploaded === 1;
    return match;
  }

  get matchKey(): string {
    return this._matchKey;
  }

  set matchKey(value: string) {
    this._matchKey = value;
  }

  get matchDetailKey(): string {
    return this._matchDetailKey;
  }

  set matchDetailKey(value: string) {
    this._matchDetailKey = value;
  }

  get matchName(): string {
    return this._matchName;
  }

  set matchName(value: string) {
    this._matchName = value;
  }

  get tournamentLevel(): number {
    return this._tournamentLevel;
  }

  set tournamentLevel(value: number) {
    this._tournamentLevel = value;
  }

  get scheduledStartTime(): moment.Moment {
    return this._scheduledStartTime;
  }

  set scheduledStartTime(value: moment.Moment) {
    this._scheduledStartTime = value;
  }

  get startTime(): moment.Moment {
    return this._startTime;
  }

  set startTime(value: moment.Moment) {
    this._startTime = value;
  }

  get prestartTime(): moment.Moment {
    return this._prestartTime;
  }

  set prestartTime(value: moment.Moment) {
    this._prestartTime = value;
  }

  get fieldNumber(): number {
    return this._fieldNumber;
  }

  set fieldNumber(value: number) {
    this._fieldNumber = value;
  }

  get cycleTime(): number {
    return this._cycleTime;
  }

  set cycleTime(value: number) {
    this._cycleTime = value;
  }

  get redScore(): number {
    return this._redScore;
  }

  set redScore(value: number) {
    this._redScore = value;
  }

  get blueScore(): number {
    return this._blueScore;
  }

  set blueScore(value: number) {
    this._blueScore = value;
  }

  get redMinPen(): number {
    return this._redMinPen;
  }

  set redMinPen(value: number) {
    this._redMinPen = value;
  }

  get redMajPen(): number {
    return this._redMajPen;
  }

  set redMajPen(value: number) {
    this._redMajPen = value;
  }

  get blueMinPen(): number {
    return this._blueMinPen;
  }

  set blueMinPen(value: number) {
    this._blueMinPen = value;
  }

  get blueMajPen(): number {
    return this._blueMajPen;
  }

  set blueMajPen(value: number) {
    this._blueMajPen = value;
  }

  get active(): number {
    return this._active;
  }

  set active(value: number) {
    this._active = value;
  }

  get uploaded(): boolean {
    return this._uploaded;
  }

  set uploaded(value: boolean) {
    this._uploaded = value;
  }

  get matchDetails(): MatchDetails {
    return this._matchDetails;
  }

  set matchDetails(value: MatchDetails) {
    this._matchDetails = value;
  }

  get participants(): MatchParticipant[] {
    return this._participants;
  }

  set participants(value: MatchParticipant[]) {
    this._participants = value;
  }
}