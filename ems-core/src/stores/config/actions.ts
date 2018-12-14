import {ActionCreator} from "redux";
import {
  SET_BACKUP_DIR,
  SET_ELIMINATIONS_SCHEDULE,
  SET_EVENT,
  SET_EVENT_CONFIG, SET_FINALS_SCHEDULE, SET_MASTER_HOST, SET_MATCH_CONFIG,
  SET_NETWORK_HOST,
  SET_PRACTICE_SCHEDULE,
  SET_QUALIFICATION_SCHEDULE, SET_SLAVE_ID, SET_TOA_CONFIG,
  TOGGLE_SLAVE_MODE
} from "./constants";
import {
  ISetBackupDir,
  ISetEliminationsSchedule,
  ISetEvent,
  ISetEventConfiguration, ISetFinalsSchedule, ISetMasterHost, ISetMatchConfig,
  ISetNetworkHost,
  ISetPracticeSchedule,
  ISetQualificationSchedule, ISetSlaveID, ISetTOAConfig,
  IToggleSlaveMode
} from "./types";
import EventConfiguration from "../../shared/models/EventConfiguration";
import Event from "../../shared/models/Event";
import Schedule from "../../shared/models/Schedule";
import MatchConfiguration from "../../shared/models/MatchConfiguration";
import EliminationsSchedule from "../../shared/models/EliminationsSchedule";
import TOAConfig from "../../shared/models/TOAConfig";

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

export const setFinalsSchedule: ActionCreator<ISetFinalsSchedule> = (schedule: Schedule) => ({
  type: SET_FINALS_SCHEDULE,
  payload: {
    schedule: schedule
  }
});

export const setEliminationsSchedule: ActionCreator<ISetEliminationsSchedule> = (schedule: EliminationsSchedule) => ({
  type: SET_ELIMINATIONS_SCHEDULE,
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