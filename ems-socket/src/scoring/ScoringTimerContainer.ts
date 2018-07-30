import events = require("events");
import {ScoringTimer} from "./ScoringTimer";

class ScoringTimerContainer extends events.EventEmitter {
  private static _instance: ScoringTimerContainer;

  private scoringTimers: ScoringTimer[][];

  public static getInstance(): ScoringTimerContainer {
    if (typeof ScoringTimerContainer._instance === "undefined") {
      ScoringTimerContainer._instance = new ScoringTimerContainer();
    }
    return ScoringTimerContainer._instance;
  }

  private constructor() {
    super();
    this.scoringTimers = [[new ScoringTimer(),
      new ScoringTimer(),
      new ScoringTimer(),
      new ScoringTimer(),
      new ScoringTimer(),
      new ScoringTimer(),
      new ScoringTimer()],

      [new ScoringTimer(),
        new ScoringTimer(),
        new ScoringTimer(),
        new ScoringTimer(),
        new ScoringTimer(),
        new ScoringTimer(),
        new ScoringTimer()]];
  }

  start(alliance_index: number, type: number) {
    this.scoringTimers[alliance_index][type].stop();
    this.scoringTimers[alliance_index][type].setStopped(false);
    this.scoringTimers[alliance_index][type].setTime(-1);
    this.scoringTimers[alliance_index][type].tick();
    this.scoringTimers[alliance_index][type].setTimerObj(setInterval(() => {
        this.scoringTimers[alliance_index][type].tick();
        //console.log("Alliance index: ", alliance_index, "Timer index: ", type); // TODO - Remove
        this.emit("updateMatchScoring", {alliance_index: alliance_index, scoreType: type});
      }, 1000)
    );
  }

  stop(alliance_index: number, type: number) {
    this.scoringTimers[alliance_index][type].stop();
  }

  isStopped(alliance_index: number, type: number) {
    return this.scoringTimers[alliance_index][type].isStopped();
  }

  getTime(alliance_index: number, type: number) {
    return Math.floor(this.scoringTimers[alliance_index][type].getTime());
  }

  stopAll() {
    for(let j = 0; j < 2; j++) {
      for(let i = 0; i < 7; i++) {
        this.scoringTimers[j][i].stop();
      }
    }
  }
}

export default ScoringTimerContainer.getInstance();