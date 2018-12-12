import {default as Axios, AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse} from "axios";
import HttpError from "../models/HttpError";
import TOAConfig from "../models/TOAConfig";
import TOAEventParticipant from "../models/toa/TOAEventParticipant";

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

  public postEventParticipants(eventKey: string, participants: TOAEventParticipant): Promise<AxiosResponse> {
    return this.post("api/event/" + eventKey + "/teams", participants);
  }

}

export default TOAProvider.getInstance();