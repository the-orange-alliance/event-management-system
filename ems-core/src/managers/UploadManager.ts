import {Event, FGCProvider, Match, Team, TOAConfig, TOAProvider} from "@the-orange-alliance/lib-ems";
import TOAUploadManager from "./TOAUploadManager";
import FGCUploadManager from "./FGCUploadManager";

class UploadManager {
  public static TOA: number = 0;
  public static FGC: number = 1;

  private static _instance: UploadManager;

  private _type: number;

  public static getInstance(): UploadManager {
    if (typeof UploadManager._instance === "undefined") {
      UploadManager._instance = new UploadManager();
    }
    return UploadManager._instance;
  }

  private constructor() {}

  public initialize(type: number, toaConfig: TOAConfig): void {
    this._type = type;
    if (this._type === UploadManager.TOA) {
      TOAProvider.initialize(toaConfig);
    }
    if (this._type === UploadManager.FGC) {
      FGCProvider.initialize("theorangealliance.org", 9090);// , "https"); // DEBUG
    }
  }

  public getEvent(eventKey: string): Promise<Event> {
    if (this._type === UploadManager.TOA) {
      return TOAUploadManager.getEvent(eventKey);
    } else if (this._type === UploadManager.FGC) {
      return FGCUploadManager.getEvent(eventKey);
    } else {
      return new Promise<Event>((resolve, reject) => reject());
    }
  }

  public getTeams(eventKey: string): Promise<Team[]> {
    if (this._type === UploadManager.TOA) {
      return TOAUploadManager.getTeams(eventKey);
    } else if (this._type === UploadManager.FGC) {
      return FGCUploadManager.getTeams(eventKey);
    } else {
      return new Promise<Team[]>((resolve, reject) => reject());
    }
  }

  public postEventParticipants(eventKey: string, teams: Team[]): Promise<any> {
    if (this._type === UploadManager.TOA) {
      return TOAUploadManager.postEventParticipants(eventKey, teams);
    } else if (this._type === UploadManager.FGC) {
      return FGCUploadManager.postEventParticipants(eventKey, teams);
    } else {
      return new Promise<any>((resolve, reject) => reject());
    }
  }

  public postMatchSchedule(eventKey: string, matches: Match[]): Promise<any> {
    if (this._type === UploadManager.TOA) {
      return TOAUploadManager.postMatchSchedule(eventKey, matches);
    } else if (this._type === UploadManager.FGC) {
      return FGCUploadManager.postMatchSchedule(eventKey, matches);
    } else {
      return new Promise<any>((resolve, reject) => reject());
    }
  }

  public postMatchResults(eventKey: string, match: Match): Promise<any> {
    if (this._type === UploadManager.TOA) {
      return TOAUploadManager.postMatchResults(eventKey, match);
    } else if (this._type === UploadManager.FGC) {
      return FGCUploadManager.postMatchResults(eventKey, match);
    } else {
      return new Promise<any>((resolve, reject) => reject());
    }
  }

  public testConnection(): Promise<any> {
    if (this._type === UploadManager.TOA) {
      return TOAProvider.ping();
    } else if (this._type === UploadManager.FGC) {
      return FGCProvider.ping();
    } else {
      return new Promise<any>((resolve, reject) => reject());
    }
  }

  public get type(): number {
    return this._type;
  }

}

export const TOA = UploadManager.TOA;
export const FGC = UploadManager.FGC;

export default UploadManager.getInstance();
