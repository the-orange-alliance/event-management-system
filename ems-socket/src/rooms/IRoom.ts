import {Socket} from "socket.io";
import {User} from "@the-orange-alliance/lib-ems";

export interface IRoom {
  name: string,
  addClient: (client: Socket, user: User | null) => void,
  removeClient: (client: Socket) => void
  getClients: () => Socket[]
}
