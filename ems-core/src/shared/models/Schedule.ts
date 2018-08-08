import Day from "./Day";
import {TournamentLevels} from "../AppTypes";
import * as moment from "moment";
import ScheduleItem from "./ScheduleItem";
import Event from "./Event";

export default class Schedule implements IPostableObject {
  private readonly _type: TournamentLevels;
  private _days: Day[];
  private _matchConcurrency: number;
  private _teamsParticipating: number;
  private _teamsPerAlliance: number;
  private _matchesPerTeam: number;
  private _totalMatches: number;
  private _cycleTime: number;

  // This is kind of a loner variable.
  private _validationMessage: string;

  constructor(type: TournamentLevels) {
    this._type = type;
    this._days = [];
    this._matchConcurrency = 1;
    this._teamsParticipating = 0;
    this._teamsPerAlliance = 3;
    this._matchesPerTeam = 5;
    this._totalMatches = this.maxTotalMatches;
    this._cycleTime = 7;
    this.addDay();
  }

  public toJSON(): object {
    return {
      type: this.type,
      matchConcurrency: this.matchConcurrency,
      teamsParticipating: this.teamsParticipating,
      matchesPerTeam: this.matchesPerTeam,
      totalMatches: this.totalMatches,
      cycleTime: this.cycleTime,
      days: this.days.map(day => day.toJSON())
    };
  }

  public fromJSON(json: any): Schedule {
    const schedule: Schedule = new Schedule(json.type);
    schedule.matchConcurrency = json.matchConcurrency;
    schedule.teamsParticipating = json.teamsParticipating;
    schedule.matchesPerTeam = json.matchesPerTeam;
    schedule.totalMatches = json.totalMatches;
    schedule.cycleTime = json.cycleTime;
    schedule.days = json.days.map((day: any) => new Day().fromJSON(day));
    return schedule;
  }

  public generateSchedule(event: Event): ScheduleItem[] {
    const scheduleItems: ScheduleItem[] = [];
    let totalMatches: number = 0;
    for (const day of this.days) {
      const matchBreaks: number[] = day.breaks.map(dayBreak => dayBreak.match);
      let breakPadding: number = 0;
      let dayMatches: number = 0;
      for (let i = 0; i < day.matchesScheduled; i++) {
        const item: ScheduleItem = new ScheduleItem(this.type);
        const breakIndex = matchBreaks.indexOf(dayMatches + 1);

        let matchIndex = dayMatches;
        if (this.matchConcurrency > 1) {
          matchIndex = dayMatches - 1;
        }

        item.key = event.eventKey + "-" + this.type.substring(0, 1) + ((scheduleItems.length + 1));
        item.day = day.id;
        item.duration = this.cycleTime;
        item.name = this.type + " Match " + (totalMatches + 1);
        item.startTime = moment(day.startTime).add((Math.ceil(matchIndex / this.matchConcurrency) * this.cycleTime) + breakPadding, "minutes");
        item.isMatch = true;
        scheduleItems.push(item);
        dayMatches++;
        totalMatches++;

        if (breakIndex !== -1) {
          const breakItem: ScheduleItem = new ScheduleItem(this.type);
          breakItem.key = event.eventKey + "-" + this.type.substring(0, 1) + (scheduleItems.length + 1);
          breakItem.day = day.id;
          breakItem.duration = day.breaks[breakIndex].duration;
          breakItem.name = day.breaks[breakIndex].name;
          breakItem.startTime = day.breaks[breakIndex].startTime;
          breakItem.isMatch = false;
          scheduleItems.push(breakItem);
          breakPadding += day.breaks[breakIndex].duration;
        }
      }

    }
    return scheduleItems;
  }

  public containsWarnings(): boolean {
    return this.matchConcurrency > 1;
  }

