import {
  Event,
  FGCProvider,
  Match, TBAConfig,
  TBAProvider,
  Team,
  TOAConfig,
  TOAProvider, UploadConfig
} from "@the-orange-alliance/lib-ems";
import TOAUploadManager from "./TOAUploadManager";
import FGCUploadManager from "./FGCUploadManager";
import TBAUploadManager from "./TBAUploadManager";
import {Providers} from "@the-orange-alliance/lib-ems/dist/models/ems/EventConfiguration";

class UploadManager {
  
  private isFGC() {
    return this._type === Providers.FGA || this._type === Providers.FCA || this._type === Providers.CUSTOM;
  }

  private static _instance: UploadManager;

  private _type: number;

  public static getInstance(): UploadManager {
    if (typeof UploadManager._instance === "undefined") {
      UploadManager._instance = new UploadManager();
    }
    return UploadManager._instance;
  }

  private constructor() {}

  public initialize(type: number, config: UploadConfig): void {
    this._type = type;
    if (this._type === Providers.TOA) {
      if(!config.toaConfig) config.toaConfig = new TOAConfig();
      TOAProvider.initialize(config.toaConfig);
    }
    if (this._type === Providers.FGA || this._type === Providers.FCA) {
      FGCProvider.initialize(this._type);
    }
    
    if (this._type === Providers.TBA) {
      if(!config.tbaConfig) config.tbaConfig = new TBAConfig();
      TBAProvider.initialize(config.tbaConfig.secret, config.tbaConfig.clientId);
    }
    if (this._type === Providers.CUSTOM) {
      const devConfig = {
        host: "http://localhost:8080/api/",
        axios_config: {
          baseURL: "http://localhost:8080/api/",
          headers: {'Content-Type': 'application/json'},
          timeout: 5000
        }
      }
      const customConfig = {
        host: config.customConfig.apiUrl,
        axios_config: {
          baseURL: config.customConfig.apiUrl,
          headers: {'Content-Type': 'application/json'},
          timeout: 5000
        }
      }
      // FGCProvider.initialize(Providers.CUSTOM, undefined, devConfig);
      FGCProvider.initialize(Providers.CUSTOM, undefined, customConfig);
    }
  }

  public getEvent(eventKey: string): Promise<Event> {
    if (this._type === Providers.TBA) {
      return TBAUploadManager.getEvent(eventKey);
    } else if (this._type === Providers.TOA) {
      return TOAUploadManager.getEvent(eventKey);
    } else if (this.isFGC()) {
      return FGCUploadManager.getEvent(eventKey);
    } else {
      return new Promise<Event>((resolve, reject) => reject());
    }
  }

  public getTeams(eventKey: string): Promise<Team[]> {
    if (this._type === Providers.TBA) {
      return TBAUploadManager.getTeams(eventKey);
    } else if (this._type === Providers.TOA) {
      return TOAUploadManager.getTeams(eventKey);
    } else if (this.isFGC()) {
      return FGCUploadManager.getTeams(eventKey);
    } else {
      return new Promise<Team[]>((resolve, reject) => reject());
    }
  }

  public postEventParticipants(eventKey: string, teams: Team[]): Promise<any> {
    if (this._type === Providers.TBA) {
      return TBAUploadManager.postEventParticipants(eventKey, teams);
    } else if (this._type === Providers.TOA) {
      return TOAUploadManager.postEventParticipants(eventKey, teams);
    } else if (this.isFGC()) {
      return FGCUploadManager.postEventParticipants(eventKey, teams);
    } else {
      return new Promise<any>((resolve, reject) => reject());
    }
  }

  public postMatchSchedule(eventKey: string, matches: Match[]): Promise<any> {
    if (this._type === Providers.TBA) {
      return TBAUploadManager.postMatchSchedule(eventKey, matches);
    } else if (this._type === Providers.TOA) {
      return TOAUploadManager.postMatchSchedule(eventKey, matches);
    } else if (this.isFGC()) {
      return FGCUploadManager.postMatchSchedule(eventKey, matches);
    } else {
      return new Promise<any>((resolve, reject) => reject());
    }
  }

  public postMatchResults(eventKey: string, match: Match): Promise<any> {
    if (this._type === Providers.TBA) {
      return TBAUploadManager.postMatchResults(eventKey, match);
    } else if (this._type === Providers.TOA) {
      return TOAUploadManager.postMatchResults(eventKey, match);
    } else if (this.isFGC()) {
      return FGCUploadManager.postMatchResults(eventKey, match);
    } else {
      return new Promise<any>((resolve, reject) => reject());
    }
  }

  public testConnection(): Promise<any> {
    if (this._type === Providers.TBA) {
      return TBAProvider.ping();
    } else if (this._type === Providers.TOA) {
      return TOAProvider.ping();
    } else if (this.isFGC()) {
      return FGCProvider.ping();
    } else {
      return new Promise<any>((resolve, reject) => reject());
    }
  }

  public get type(): number {
    return this._type;
  }

}

export default UploadManager.getInstance();
