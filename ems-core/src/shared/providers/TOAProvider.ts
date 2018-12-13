import {default as Axios, AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse} from "axios";
import HttpError from "../models/HttpError";
import TOAConfig from "../models/TOAConfig";
import TOAEventParticipant from "../models/toa/TOAEventParticipant";
import TOAMatch from "../models/toa/TOAMatch";
import TOAMatchDetails from "../models/toa/TOAMatchDetails";
import TOAMatchParticipant from "../models/toa/TOAMatchParticipant";
import TOARanking from "../models/toa/TOARanking";

class TOAProvider {
  private static _instance: TOAProvider;

  private _axios: AxiosInstance;
  private _config: AxiosRequestConfig;
  private _toaConfig: TOAConfig;
  private _host: string;

  public static getInstance(): TOAProvider {
    if (typeof TOAProvider._instance === "undefined") {
      TOAProvider._instance = new TOAProvider();
    }
    return TOAProvider._instance;
  }

  private constructor() {}

  /**
   * This method must be called before retrieving data. Since this class implements the singleton design
   * and the network of EMS may change, the provider must be manually initialized at runtime.
   */
  public initialize(toaConfig: TOAConfig): void {
    this._host = "https://theorangealliance.org/";
    this._toaConfig = toaConfig;
    this._config = {
      baseURL: this._host,
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
        "X-Application-Origin": "EMS-" + this._toaConfig.eventKey,
        "X-TOA-Key": this._toaConfig.apiKey
      }
    };
    this._axios = Axios.create(this._config);
  }

  private get(url: string): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      this._axios.get(url, {data: {}}).then((response: AxiosResponse) => {
        resolve(response);
      }).catch((error: AxiosError) => {
        if (error.response) {
          reject(new HttpError(error.response.data.message, error.response.data.code, this._host + url));
        } else if (error.request) {
          reject(new HttpError(404, "ERR_CONNECTION_REFUSED", this._host + url));
        } else {
          reject(new HttpError(404, error.message, this._host + url));
        }
      });
    });
  }

  private delete(url: string): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      if (typeof this._axios === "undefined" || typeof this._host === "undefined") {
        reject(new HttpError(500, "ERR_PROVIDER_UNDEFINED", "The provider's host address has not been initialized."));
      }
      this._axios.delete(url, {data: {}}).then((response: AxiosResponse) => {
        resolve(response);
      }).catch((error: AxiosError) => {
        if (error.response) {
          reject(new HttpError(error.response.data._code, error.response.data._message, this._host + url));
        } else if (error.request) {
          reject(new HttpError(404, "ERR_CONNECTION_REFUSED", this._host + url));
        } else {
          reject(new HttpError(404, error.message, this._host + url));
        }
      });
    });
  }

  public post(url: string, body: IPostableObject | IPostableObject[]): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      const records: object[] = [];
      if (body instanceof Array) {
        for (const record of body) {
          records.push(record.toJSON());
        }
      } else {
        records.push(body.toJSON());
      }
      this._axios.post(url, records).then((response: AxiosResponse) => {
        resolve(response);
      }).catch((error) => {
        if (error.response) {
          reject(new HttpError(error.response.data._code, error.response.data._message, this._host + url));
        } else if (error.request) {
          reject(new HttpError(404, "ERR_CONNECTION_REFUSED", this._host + url));
        } else {
          reject(new HttpError(404, error.message, this._host + url));
        }
      });
    });
  }

  public put(url: string, body: IPostableObject | IPostableObject[]): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      const records: object[] = [];
      if (body instanceof Array) {
        for (const record of body) {
          records.push(record.toJSON());
        }
      } else {
        records.push(body.toJSON());
      }
      this._axios.put(url, records).then((response: AxiosResponse) => {
        resolve(response);
      }).catch((error) => {
        if (error.response) {
          reject(new HttpError(error.response.data._code, error.response.data._message, this._host + url));
        } else if (error.request) {
          reject(new HttpError(404, "ERR_CONNECTION_REFUSED", this._host + url));
        } else {
          reject(new HttpError(404, error.message, this._host + url));
        }
      });
    });
  }

  public ping(): Promise<AxiosResponse> {
    return this.get("ping");
  }

  public getEvent(eventKey: string): Promise<AxiosResponse> {
    return this.get("api/event/" + eventKey);
  }

  public getTeams(eventKey: string): Promise<AxiosResponse> {
    return this.get("api/event/" + eventKey + "/teams");
  }

  public deleteTeams(eventKey: string): Promise<AxiosResponse> {
    return this.delete("api/event/" + eventKey + "/teams");
  }

  public deleteMatchData(eventKey: string, tournamentLevel: string): Promise<AxiosResponse> {
    return this.delete("api/event/" + eventKey + "/matches/all?level=" + tournamentLevel);
  }

  public deleteRankings(eventKey: string): Promise<AxiosResponse> {
    return this.delete("api/event/" + eventKey + "/rankings");
  }

  public postEventParticipants(eventKey: string, participants: TOAEventParticipant[]): Promise<AxiosResponse> {
    return this.post("api/event/" + eventKey + "/teams", participants);
  }

  public postMatches(eventKey: string, matches: TOAMatch[]): Promise<AxiosResponse> {
    return this.post("api/event/" + eventKey + "/matches", matches);
  }

  public postMatchDetails(eventKey: string, matches: TOAMatchDetails[]): Promise<AxiosResponse> {
    return this.post("api/event/" + eventKey + "/matches/details", matches);
  }

  public postMatchParticipants(eventKey: string, participants: TOAMatchParticipant[]): Promise<AxiosResponse> {
    return this.post("api/event/" + eventKey + "/matches/participants", participants);
  }

  public postRankings(eventKey: string, rankings: TOARanking[]): Promise<AxiosResponse> {
    return this.post("api/event/" + eventKey + "/rankings", rankings);
  }

  public putMatchResults(eventKey: string, match: TOAMatch): Promise<AxiosResponse> {
    return this.put("api/event/" + eventKey + "/matches/" + match.matchKey, match);
  }

  public putMatchDetails(eventKey: string, matchDetails: TOAMatchDetails): Promise<AxiosResponse> {
    return this.put("api/event/" + eventKey + "/matches/" + matchDetails.matchKey + "/details", matchDetails)
  }

  public putMatchParticipants(eventKey: string, participants: TOAMatchParticipant[]): Promise<AxiosResponse> {
    return this.put("api/event/" + eventKey + "/matches/" + participants[0].matchKey + "/participants", participants);
  }

}

export default TOAProvider.getInstance();