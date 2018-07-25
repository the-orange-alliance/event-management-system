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
    this._client.emit(event, args);
  }

  public on(event: string, listener: (...args: any[]) => any) {
    this._client.on(event, listener);
  }

  get client(): SocketIOClient.Socket {
    return this._client;
  }
}

export default SocketProvider.getInstance();