import events = require("events");

export class ScoringTimer extends events.EventEmitter {
  private currTime: number;
  private timerObj: any;
  private stopped: boolean;

  constructor() {
    super();
    this.timerObj = null;
    this.currTime = -1;
    this.stopped = true;
  }

  public setTime(time: number) {
    this.currTime = time;
  }

  public setTimerObj(timerObj: any) {
    this.timerObj = timerObj;
  }

  public setStopped(stopped: boolean) {
    this.stopped = stopped;
  }

  public tick() {
    this.currTime++;
  }

  public start() {
    this.stop();
    this.stopped = false;
    this.currTime = -1;
    this.tick();
    this.timerObj = setInterval(() => {
      this.tick();
    }, 1000);
  }

  public stop() {
    this.stopped = true;
    this.currTime = -1;
    if (this.timerObj != null) {
      clearInterval(this.timerObj);
      this.timerObj = null;
    }
  }

  public getTime(): number {
    return this.currTime;
  }

  public isStopped(): boolean {
    return this.stopped;
  }

}