import {ActionCreator} from "redux";
import {SET_EVENT, SET_EVENT_CONFIG, TOGGLE_SLAVE_MODE} from "./constants";
import {ISetEvent, ISetEventConfiguration, IToggleSlaveMode} from "./types";
import EventConfiguration from "../../shared/models/EventConfiguration";
import Event from "../../shared/models/Event";

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