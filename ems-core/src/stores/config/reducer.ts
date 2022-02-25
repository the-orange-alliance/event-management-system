import {Reducer} from "redux";
import {
  ADD_PLAYOFFS_SCHEDULE,
  SET_BACKUP_DIR,
  SET_EVENT,
  SET_EVENT_CONFIG, SET_MASTER_HOST, SET_MATCH_CONFIG,
  SET_NETWORK_HOST, SET_PLAYOFFS_SCHEDULE,
  SET_PRACTICE_SCHEDULE,
  SET_QUALIFICATION_SCHEDULE, SET_SLAVE_ID, SET_TOA_CONFIG,
  TOGGLE_SLAVE_MODE,
  SET_API_KEY,
} from "./constants";
import {IConfigState} from "./models";
import {ConfigActions} from "./types";
import {
  MatchConfiguration,
  Schedule,
  EventConfiguration,
  Event,
  UploadConfig
} from "@the-orange-alliance/lib-ems";

export const initialState: IConfigState = {
  slaveModeEnabled: false,
  slaveInstanceID: 1,
  eventConfiguration: new EventConfiguration(),
  matchConfig: new MatchConfiguration(),
  event: new Event(),
  networkHost: undefined,
  masterHost: undefined,
  practiceSchedule: new Schedule("Practice"),
  qualificationSchedule: new Schedule("Qualification"),
  playoffsSchedule: [],
  uploadConfig: new UploadConfig(),
  backupDir: "",
  apiKey: ""
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
    case SET_PLAYOFFS_SCHEDULE:
      return {...state, playoffsSchedule: action.payload.schedule};
    case ADD_PLAYOFFS_SCHEDULE:
      return {...state, playoffsSchedule: [...state.playoffsSchedule, action.payload.schedule]};
    case SET_MATCH_CONFIG:
      return {...state, matchConfig: action.payload.matchConfig};
    case SET_MASTER_HOST:
      return {...state, masterHost: action.payload.masterHost};
    case SET_SLAVE_ID:
      return {...state, slaveInstanceID: action.payload.slaveID};
    case SET_TOA_CONFIG:
      return {...state, toaConfig: action.payload.toaConfig};
    case SET_BACKUP_DIR:
      return {...state, backupDir: action.payload.backupDir};
    case SET_API_KEY:
      return {...state, apiKey: action.payload.key};
    default:
      return state;
  }
};
export default reducer;
