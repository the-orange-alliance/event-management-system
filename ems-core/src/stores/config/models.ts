import {EventConfiguration, MatchConfiguration, Schedule, EliminationsSchedule, TOAConfig, Event} from "@the-orange-alliance/lib-ems";

export interface IConfigState {
  slaveModeEnabled: boolean,
  slaveInstanceID: number,
  eventConfiguration: EventConfiguration,
  matchConfig: MatchConfiguration,
  event: Event,
  networkHost: string,
  masterHost: string,
  practiceSchedule: Schedule,
  qualificationSchedule: Schedule
  finalsSchedule: Schedule
  eliminationsSchedule: EliminationsSchedule,
  toaConfig: TOAConfig,
  backupDir: string
}