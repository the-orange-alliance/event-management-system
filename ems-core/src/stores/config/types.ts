import {Action} from "redux";
import {
  SET_EVENT,
  SET_EVENT_CONFIG, SET_FINALS_SCHEDULE, SET_MASTER_HOST, SET_MATCH_CONFIG,
  SET_NETWORK_HOST,
  SET_PRACTICE_SCHEDULE,
  SET_QUALIFICATION_SCHEDULE, SET_SLAVE_ID,
  TOGGLE_SLAVE_MODE
} from "./constants";
import EventConfiguration from "../../shared/models/EventConfiguration";
import Event from "../../shared/models/Event";
import Schedule from "../../shared/models/Schedule";
import MatchConfiguration from "../../shared/models/MatchConfiguration";

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

export interface ISetFinalsSchedule extends Action {
  type: SET_FINALS_SCHEDULE,
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

export type ConfigActions = IToggleSlaveMode | ISetEventConfiguration | ISetEvent | ISetNetworkHost |
  ISetPracticeSchedule | ISetQualificationSchedule | ISetFinalsSchedule| ISetMatchConfig | ISetMasterHost |
  ISetSlaveID;