import {Reducer} from "redux";
import {SET_EVENT, SET_EVENT_CONFIG, SET_NETWORK_HOST, SET_PRACTICE_SCHEDULE, TOGGLE_SLAVE_MODE} from "./constants";
import {IConfigState} from "./models";
import {ConfigActions} from "./types";
import * as EventConfig from "../../shared/models/EventConfiguration";
import Event from "../../shared/models/Event";
import Schedule from "../../shared/models/Schedule";

export const initialState: IConfigState = {
  slaveModeEnabled: false,
  eventConfiguration: EventConfig.DEFAULT_RESET,
  event: new Event(),
  networkHost: undefined,
  practiceSchedule: new Schedule("Practice")
};

const reducer: Reducer<IConfigState> = (state: IConfigState = initialState, action) => {
  switch ((action as ConfigActions).type) {
    case TOGGLE_SLAVE_MODE:
      return {...state, slaveModeEnabled: action.payload.slaveModeEnabled};
    case SET_EVENT_CONFIG:
      return {...state, eventConfiguration: action.payload.eventConfiguration};
    case SET_EVENT:
      return {...state, event: action.payload.event};
    case SET_NETWORK_HOST:
      return {...state, networkHost: action.payload.networkHost};
    case SET_PRACTICE_SCHEDULE:
      return {...state, practiceSchedule: action.payload.schedule};
    default:
      return state;
  }
};
export default reducer;