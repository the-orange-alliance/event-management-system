import * as socket from "socket.io-client";

class SocketProvider {
  private static _instance: SocketProvider;
  private _client: SocketIOClient.Socket;

  public static getInstance(): SocketProvider {
    if (typeof SocketProvider._instance === "undefined") {
      SocketProvider._instance = new SocketProvider();
    }
    return SocketProvider._instance;
  }

  private constructor() {}

  public initialize(host: string) {
    if (typeof this._client !== "undefined") {
      this._client.close();
    }
    this._client = socket(`http://${host}:${process.env.REACT_APP_EMS_SCK_PORT}/`);
    this._client.open();
  }

  public emit(event: string, ...args: any[]): void {
    if (typeof this._client !== "undefined") {
      this._client.emit(event, args);
    }
  }

  public send(event: string, arg: any): void {
    if (typeof this._client !== "undefined") {
      this._client.emit(event, arg);
    }
  }

  public sendTwo(event: string, arg: any, arg2: any): void {
    if (typeof this._client !== "undefined") {
      this._client.emit(event, arg, arg2);
    }
  }

  public on(event: string, listener: (...args: any[]) => any) {
    if (typeof this._client !== "undefined") {
      this._client.on(event, listener);
    }
  }

  public once(event: string, listener: (...args: any[]) => any) {
    if (typeof this._client !== "undefined") {
      this._client.once(event, listener);
    }
  }

  public off(event: string) {
    if (typeof this._client !== "undefined") {
      this._client.off("match-start");
    }
  }

  get client(): SocketIOClient.Socket {
    return this._client;
  }
}

export default SocketProvider.getInstance();