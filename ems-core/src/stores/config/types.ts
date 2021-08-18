import {Action} from "redux";
import {
  ADD_PLAYOFFS_SCHEDULE, SET_API_KEY,
  SET_BACKUP_DIR,
  SET_EVENT,
  SET_EVENT_CONFIG, SET_MASTER_HOST, SET_MATCH_CONFIG,
  SET_NETWORK_HOST, SET_PLAYOFFS_SCHEDULE,
  SET_PRACTICE_SCHEDULE,
  SET_QUALIFICATION_SCHEDULE, SET_SLAVE_ID, SET_TOA_CONFIG,
  TOGGLE_SLAVE_MODE
} from "./constants";
import {EventConfiguration, MatchConfiguration, Schedule, TOAConfig} from "@the-orange-alliance/lib-ems";

export interface IToggleSlaveMode extends Action {
  type: TOGGLE_SLAVE_MODE,
  payload: {
    slaveModeEnabled: boolean
  }
}

export interface ISetEventConfiguration extends Action {
  type: SET_EVENT_CONFIG,
  payload: {
    eventConfiguration: EventConfiguration
  }
}

export interface ISetEvent extends Action {
  type: SET_EVENT,
  payload: {
    event: Event
  }
}

export interface ISetNetworkHost extends Action {
  type: SET_NETWORK_HOST,
  payload: {
    networkHost: string
  }
}

export interface ISetPracticeSchedule extends Action {
  type: SET_PRACTICE_SCHEDULE,
  payload: {
    schedule: Schedule
  }
}

export interface ISetQualificationSchedule extends Action {
  type: SET_QUALIFICATION_SCHEDULE,
  payload: {
    schedule: Schedule
  }
}

export interface ISetPlayoffsSchedule extends Action {
  type: SET_PLAYOFFS_SCHEDULE,
  payload: {
    schedule: Schedule[]
  }
}

export interface IAddPlayoffsSchedule extends Action {
  type: ADD_PLAYOFFS_SCHEDULE,
  payload: {
    schedule: Schedule
  }
}

export interface ISetMatchConfig extends Action {
  type: SET_MATCH_CONFIG,
  payload: {
    matchConfig: MatchConfiguration
  }
}

export interface ISetMasterHost extends Action {
  type: SET_MASTER_HOST,
  payload: {
    masterHost: string
  }
}

export interface ISetSlaveID extends Action {
  type: SET_SLAVE_ID,
  payload: {
    slaveID: number
  }
}

export interface ISetTOAConfig extends Action {
  type: SET_TOA_CONFIG,
  payload: {
    toaConfig: TOAConfig
  }
}

export interface ISetBackupDir extends Action {
  type: SET_BACKUP_DIR,
  payload: {
    backupDir: string
  }
}

export interface ISetApiKey extends Action {
  type: SET_API_KEY,
  payload: {
    key: string
  }
}

export type ConfigActions = IToggleSlaveMode | ISetEventConfiguration | ISetEvent | ISetNetworkHost |
  ISetPracticeSchedule | ISetQualificationSchedule | ISetPlayoffsSchedule | IAddPlayoffsSchedule |
  ISetMatchConfig | ISetMasterHost | ISetSlaveID | ISetTOAConfig | ISetBackupDir | ISetApiKey;
