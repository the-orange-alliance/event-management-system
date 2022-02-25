import {
  EventConfiguration,
  MatchConfiguration,
  Schedule,
  Event,
  UploadConfig
} from "@the-orange-alliance/lib-ems";

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
  uploadConfig: UploadConfig,
  backupDir: string,
  apiKey: string
}
