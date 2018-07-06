import {Reducer} from "redux";
import {CHANGE_ACTIVE_VIEW, IConfigState} from "./models";
import {ConfigActions} from "./types";

export const initialState: IConfigState = {
  activeView: "Event Manager"
};

const reducer: Reducer<IConfigState> = (state: IConfigState = initialState, action) => {
  switch ((action as ConfigActions).type) {
    case CHANGE_ACTIVE_VIEW:
      return {...state, activeView: action.payload.activeView};
    default:
      return state;
  }
};
export default reducer;