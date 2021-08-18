import {EventConfiguration, MatchConfiguration, Schedule, TOAConfig, Event} from "@the-orange-alliance/lib-ems";

export interface IConfigState {
  slaveModeEnabled: boolean,
  slaveInstanceID: number,
  eventConfiguration: EventConfiguration,
  matchConfig: MatchConfiguration,
  event: Event,
  networkHost: string,
  masterHost: string,
  practiceSchedule: Schedule,
  qualificationSchedule: Schedule,
  playoffsSchedule: Schedule[],
  toaConfig: TOAConfig,
  backupDir: string,
  apiKey: string
}
