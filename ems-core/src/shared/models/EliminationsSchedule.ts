import Schedule from "./Schedule";
import ScheduleItem from "./ScheduleItem";
import Event from "./Event";
import Day from "./Day";

export default class EliminationsSchedule extends Schedule {
  private _allianceCaptains: number;

  // Inheritance is cool!
  constructor() {
    super("Eliminations");
    this._allianceCaptains = 4;
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
    if (this.allianceCaptains === 8) {
      for (let i = 0; i < 12; i++) {
        const series = i % 4 === 0 ? 1 : (i % 4) + 1;
        const match = Math.floor(i / 4) + 1;
        const matchStr = match === 3 ? "Tiebreaker" : `Match ${match}`;
        items[i].name = `Quarterfinal ${series} ${matchStr}`;
      }
      start = 12;
    }
    for (let i = 0; i < 9; i++) {
      const series = i % 2 === 1 ? 2 : (i % 2) + 1;
      const match = Math.floor(i / 2) + 1;
      const matchStr = match === 3 ? "Tiebreaker" : `Match ${match}`;
      items[i + start].name = `Semifinal ${series} ${matchStr}`;
    }
    start += 6;
    items[start].name = "Finals Match 1";
    items[start + 1].name = "Finals Match 2";
    items[start + 2].name = "Finals Match 3";
    return items;
  }

  get maxTotalMatches(): number {
    // We assume Bo3 format for now...
    return this.allianceCaptains === 8 ? 21 : 9;
  }

  get allianceCaptains(): number {
    return this._allianceCaptains;
  }

  set allianceCaptains(value: number) {
    this._allianceCaptains = value;
  }
}