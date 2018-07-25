import {ActionCreator} from "redux";
import {
  SET_EVENT,
  SET_EVENT_CONFIG, SET_MATCH_CONFIG,
  SET_NETWORK_HOST,
  SET_PRACTICE_SCHEDULE,
  SET_QUALIFICATION_SCHEDULE,
  TOGGLE_SLAVE_MODE
} from "./constants";
import {
  ISetEvent,
  ISetEventConfiguration, ISetMatchConfig,
  ISetNetworkHost,
  ISetPracticeSchedule,
  ISetQualificationSchedule,
  IToggleSlaveMode
} from "./types";
import EventConfiguration from "../../shared/models/EventConfiguration";
import Event from "../../shared/models/Event";
import Schedule from "../../shared/models/Schedule";
import MatchConfiguration from "../../shared/models/MatchConfiguration";

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

export const setMatchConfig: ActionCreator<ISetMatchConfig> = (matchConfig: MatchConfiguration) => ({
  type: SET_MATCH_CONFIG,
  payload: {
    matchConfig: matchConfig
  }
});