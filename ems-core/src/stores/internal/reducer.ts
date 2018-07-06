import {Reducer} from "redux";
import {CHANGE_ACTIVE_VIEW} from "./constants";
import {IInternalState} from "./models";
import {InternalActions} from "./types";

export const initialState: IInternalState = {
  activeView: "Event Manager"
};

const reducer: Reducer<IInternalState> = (state: IInternalState = initialState, action) => {
  switch ((action as InternalActions).type) {
    case CHANGE_ACTIVE_VIEW:
      return {...state, activeView: action.payload.activeView};
    default:
      return state;
  }
};
export default reducer;