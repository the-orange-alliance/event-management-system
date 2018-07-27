import {Socket} from "socket.io";

export interface IRoom {
  name: string,
  addClient: (client: Socket) => void,
  removeClient: (client: Socket) => void
  getClients: () => Socket[]
}