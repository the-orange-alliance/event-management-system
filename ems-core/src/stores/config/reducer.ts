import {Reducer} from "redux";
import {
  SET_EVENT,
  SET_EVENT_CONFIG, SET_MASTER_HOST, SET_MATCH_CONFIG,
  SET_NETWORK_HOST,
  SET_PRACTICE_SCHEDULE,
  SET_QUALIFICATION_SCHEDULE, SET_SLAVE_ID,
  TOGGLE_SLAVE_MODE
} from "./constants";
import {IConfigState} from "./models";
import {ConfigActions} from "./types";
import * as EventConfig from "../../shared/models/EventConfiguration";
import Event from "../../shared/models/Event";
import Schedule from "../../shared/models/Schedule";
import MatchConfiguration from "../../shared/models/MatchConfiguration";

export const initialState: IConfigState = {
  slaveModeEnabled: false,
  slaveInstanceID: 1,
  eventConfiguration: EventConfig.DEFAULT_RESET,
  matchConfig: new MatchConfiguration(),
  event: new Event(),
  networkHost: undefined,
  masterHost: undefined,
  practiceSchedule: new Schedule("Practice"),
  qualificationSchedule: new Schedule("Qualification"),
  finalsSchedule: new Schedule("Finals")
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
    case SET_QUALIFICATION_SCHEDULE:
      return {...state, qualificationSchedule: action.payload.schedule};
    case SET_MATCH_CONFIG:
      return {...state, matchConfig: action.payload.matchConfig};
    case SET_MASTER_HOST:
      return {...state, masterHost: action.payload.masterHost};
    case SET_SLAVE_ID:
      return {...state, slaveInstanceID: action.payload.slaveID};
    default:
      return state;
  }
};
export default reducer;