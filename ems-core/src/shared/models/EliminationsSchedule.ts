import Schedule from "./Schedule";
import ScheduleItem from "./ScheduleItem";
import Event from "./Event";
import Day from "./Day";
import {EliminationsFormats} from "../AppTypes";

export default class EliminationsSchedule extends Schedule {
  private _allianceCaptains: number;
  private _elimsFormat: EliminationsFormats;

  // Inheritance is cool!
  constructor() {
    super("Eliminations");
    this._allianceCaptains = 4;
    this._elimsFormat = "bo3";
  }

  public toJSON(): object {
    return {
      type: this.type,
      matchConcurrency: this.matchConcurrency,
      teamsParticipating: this.teamsParticipating,
      matchesPerTeam: this.matchesPerTeam,
      totalMatches: this.totalMatches,
      cycleTime: this.cycleTime,
      alliance_captains: this.allianceCaptains,
      days: this.days.map(day => day.toJSON())
    };
  }

  public fromJSON(json: any): EliminationsSchedule {
    const schedule: EliminationsSchedule = new EliminationsSchedule();
    schedule.matchConcurrency = json.matchConcurrency;
    schedule.teamsParticipating = json.teamsParticipating;
    schedule.matchesPerTeam = json.matchesPerTeam;
    schedule.totalMatches = json.totalMatches;
    schedule.cycleTime = json.cycleTime;
    schedule.allianceCaptains = json.alliance_captains;
    schedule.days = json.days.map((day: any) => new Day().fromJSON(day));
    return schedule;
  }

  public generateSchedule(event: Event): ScheduleItem[] {
    const items: ScheduleItem[] = super.generateSchedule(event);
    let start = 0;
    if (this.allianceCaptains === 16) {
      for (let i = 0; i < this.getMatchesFromFormat(); i++) { // Matches
        for (let j = 0; j < 8; j++) { // Series
          let matchStr = "";
          if (this.getMatchesFromFormat() > 1 && i + 1 === this.getMatchesFromFormat()) {
            matchStr = "Tiebreaker";
          } else {
            matchStr = this.getMatchesFromFormat() > 1 ? "Match " + (i + 1) : "";
          }
          items[start].name = `Octofinal ${j + 1} ${matchStr}`;
          start++;
        }
      }
    }
    if (this.allianceCaptains >= 8) {
      for (let i = 0; i < this.getMatchesFromFormat(); i++) { // Matches
        for (let j = 0; j < 4; j++) { // Series
          let matchStr = "";
          if (this.getMatchesFromFormat() > 1 && i + 1 === this.getMatchesFromFormat()) {
            matchStr = "Tiebreaker";
          } else {
            matchStr = this.getMatchesFromFormat() > 1 ? "Match " + (i + 1) : "";
          }
          items[start].name = `Quarterfinal ${j + 1} ${matchStr}`;
          start++;
        }
      }
    }
    if (this.allianceCaptains >= 4) {
      for (let i = 0; i < this.getMatchesFromFormat(); i++) { // Matches
        for (let j = 0; j < 2; j++) { // Series
          let matchStr = "";
          if (this.getMatchesFromFormat() > 1 && i + 1 === this.getMatchesFromFormat()) {
            matchStr = "Tiebreaker";
          } else {
            matchStr = this.getMatchesFromFormat() > 1 ? "Match " + (i + 1) : "";
          }
          items[start].name = `Semifinal ${j + 1} ${matchStr}`;
          start++;
        }
      }
    }
    for (let i = 0; i < this.getMatchesFromFormat(); i++) { // Matches
      const matchStr = this.getMatchesFromFormat() > 1 ? "Match " + (i + 1) : "";
      items[start].name = `Finals ${matchStr}`;
      start++;
    }
    return items;
  }

  private getMatchesFromFormat(): number {
    switch (this.eliminationsFormat) {
      case "bo1":
        return 1;
      case "bo3":
        return 3;
      case "bo5":
        return 5;
      default:
        return 3;
    }
  }

  get maxTotalMatches(): number {
    let total: number = 0;
    for (let i = (this.allianceCaptains / 2); i > 1; i/=2) {
      total += (i * this.getMatchesFromFormat());
    }
    return total + this.getMatchesFromFormat(); // Finals aren't accounted in the for loop.
  }

  get allianceCaptains(): number {
    return this._allianceCaptains;
  }

  set allianceCaptains(value: number) {
    this._allianceCaptains = value;
  }

  get eliminationsFormat(): EliminationsFormats {
    return this._elimsFormat;
  }

  set eliminationsFormat(value: EliminationsFormats) {
    this._elimsFormat = value;
  }
}