import {Reducer} from "redux";
import {SET_EVENT, SET_EVENT_CONFIG, TOGGLE_SLAVE_MODE} from "./constants";
import {IConfigState} from "./models";
import {ConfigActions} from "./types";
import * as EventConfig from "../../shared/models/EventConfiguration";
import Event from "../../shared/models/Event";

export const initialState: IConfigState = {
  slaveModeEnabled: false,
  eventConfiguration: EventConfig.DEFAULT_RESET,
  event: new Event()
};

const reducer: Reducer<IConfigState> = (state: IConfigState = initialState, action) => {
  switch ((action as ConfigActions).type) {
    case TOGGLE_SLAVE_MODE:
      return {...state, slaveModeEnabled: action.payload.slaveModeEnabled};
    case SET_EVENT_CONFIG:
      return {...state, eventConfiguration: action.payload.eventConfiguration};
    case SET_EVENT:
      return {...state, event: action.payload.event};
    default:
      return state;
  }
};
export default reducer;