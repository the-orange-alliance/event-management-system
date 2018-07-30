import {API_URL} from "../AppConstants";
import AppError from "../AppError";
import axios from "axios";

class LocalProvider {

	constructor() {
		this.axios = axios.create({
			baseURL: API_URL,
			timeout: 5000,
			headers: {
				"Content-Type": "application/json"
			}
		});
	}

	detectChanges() {
		this.axios = axios.create({
			baseURL: API_URL,
			timeout: 5000,
			headers: {
				"Content-Type": "application/json"
			}
		});
	}

	get(url) {
		return new Promise((resolve, reject) => {
			this.axios.get(url, {data: {}}).then((response) => {
				resolve(response);
			}).catch((error) => {
				if (error.response) {
					reject(new AppError(error.response.data.message, error.response.data.code, API_URL + url));
				} else if (error.request) {
					reject(new AppError("ERR_CONNECTION_REFUSED", -1, API_URL + url));
				} else {
					reject(new AppError(error.message, -2, API_URL + url));
				}
			});
		});
	}

	getEvent() {
		return this.get("api/event");
	}

	getActiveMatch() {
		return this.get("api/match");
	}

	getMatchParticipants(match_key) {
		return this.get("api/match/" + match_key + "/participants");
	}

	getMatch(match_key) {
		return this.get("api/match/" + match_key);
	}

}

export default LocalProvider;