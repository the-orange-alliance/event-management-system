import {default as Axios, AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse} from "axios";

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
        reject("ERR_PROVIDER_UNDEFINED");
      }
      this._axios.get(url, {data: {}}).then((response: AxiosResponse) => {
        resolve(response);
      }).catch((error: AxiosError) => {
        if (error.response) {
          reject(error.response.data);
        } else if (error.request) {
          reject("ERR_CONNECTION_REFUSED");
        } else {
          reject(error.message);
        }
      });
    });
  }

  public getEvent(): Promise<AxiosResponse> {
    return this.get("api/event");
  }

  public getAllTeams(): Promise<AxiosResponse> {
    return this.get("api/team");
  }

  public getMatch(matchKey: string): Promise<AxiosResponse> {
    return this.get("api/match/" + matchKey);
  }

  public getMatchParticipants(matchKey: string): Promise<AxiosResponse> {
    return this.get("api/match/" + matchKey + "/participants");
  }

  public getMatchTeams(matchKey: string): Promise<AxiosResponse> {
    return this.get("api/match/" + matchKey + "/teams");
  }

  public getMatchTeamRanks(matchKey: string): Promise<AxiosResponse> {
    return this.get("api/match/" + matchKey + "/teamranks");
  }

  public getMatchDetails(matchKey: string): Promise<AxiosResponse> {
    return this.get("api/match/" + matchKey + "/details");
  }

  public getRankingTeams(): Promise<AxiosResponse> {
    return this.get("api/ranking/teams");
  }

  public getAlliances(): Promise<AxiosResponse> {
    return this.get("api/alliance");
  }

  public getMatches(tournamentLevel: number | string): Promise<AxiosResponse> {
    return this.get("api/match?level=" + tournamentLevel);
  }
}

export default EMSProvider.getInstance();