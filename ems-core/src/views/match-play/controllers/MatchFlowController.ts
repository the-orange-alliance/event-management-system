import {MatchState} from "../../../shared/models/MatchState";

const PRESTART_ID = 0;
const AUDIENCE_ID = 1;
const START_ID = 2;
const ABORT_ID = 3;
const COMMIT_ID = 4;

class MatchFlowController {
  private static _instance: MatchFlowController;

  public static getInstance(): MatchFlowController {
    if (typeof MatchFlowController._instance === "undefined") {
      MatchFlowController._instance = new MatchFlowController();
    }
    return MatchFlowController._instance;
  }

  private constructor() {}

  public prestart(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }

  public setAudiencedisplay(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 250);
    });
  }

  public startMatch(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      resolve();
    });
  }

  public abortMatch(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      resolve();
    });
  }

  public commitScores(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1250);
    });
  }

  public getDisabledStates(matchState: MatchState): boolean[] {
    const states: boolean[] = [false, false, false, false, false];
    switch (matchState) {
      case MatchState.PRESTART_READY:
        states[PRESTART_ID] = false;
        states[AUDIENCE_ID] = true;
        states[START_ID] = true;
        states[ABORT_ID] = true;
        states[COMMIT_ID] = true;
        break;
      case MatchState.PRESTART_IN_PROGRESS:
        states[PRESTART_ID] = true;
        states[AUDIENCE_ID] = true;
        states[START_ID] = true;
        states[ABORT_ID] = true;
        states[COMMIT_ID] = true;
        break;
      case MatchState.PRESTART_COMPLETE:
        states[PRESTART_ID] = false;
        states[AUDIENCE_ID] = false;
        states[START_ID] = true;
        states[ABORT_ID] = true;
        states[COMMIT_ID] = true;
        break;
      case MatchState.AUDIENCE_DISPLAY_SET:
        states[PRESTART_ID] = false;
        states[AUDIENCE_ID] = true;
        states[START_ID] = false;
        states[ABORT_ID] = true;
        states[COMMIT_ID] = true;
        break;
      case MatchState.MATCH_READY:
        states[PRESTART_ID] = false;
        states[AUDIENCE_ID] = true;
        states[START_ID] = false;
        states[ABORT_ID] = true;
        states[COMMIT_ID] = true;
        break;
      case MatchState.MATCH_NOT_READY:
        states[PRESTART_ID] = false;
        states[AUDIENCE_ID] = true;
        states[START_ID] = true;
        states[ABORT_ID] = true;
        states[COMMIT_ID] = true;
        break;
      case MatchState.MATCH_IN_PROGRESS:
        states[PRESTART_ID] = true;
        states[AUDIENCE_ID] = true;
        states[START_ID] = true;
        states[ABORT_ID] = false;
        states[COMMIT_ID] = true;
        break;
      case MatchState.MATCH_COMPLETE:
        states[PRESTART_ID] = true;
        states[AUDIENCE_ID] = true;
        states[START_ID] = true;
        states[ABORT_ID] = true;
        states[COMMIT_ID] = false;
        break;
      case MatchState.MATCH_ABORTED:
        states[PRESTART_ID] = false;
        states[AUDIENCE_ID] = true;
        states[START_ID] = true;
        states[ABORT_ID] = true;
        states[COMMIT_ID] = true;
        break;
      default:
        states[PRESTART_ID] = false;
        states[AUDIENCE_ID] = true;
        states[START_ID] = true;
        states[ABORT_ID] = true;
        states[COMMIT_ID] = true;
    }
    return states;
  }
}

export default MatchFlowController.getInstance();