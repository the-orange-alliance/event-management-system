import Event from "../../../shared/models/Event";
import EMSProvider from "../../../shared/providers/EMSProvider";
import {AxiosResponse} from "axios";
import HttpError from "../../../shared/models/HttpError";
import {EMSEventTypes} from "../../../shared/AppTypes";

class EventPostingController {
    private static _instance: EventPostingController;

    public static getInstance(): EventPostingController {
        if (typeof EventPostingController._instance === "undefined") {
            EventPostingController._instance = new EventPostingController();
        }
        return EventPostingController._instance;
    }

    private constructor() {}

    public postEventCreation(eventType: EMSEventTypes, event: Event): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            try {
                EMSProvider.createEvent(eventType).then(() => {
                    EMSProvider.postEvent(eventType, event).then((response: AxiosResponse) => {
                        resolve(response.data);
                    }).catch((error: HttpError) => {
                        reject(error);
                    });
                }).catch((error) => {
                    reject(error); // TODO - What to do here? Try and post event data?
                });
            } catch (e) {
                reject(e);
            }
        });
    }
}

export default EventPostingController.getInstance();