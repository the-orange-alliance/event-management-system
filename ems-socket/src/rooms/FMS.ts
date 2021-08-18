import {Socket, Server} from "socket.io";
import {IRoom} from "./IRoom";
import logger from "../logger";
import {User} from "@the-orange-alliance/lib-ems";


export default class FmsRoom implements IRoom {
  private readonly _server: Server;
  private readonly _clients: Socket[];
  private readonly _name: string;

  private allDriverStations: object[];

  constructor(server: Server) {
    this._server = server;
    this._clients = [];
    this._name = "fms";
    this.allDriverStations = [];
  }

  public addClient(client: Socket, user: User | null) {
    this._clients.push(client);
    this.initializeEvents(client, user);
    logger.info(`Client ${client.id} joined '${this._name}'.`);
  }

  public removeClient(client: Socket) {
    if (this._clients.indexOf(client) > -1) {
      this._clients.splice(this._clients.indexOf(client), 1);
      logger.info(`Client ${client.id} left ${this._name}'.`);
    }
  }

  public getClients(): Socket[] {
    return this._clients;
  }

  private initializeEvents(client: Socket, user: User | null) {
    client.on("ds-request-all", () => {
      client.emit("ds-all", JSON.stringify(this.allDriverStations));
    });
    client.on("fms-ping", () => {
      this._server.to(this._name).emit("fms-ping");
    });
    client.on("fms-pong", () => {
      this._server.to(this._name).emit("fms-pong");
    });
    client.on("plc-update", (plcData: string) => {
      if(!user || (user && !user.canControlFms)) return client.emit('Unauthorized', {event: 'plc-update', required_priv: 'can_control_fms'});
      this._server.to(this._name).emit("plc-update", plcData);
    });
    client.on("fms-settings-update", (data: string) => {
      if(!user || (user && !user.canControlFms)) return client.emit('Unauthorized', {event: 'fms-settings-update', required_priv: 'can_control_fms'});
      this._server.to(this._name).emit("fms-settings-update", data);
    });
    client.on("fms-settings-update-success", (data: string) => {
      if(!user || (user && !user.canControlFms)) return client.emit('Unauthorized', {event: 'fms-settings-update-success', required_priv: 'can_control_fms'});
      this._server.to(this._name).emit("fms-settings-update-success", data);
    });
    client.on("ds-update-all", (dsData: any[]) => {
      if(!user || (user && !user.canControlFms)) return client.emit('Unauthorized', {event: 'ds-update-all', required_priv: 'can_control_fms'});
      this.allDriverStations = dsData;
      this._server.to(this._name).emit("ds-update", this.allDriverStations);
    });
    client.on("fms-ds-ready", (data: string) => {
      if(!user || (user && !user.canControlFms)) return client.emit('Unauthorized', {event: 'fms-ds-ready', required_priv: 'can_control_fms'});
      this._server.to(this._name).emit("fms-ds-ready", data);
    });
    client.on("fms-ap-ready", (data: string) => {
      if(!user || (user && !user.canControlFms)) return client.emit('Unauthorized', {event: 'fms-ap-ready', required_priv: 'can_control_fms'});
      this._server.to(this._name).emit("fms-ap-ready", data);
    });
    client.on("fms-switch-ready", (data: string) => {
      if(!user || (user && !user.canControlFms)) return client.emit('Unauthorized', {event: 'fms-switch-ready', required_priv: 'can_control_fms'});
      this._server.to(this._name).emit("fms-switch-ready", data);
    });
  }

  get name(): string {
    return this._name;
  }
}
