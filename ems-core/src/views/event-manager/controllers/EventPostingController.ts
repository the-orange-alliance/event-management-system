import Event from "../../../shared/models/Event";
import EMSProvider from "../../../shared/providers/EMSProvider";
import {AxiosResponse} from "axios";
import {EMSEventTypes} from "../../../shared/AppTypes";
import HttpError from "../../../shared/models/HttpError";
import Team from "../../../shared/models/Team";

class EventPostingController {
  private static _instance: EventPostingController;

  public static getInstance(): EventPostingController {
    if (typeof EventPostingController._instance === "undefined") {
      EventPostingController._instance = new EventPostingController();
    }
    return EventPostingController._instance;
  }

  private constructor() {}

  public createEventDatabase(eventType: EMSEventTypes, event: Event): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      try {
        EMSProvider.getEvent().then((response: AxiosResponse) => {
          if (response.data.payload && response.data.payload[0] && response.data.payload[0].event_key) {
            /* Resolve. The event database was originally created, and nothing needs to be done. This is
               completely safe.*/
            resolve(response.data.payload[0]);
          } else {
            EMSProvider.postEvent(event).then((eventResponse: AxiosResponse) => {
              resolve(eventResponse.data.payload[0]);
            }).catch((error: HttpError) => {
              // If we can't post the event, then something is wrong.
              reject(error);
            });
          }
        }).catch(() => {
          // If this errors out, then the database has not been created.
          EMSProvider.createEvent(eventType).then(() => {
            EMSProvider.postEvent(event).then((response: AxiosResponse) => {
              resolve(response.data.payload[0]);
            }).catch((error: HttpError) => {
              // If we can't post the event, then something is wrong.
              reject(error);
            });
          }).catch((error: HttpError) => {
            // If this errors out... Something is wrong.
            reject(error);
          });
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  public createTeamList(teams: Team[]): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      EMSProvider.getTeams().then((response: AxiosResponse) => {
        if (response.data.payload && response.data.payload.length > 0) {
          resolve();
        } else {
          EMSProvider.postTeams(teams).then(() => {
            resolve();
          }).catch((error: HttpError) => {
            reject(error);
          });
        }
      }).catch(() => {
        EMSProvider.postTeams(teams).then(() => {
          resolve();
        }).catch((error: HttpError) => {
          reject(error);
        });
      });
    });
  }
}

export default EventPostingController.getInstance();