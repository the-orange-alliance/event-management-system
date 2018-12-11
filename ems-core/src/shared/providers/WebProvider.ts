import {default as Axios, AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse} from "axios";
import HttpError from "../models/HttpError";

const PORT = process.env.REACT_APP_EMS_API_PORT;

class WebProvider {
  private static _instance: WebProvider;

  private _axios: AxiosInstance;
  private _config: AxiosRequestConfig;
  private _host: string;

  public static getInstance(): WebProvider {
    if (typeof WebProvider._instance === "undefined") {
      WebProvider._instance = new WebProvider();
    }
    return WebProvider._instance;
  }

  private constructor() {
  }

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

  public ping(): Promise<AxiosResponse> {
    return this.get("ping");
  }
}

export default WebProvider.getInstance();