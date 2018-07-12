import EventConfiguration from "../../shared/models/EventConfiguration";
import Event from "../../shared/models/Event";

export interface IConfigState {
  slaveModeEnabled: boolean,
  eventConfiguration: EventConfiguration,
  event: Event,
  networkHost: string
}