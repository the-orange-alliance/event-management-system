import {AppError} from "@the-orange-alliance/lib-ems";

const ipcRenderer = (window as any).require("electron").ipcRenderer;

/**
 * @author Kyle Flynn
 * AppStore is meant to be used as an asynchronous configuration store.
 * This is how data will be persisted in EMS on preload. AppStore itself
 * is not a configuration file, but a child of the application's redux state.
 * Essentially, this is creating a file transport for the react-redux state, however
 * you are not reading this app store, and instead overwriting it's contents with the
 * newest redux state.
 */
class AppStore {
  private readonly _name: string;

  constructor(name: string) {
    this._name = name;
  }

  public set(key: string, data: object | string): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      ipcRenderer.once("store-set-response", (event: any, error: any, storeState: object) => {
        if (error) {
          reject(new AppError(1100, "STORE_SET", error));
        } else {
          resolve(storeState);
        }
      });
      ipcRenderer.send("store-set", {key: key, data: data, file: this.name});
    });
  }

  public setAll(data: object): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      ipcRenderer.once("store-set-all-response", (event: any, error: any, storeState: object) => {
        if (error) {
          reject(new AppError(1101, "STORE_SET_ALL", error));
        } else {
          resolve(storeState);
        }
      });
      ipcRenderer.send("store-set-all", {data: data, file: this.name});
    });
  }

  public getAll(): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      ipcRenderer.once("store-get-all-response", (event: any, error: any, storeState: object) => {
        if (error) {
          reject(new AppError(1102, "STORE_GET_ALL", error));
        } else {
          resolve(storeState);
        }
      });
      ipcRenderer.send("store-get-all", this.name);
    });
  }

  get name() {
    return this._name + ".json";
  }
}

export const CONFIG_STORE = new AppStore("config");