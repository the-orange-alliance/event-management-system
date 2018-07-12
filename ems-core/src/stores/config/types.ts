import {Action} from "redux";
import {SET_EVENT, SET_EVENT_CONFIG, SET_NETWORK_HOST, TOGGLE_SLAVE_MODE} from "./constants";
import EventConfiguration from "../../shared/models/EventConfiguration";
import Event from "../../shared/models/Event";

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

export type ConfigActions = IToggleSlaveMode | ISetEventConfiguration | ISetEvent | ISetNetworkHost;