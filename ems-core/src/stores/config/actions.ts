import {ActionCreator} from "redux";
import {
  ADD_PLAYOFFS_SCHEDULE,
  SET_BACKUP_DIR,
  SET_EVENT,
  SET_EVENT_CONFIG, SET_MASTER_HOST, SET_MATCH_CONFIG,
  SET_NETWORK_HOST, SET_PLAYOFFS_SCHEDULE,
  SET_PRACTICE_SCHEDULE,
  SET_QUALIFICATION_SCHEDULE, SET_SLAVE_ID, SET_TOA_CONFIG,
  TOGGLE_SLAVE_MODE
} from "./constants";
import {
  IAddPlayoffsSchedule,
  ISetBackupDir,
  ISetEvent,
  ISetEventConfiguration, ISetMasterHost, ISetMatchConfig,
  ISetNetworkHost, ISetPlayoffsSchedule,
  ISetPracticeSchedule,
  ISetQualificationSchedule, ISetSlaveID, ISetTOAConfig,
  IToggleSlaveMode
} from "./types";
import {EventConfiguration, MatchConfiguration, Schedule, TOAConfig} from "@the-orange-alliance/lib-ems";

export const enableSlaveMode: ActionCreator<IToggleSlaveMode> = (slaveModeEnabled: boolean) => ({
  type: TOGGLE_SLAVE_MODE,
  payload: {
    slaveModeEnabled: slaveModeEnabled
  }
});

export const setEventConfiguration: ActionCreator<ISetEventConfiguration> = (eventConfiguration: EventConfiguration) => ({
  type: SET_EVENT_CONFIG,
  payload: {
    eventConfiguration: eventConfiguration
  }
});

export const setEvent: ActionCreator<ISetEvent> = (event: Event) => ({
  type: SET_EVENT,
  payload: {
    event: event
  }
});

export const setNetworkHost: ActionCreator<ISetNetworkHost> = (networkHost: string) => ({
  type: SET_NETWORK_HOST,
  payload: {
    networkHost: networkHost
  }
});

export const setPracticeSchedule: ActionCreator<ISetPracticeSchedule> = (schedule: Schedule) => ({
  type: SET_PRACTICE_SCHEDULE,
  payload: {
    schedule: schedule
  }
});

export const setQualificationSchedule: ActionCreator<ISetQualificationSchedule> = (schedule: Schedule) => ({
  type: SET_QUALIFICATION_SCHEDULE,
  payload: {
    schedule: schedule
  }
});

export const setPlayoffsSchedule: ActionCreator<ISetPlayoffsSchedule> = (schedule: Schedule[]) => ({
  type: SET_PLAYOFFS_SCHEDULE,
  payload: {
    schedule: schedule
  }
});

export const addPlayoffsSchedule: ActionCreator<IAddPlayoffsSchedule> = (schedule: Schedule) => ({
  type: ADD_PLAYOFFS_SCHEDULE,
  payload: {
    schedule: schedule
  }
});

export const setMatchConfig: ActionCreator<ISetMatchConfig> = (matchConfig: MatchConfiguration) => ({
  type: SET_MATCH_CONFIG,
  payload: {
    matchConfig: matchConfig
  }
});

export const setMasterHost: ActionCreator<ISetMasterHost> = (masterHost: string) => ({
  type: SET_MASTER_HOST,
  payload: {
    masterHost: masterHost
  }
});

export const setSlaveID: ActionCreator<ISetSlaveID> = (slaveID: number) => ({
  type: SET_SLAVE_ID,
  payload: {
    slaveID: slaveID
  }
});

export const setTOAConfig: ActionCreator<ISetTOAConfig> = (toaConfig: TOAConfig) => ({
  type: SET_TOA_CONFIG,
  payload: {
    toaConfig: toaConfig
  }
});

export const setBackupDir: ActionCreator<ISetBackupDir> = (backupDir: string) => ({
  type: SET_BACKUP_DIR,
  payload: {
    backupDir: backupDir
  }
});