  public isValid(): boolean {
    let allMatchesScheduled: boolean = true;
    let daysAreAfterEachOther: boolean = true;
    let daysHaveAtLeastOneMatch: boolean = true;
    let previousDayStart = moment(this.days[0].startTime).subtract(1, "days");
    for (const day of this.days) {
      if (!day.startTime.isAfter(previousDayStart, "day")) {
        daysAreAfterEachOther = false;
      }
      if (day.matchesScheduled <= 0) {
        daysHaveAtLeastOneMatch = false;
      }
      previousDayStart = moment(day.startTime);
    }
    allMatchesScheduled = this.remainingMatches === 0;
    if (!allMatchesScheduled) {
      const matchesLeft = Math.abs(this.remainingMatches);
      if (this.remainingMatches < 0) {
        this._validationMessage = `Too many matches are scheduled. You need to remove ${matchesLeft} matches from the schedule.`;
      } else {
        this._validationMessage = `Not all of the matches are scheduled. You need to schedule ${matchesLeft} more matches.`;
      }
    } else if (!daysAreAfterEachOther) {
      this._validationMessage = "Not all of the scheduled day start times are after each other.";
    } else if (!daysHaveAtLeastOneMatch) {
      this._validationMessage = "Not all scheduled days contain at least 1 match.";
    } else {
      this._validationMessage = "";
    }
    return allMatchesScheduled && daysAreAfterEachOther && daysHaveAtLeastOneMatch;
  }

  public addDay(): void {
    const day: Day = new Day();
    day.id = this._days.length;
    day.startTime = moment();
    day.endTime = moment();
    if (this.remainingMatches > 0) { // A bit of 'smart' updating
      day.matchesScheduled = this.remainingMatches;
    }
    this._days.push(day);
  }

  public removeDay(): void {
    if (this._days.length > 0) {
      this._days.pop();
    }
  }

  public forceUpdate() {
    for (const day of this.days) {
      const matchTime = Math.ceil(day.matchesScheduled / this.matchConcurrency) * this.cycleTime;
      let breakTime = 0;
      for (const dayBreak of day.breaks) {
        breakTime += dayBreak.duration;
        dayBreak.startTime = moment(day.startTime).add(Math.ceil(dayBreak.match / this.matchConcurrency) * this.cycleTime, "minutes");
      }
      day.endTime = moment(day.startTime).add(matchTime + breakTime, "minutes");
    }
  }

  get remainingMatches(): number {
    let scheduledMatches = 0;
    for (const day of this.days) {
      scheduledMatches += day.matchesScheduled;
    }
    return this.maxTotalMatches - scheduledMatches;
  }

  get maxTotalMatches(): number {
    return Math.ceil((this.teamsParticipating * this.matchesPerTeam) / (this.teamsPerAlliance * 2));
  }

  get matchConcurrency(): number {
    return this._matchConcurrency;
  }

  set matchConcurrency(value: number) {
    this._matchConcurrency = value;
  }

  get teamsParticipating(): number {
    return this._teamsParticipating;
  }

  set teamsParticipating(value: number) {
    this._teamsParticipating = value;
  }

  get teamsPerAlliance(): number {
    return this._teamsPerAlliance;
  }

  set teamsPerAlliance(value: number) {
    this._teamsPerAlliance = value;
  }

  get matchesPerTeam(): number {
    return this._matchesPerTeam;
  }

  set matchesPerTeam(value: number) {
    this._matchesPerTeam = value;
  }

  get totalMatches(): number {
    return this._totalMatches;
  }

  set totalMatches(value: number) {
    this._totalMatches = value;
  }

  get cycleTime(): number {
    return this._cycleTime;
  }

  set cycleTime(value: number) {
    this._cycleTime = value;
  }

  get days(): Day[] {
    return this._days;
  }

  set days(value: Day[]) {
    this._days = value;
  }

  get type(): TournamentLevels {
    return this._type;
  }

  get validationMessage(): string {
    return this._validationMessage;
  }
}