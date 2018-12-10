import {default as Axios, AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse} from "axios";
import HttpError from "../models/HttpError";
import Event from "../models/Event";
import {EMSEventTypes, TournamentLevels} from "../AppTypes";
import Team from "../models/Team";
import ScheduleItem from "../models/ScheduleItem";
import Match from "../models/Match";
import MatchParticipant from "../models/MatchParticipant";
import Ranking from "../models/Ranking";
import MatchDetails from "../models/MatchDetails";
import AllianceMember from "../models/AllianceMember";

const PORT = process.env.REACT_APP_EMS_API_PORT;

class EMSProvider {
  private static _instance: EMSProvider;

  private _axios: AxiosInstance;
  private _config: AxiosRequestConfig;
  private _host: string;

  public static getInstance(): EMSProvider {
    if (typeof EMSProvider._instance === "undefined") {
      EMSProvider._instance = new EMSProvider();
    }
    return EMSProvider._instance;
  }

  private constructor() {}

  /**
   * This method must be called before retrieving data. Since this class implements the singleton design
   * and the network of EMS may change, the provider must be manually initialized at runtime.
   */
  public initialize(host: string): void {
    this._host = "http://" + host + ":" + PORT + "/";
    this._config = {
      baseURL: this._host,
      timeout: 5000,
      headers: {
        "Content-Type": "application/json"
      }
    };
    this._axios = Axios.create(this._config);
  }

  private get(url: string): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      if (typeof this._axios === "undefined" || typeof this._host === "undefined") {
        reject(new HttpError(500, "ERR_PROVIDER_UNDEFINED", "The provider's host address has not been initialized."));
      }
      this._axios.get(url, {data: {}}).then((response: AxiosResponse) => {
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
      this._axios.post(url, {records: records}).then((response: AxiosResponse) => {
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
      this._axios.put(url, {records: records}).then((response: AxiosResponse) => {
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

  public createEvent(eventType: EMSEventTypes): Promise<AxiosResponse> {
    return this.get("api/event/create?type=" + eventType);
  }

  public deleteEvent(): Promise<AxiosResponse> {
    return this.delete("api/event/delete");
  }

  public getEvent(): Promise<AxiosResponse> {
    return this.get("api/event");
  }

  public getTeams(): Promise<AxiosResponse> {
    return this.get("api/team");
  }

  public getScheduleItems(type: TournamentLevels): Promise<AxiosResponse> {
    return this.get("api/schedule/" + type);
  }

  public getMatches(tournamentLevel: number | string): Promise<AxiosResponse> {
    return this.get("api/match?level=" + tournamentLevel);
  }

  public getRankings(): Promise<AxiosResponse> {
    return this.get("api/ranking");
  }

  public getRankingTeams(): Promise<AxiosResponse> {
    return this.get("api/ranking/teams");
  }

  public getMatch(matchKey: string): Promise<AxiosResponse> {
    return this.get("api/match/" + matchKey);
  }

  public getMatchResults(tournamentLevel: number): Promise<AxiosResponse> {
    return this.get("api/match?tournament_level=" + tournamentLevel);
  }

  public getMatchDetails(matchKey: string): Promise<AxiosResponse> {
    return this.get("api/match/" + matchKey + "/details");
  }

  public getAlliances(): Promise<AxiosResponse> {
    return this.get("api/alliance");
  }

  public getMatchParticipantTeams(matchKey: string): Promise<AxiosResponse> {
    return this.get("api/match/" + matchKey + "/teams");
  }

  public calculateRankings(tournamentLevel: number, eventType: EMSEventTypes): Promise<AxiosResponse> {
    return this.get("api/ranking/calculate/" + tournamentLevel + "?type=" + eventType)
  }

  public deleteScheduleItems(type: TournamentLevels): Promise<AxiosResponse> {
    return this.delete("api/schedule/" + type);
  }

  public deleteRankings(): Promise<AxiosResponse> {
    return this.delete("api/ranking");
  }

  public postEvent(event: Event): Promise<AxiosResponse> {
    return this.post("api/event", event);
  }

  public postTeams(teams: Team[]): Promise<AxiosResponse> {
    return this.post("api/team", teams);
  }

  public postScheduleItems(scheduleItems: ScheduleItem[]): Promise<AxiosResponse> {
    return this.post("api/schedule", scheduleItems);
  }

  public postMatchSchedule(matches: Match[]): Promise<AxiosResponse> {
    return this.post("api/match", matches);
  }

  public postMatchScheduleParticipants(participants: MatchParticipant[]): Promise<AxiosResponse> {
    return this.post("api/match/participants", participants);
  }

  public postRankings(rankings: Ranking[]): Promise<AxiosResponse> {
    return this.post("api/ranking", rankings);
  }

  public postAllianceMembers(members: AllianceMember[]): Promise<AxiosResponse> {
    return this.post("api/alliance", members);
  }

  public putActiveMatch(match: Match): Promise<AxiosResponse> {
    return this.put("api/match/" + match.matchKey, match);
  }

  public putMatchResult(match: Match): Promise<AxiosResponse> {
    return this.put("api/match/" + match.matchKey + "/results", match);
  }

  public putMatchDetails(details: MatchDetails): Promise<AxiosResponse> {
    return this.put("api/match/" + details.matchKey + "/details", details);
  }

  public putMatchParticipants(participants: MatchParticipant[]): Promise<AxiosResponse> {
    return this.put("api/match/" + participants[0].matchKey + "/participants", participants);
  }

  public resetCardStatuses(): Promise<AxiosResponse> {
    return this.get("api/team/cards/reset");
  }

}

export default EMSProvider.getInstance();