import * as fs from "fs";
import *as path from "path";
import {getAppDataPath} from "appdata-path";
import {Socket, Server} from "socket.io";
import {IRoom} from "./IRoom";
import logger from "../logger";
import {EMSProvider} from "@the-orange-alliance/lib-ems";

export default class EventRoom implements IRoom {
  private readonly _server: Server;
  private readonly _clients: Socket[];
  private readonly _name: string;

  private isSlaveEnabled: boolean;
  private masterAddress: string;
  private teamsList: number[];

  constructor(server: Server) {
    this._server = server;
    this._clients = [];
    this._name = "event";
    this.isSlaveEnabled = false;
    this.masterAddress = "";
    this.teamsList = [];
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
    if (this.isSlaveEnabled) {
      this._server.to(this._name).emit("enter-slave", this.masterAddress);
    }
    if (this.teamsList.length > 0) {
      setTimeout(() => {
        client.emit("alliance-update", this.teamsList);
      }, 250);
    }
    client.on("request-config", () => {
      const fileName = path.resolve(getAppDataPath("") + "/ems-core/config.json");
      fs.readFile(fileName, ((err, data) => {
        if (err) {
          logger.error(err);
        }
        this._server.to(this._name).emit("config-receive", JSON.parse(data.toString()).eventConfig);
      }));
      // this._server.to(this._name).emit("config-receive", host);
    });
    client.on("enter-slave", (masterHost: string) => {
      this.isSlaveEnabled = true;
      this.masterAddress = masterHost;
      logger.info("Asking all clients to enable slave mode on " + masterHost + ".");
      this._server.to(this._name).emit("enter-slave", masterHost);
      // Change this EMS provider as well.
      EMSProvider.initialize(masterHost, parseInt(process.env.API_PORT as string, 10));
    });
    client.on("test-audience", () => {
      this._server.to(this._name).emit("test-audience");
    });
    client.on("test-audience-success", () => {
      this._server.to(this._name).emit("test-audience-success");
    });
    client.on("alliance-update", (teamsList: number[]) => {
      this.teamsList = teamsList;
      this._server.to(this.name).emit("alliance-update", teamsList);
    });
  }

  get name(): string {
    return this._name;
  }
}