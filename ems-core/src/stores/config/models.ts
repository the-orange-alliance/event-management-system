import EventConfiguration from "../../shared/models/EventConfiguration";
import Event from "../../shared/models/Event";
import Schedule from "../../shared/models/Schedule";
import MatchConfiguration from "../../shared/models/MatchConfiguration";

export interface IConfigState {
  slaveModeEnabled: boolean,
  eventConfiguration: EventConfiguration,
  matchConfig: MatchConfiguration,
  event: Event,
  networkHost: string,
  practiceSchedule: Schedule,
  qualificationSchedule: Schedule
}