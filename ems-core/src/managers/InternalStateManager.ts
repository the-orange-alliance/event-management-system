import {AllianceMember, AppError, EMSProvider, Event, EventConfiguration, HttpError, Team, Match} from "@the-orange-alliance/lib-ems";
import moment from "moment";

import {ipcRenderer} from 'electron';
import {CONFIG_STORE} from "../AppStore";

export interface IInternalProgress {
  completedStep: number,
  currentStep: number,
  event?: Event,
  teams?: Team[],
  testMatches?: Match[],
  practiceMatches?: Match[],
  qualificationMatches?: Match[],
  playoffMatches?: Match[],
  allianceMembers?: AllianceMember[],
  loggedIn?: boolean
}

class InternalStateManager {
  private static _instance: InternalStateManager;

  public static getInstance(): InternalStateManager {
    if (typeof InternalStateManager._instance === "undefined") {
      InternalStateManager._instance = new InternalStateManager();
    }
    return InternalStateManager._instance;
  }

  private constructor() {}

  // TODO - Implement Web Server and Socket instance.
  // TODO - Implement Timeout and failure
  public async pollServicesForResponse(): Promise<boolean> {
    let apiReady: boolean = false;
    while (!apiReady) {
      await EMSProvider.ping().then(() => {
        apiReady = true;
        console.log("Received API response. Launching application.");
      }).catch(async (res: any) => {
        console.log("Did not receive API response. Trying again...");
        await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));
        apiReady = false;
      });
    }
    return apiReady;
  }

  public async refreshInternalProgress(eventConfig: EventConfiguration, apiKey?: string): Promise<IInternalProgress> {
    let completedStep: number = 0;

    let loginSuccess = undefined;
    if(apiKey) {
      await EMSProvider.authOldKey(apiKey).then((newKey: string) => {
        CONFIG_STORE.set('apiKey', newKey);
        loginSuccess = true;
      }).catch(() => loginSuccess = false);
    }

    let events: Event[] = [];
    await EMSProvider.getEvent().then((res: Event[]) => {
      events = res;
    }).catch((error: HttpError) => {
      if(error.httpCode === 401) loginSuccess = false;
      console.log(error)
    });
    if (events.length === 0) {
      return {completedStep, currentStep: completedStep};
    } else {
      completedStep++;
    }

    const eventKey: string = events[0].eventKey;
    let tMatches: Match[] = [];
    await EMSProvider.getMatchesAndParticipants(eventKey + "-T").then((res: Match[]) => {
      tMatches = res;
    }).catch((error: HttpError) => console.log(error));

    let teams: Team[] = [];
    await EMSProvider.getTeams().then((res: Team[]) => {
      teams = res;
    }).catch((error: HttpError) => console.log(error));

    if (teams.length === 0) {
      return {completedStep, currentStep: completedStep, event: events[0], testMatches: tMatches, loggedIn: loginSuccess};
    } else {
      completedStep++;
    }

    // Test matches don't 100% matter, so just throw them in here...

    let pMatches: Match[] = [];
    await EMSProvider.getMatchesAndParticipants(eventKey + "-P").then((res: Match[]) => {
      pMatches = res;
    }).catch((error: HttpError) => console.log(error));

    if (pMatches.length === 0) {
      return {completedStep, currentStep: completedStep, event: events[0], teams, testMatches: tMatches, loggedIn: loginSuccess};
    } else {
      completedStep++;
    }

    let qMatches: Match[] = [];
    await EMSProvider.getMatchesAndParticipants(eventKey + "-Q").then((res: Match[]) => {
      qMatches = res;
    }).catch((error: HttpError) => console.log(error));

    if (qMatches.length === 0) {
      return {completedStep, currentStep: completedStep, event: events[0], teams, testMatches: tMatches, practiceMatches: pMatches, loggedIn: loginSuccess};
    } else {
      completedStep++;
    }

    let alliances: AllianceMember[] = [];
    await EMSProvider.getAlliances().then((res: AllianceMember[]) => {
      alliances = res;
    }).catch((error: HttpError) => console.log(error));

    if (alliances.length === 0 && eventConfig.tournamentConfig === "ranking") {
      completedStep+=2;
    }

    let eMatches: Match[] = [];
    await EMSProvider.getMatchesAndParticipants(eventKey + "-E").then((res: Match[]) => {
      eMatches = res;
    }).catch((error: HttpError) => console.log(error));

    if (eMatches.length === 0) {
      return {completedStep, currentStep: completedStep, event: events[0], teams, testMatches: tMatches, practiceMatches: pMatches, qualificationMatches: qMatches, allianceMembers: alliances, loggedIn: loginSuccess};
    } else {
      completedStep++;
    }

    return {completedStep, currentStep: completedStep, event: events[0], teams, testMatches: tMatches, practiceMatches: pMatches, qualificationMatches: qMatches, allianceMembers: alliances, playoffMatches: eMatches, loggedIn: loginSuccess};
  }

  public createBackup(location: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      ipcRenderer.once("create-backup-success", () => {
        resolve(null);
      });
      ipcRenderer.once("create-backup-error", (event: any, error: any) => {
        reject(new AppError(1202, "BACKUP_ERROR", error));
      });
      const name: string = moment().format("M-DD-YYYY-HH.mm");
      ipcRenderer.send("create-backup", location, name);
    });
  }

}

export default InternalStateManager.getInstance();
