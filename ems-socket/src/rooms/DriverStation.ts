import * as fs from "fs";
import *as path from "path";
import {getAppDataPath} from "appdata-path";
import {Socket, Server} from "socket.io";
import {IRoom} from "./IRoom";
import logger from "../logger";
import {EMSProvider} from "@the-orange-alliance/lib-ems";
import * as net from "net";
import * as dgram from "dgram";

export default class DriverStationRoom implements IRoom {
  private readonly _server: Server;
  private readonly _clients: Socket[];
  private readonly _name: string;
  
  private allDriverStations: object[];

  constructor(server: Server) {
    this._server = server;
    this._clients = [];
    this._name = "driverstation";
    this.allDriverStations = [];
  }

  public addClient(client: Socket) {
    this._clients.push(client);
    this.initializeEvents(client);
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

  private initializeEvents(client: Socket) {
    client.on("request-all", () => {
      this._server.to(this._name).emit("ds-all", JSON.stringify(this.allDriverStations));
    });
    client.on("ds-update-all", (dsData: object[]) => {
      this.allDriverStations = dsData;
      this._server.to(this._name).emit("ds-update", JSON.stringify(this.allDriverStations));
    });
  }

  get name(): string {
    return this._name;
  }
}