import {Reducer} from "redux";
import {SET_POST_QUAL_CONFIG, TOGGLE_SLAVE_MODE} from "./constants";
import {IConfigState} from "./models";
import {ConfigActions} from "./types";

export const initialState: IConfigState = {
  slaveModeEnabled: false,
  postQualConfig: "elims"
};

const reducer: Reducer<IConfigState> = (state: IConfigState = initialState, action) => {
  switch ((action as ConfigActions).type) {
    case TOGGLE_SLAVE_MODE:
      return {...state, slaveModeEnabled: action.payload.slaveModeEnabled};
    case SET_POST_QUAL_CONFIG:
      return {...state, postQualConfig: action.payload.postQualConfig};
    default:
      return state;
  }
};
export default reducer;