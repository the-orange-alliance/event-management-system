import socketIOClient from "socket.io-client";
import LocalProvider from "./services/LocalProvider";

const API_SERV_PORT = process.env.REACT_APP_EMS_API_PORT;
const SOCKET_SERV_PORT = process.env.REACT_APP_EMS_SCK_PORT;
const HOST = "127.0.0.1";

export const PROD_MODE = process.env.NODE_ENV === "production";
export const APP_NAME = "FGC Referee Tablet";
export let API_URL = "http://" + HOST + ":" + API_SERV_PORT + "/";
export let SOCKET_SERVER = socketIOClient("http://" + HOST + ":" + SOCKET_SERV_PORT);

export const LOCAL_PROVIDER = new LocalProvider();

export let TEAMS_PER_ALLIANCE;
export let SLAVE_MODE = false;

export function initializeVariables() {
	LOCAL_PROVIDER.getEvent().then((response) => {
		const event = response.data.payload[0];
		TEAMS_PER_ALLIANCE = event.alliance_count;
	}).catch((err) => {
		console.error(err);
	});
}

export function enableSlaveMode(hostIP) {
	API_URL = "http://" + hostIP + ":" + API_SERV_PORT + "/";
	LOCAL_PROVIDER.detectChanges();
	SLAVE_MODE = true;
}

export function changeHostAddress(newAddress) {
	SOCKET_SERVER.close();
	API_URL = "http://" + newAddress + ":" + API_SERV_PORT + "/";
	SOCKET_SERVER = socketIOClient("http://" + newAddress + ":" + SOCKET_SERV_PORT);
	LOCAL_PROVIDER.detectChanges();
	SOCKET_SERVER.open();
}