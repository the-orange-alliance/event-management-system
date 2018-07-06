import {Reducer} from "redux";
import {TOGGLE_SLAVE_MODE} from "./constants";
import {IConfigState} from "./models";
import {ConfigActions} from "./types";

export const initialState: IConfigState = {
  slaveModeEnabled: false
};

const reducer: Reducer<IConfigState> = (state: IConfigState = initialState, action) => {
  switch ((action as ConfigActions).type) {
    case TOGGLE_SLAVE_MODE:
      return {...state, slaveModeEnabled: action.payload.slaveModeEnabled};
    default:
      return state;
  }
};
export default reducer;