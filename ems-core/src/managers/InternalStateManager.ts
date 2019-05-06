import {EventConfiguration, HttpError} from "@the-orange-alliance/lib-ems";
import Event from "@the-orange-alliance/lib-ems/dist/models/ems/Event";
import EMSProvider from "@the-orange-alliance/lib-ems/dist/providers/EMSProvider";
import Team from "@the-orange-alliance/lib-ems/dist/models/ems/Team";
import Match from "@the-orange-alliance/lib-ems/dist/models/ems/Match";
import AllianceMember from "@the-orange-alliance/lib-ems/dist/models/ems/AllianceMember";

export interface IInternalProgress {
  completedStep: number,
  currentStep: number
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
  public async pollServicesForResponse(): Promise<boolean> {
    let apiReady: boolean = false;
    while (!apiReady) {
      await EMSProvider.ping().then(() => {
        apiReady = true;
      }).catch((res: any) => {
        console.log("Did not receive API response. Trying again...");
        apiReady = false;
      });
    }
    return apiReady;
  }

  public async refreshInternalProgress(eventConfig: EventConfiguration): Promise<IInternalProgress> {
    let completedStep: number = 0;

    const events: Event[] = [];
    await EMSProvider.getEvent().then((res: Event[]) => {
      events.concat(res);
    }).catch((error: HttpError) => console.log(error));

    if (events.length === 0) {
      return {completedStep, currentStep: completedStep};
    } else {
      completedStep++;
    }

    const teams: Team[] = [];
    await EMSProvider.getTeams().then((res: Team[]) => {
      teams.concat(res);
    }).catch((error: HttpError) => console.log(error));

    if (teams.length === 0) {
      return {completedStep, currentStep: completedStep};
    } else {
      completedStep++;
    }

    const eventKey: string = events[0].eventKey;
    const pMatches: Match[] = [];
    await EMSProvider.getMatchesAndParticipants(eventKey + "-P").then((res: Match[]) => {
      pMatches.concat(res);
    }).catch((error: HttpError) => console.log(error));

    if (pMatches.length === 0) {
      return {completedStep, currentStep: completedStep};
    } else {
      completedStep++;
    }

    const qMatches: Match[] = [];
    await EMSProvider.getMatchesAndParticipants(eventKey + "-Q").then((res: Match[]) => {
      qMatches.concat(res);
    }).catch((error: HttpError) => console.log(error));

    if (qMatches.length === 0) {
      return {completedStep, currentStep: completedStep};
    } else {
      completedStep++;
    }

    const alliances: AllianceMember[] = [];
    await EMSProvider.getAlliances().then((res: AllianceMember[]) => {
      alliances.concat(res);
    }).catch((error: HttpError) => console.log(error));

    if (alliances.length === 0 && eventConfig.playoffsConfig === "finals") {
      completedStep+=2;
    }

    const eMatches: Match[] = [];
    await EMSProvider.getMatchesAndParticipants(eventKey + "-E").then((res: Match[]) => {
      eMatches.concat(res);
    }).catch((error: HttpError) => console.log(error));

    if (eMatches.length === 0) {
      return {completedStep, currentStep: completedStep};
    } else {
      completedStep++;
    }

    return {completedStep, currentStep: completedStep};
  }

}

export default InternalStateManager.getInstance();