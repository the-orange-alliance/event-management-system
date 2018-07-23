import EventConfiguration from "../../shared/models/EventConfiguration";
import Event from "../../shared/models/Event";
import Schedule from "../../shared/models/Schedule";

export interface IConfigState {
  slaveModeEnabled: boolean,
  eventConfiguration: EventConfiguration,
  event: Event,
  networkHost: string,
  practiceSchedule: Schedule
}