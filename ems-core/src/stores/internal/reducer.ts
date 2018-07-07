import {Reducer} from "redux";
import {CHANGE_ACTIVE_VIEW, DISABLE_NAVIGATION, INCREMENT_COMPLETED_STEP} from "./constants";
import {IInternalState} from "./models";
import {InternalActions} from "./types";

export const initialState: IInternalState = {
  activeView: "Event Manager",
  navigationDisabled: false,
  completedStep: 0
};

const reducer: Reducer<IInternalState> = (state: IInternalState = initialState, action) => {
  switch ((action as InternalActions).type) {
    case CHANGE_ACTIVE_VIEW:
      return {...state, activeView: action.payload.activeView};
    case DISABLE_NAVIGATION:
      return {...state, navigationDisabled: action.payload.navigationDisabled};
    case INCREMENT_COMPLETED_STEP:
      return {...state, completedStep: action.payload.completedStep};
    default:
      return state;
  }
};
export default reducer;