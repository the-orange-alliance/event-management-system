import {Reducer} from "redux";
import {
  UPDATE_PROCESS_LIST, DISABLE_NAVIGATION, INCREMENT_COMPLETED_STEP,
  SET_PROCESS_ACTIONS_DISABLED
} from "./constants";
import {IInternalState} from "./models";
import {InternalActions} from "./types";

export const initialState: IInternalState = {
  processingActionsDisabled: false,
  processList: [],
  navigationDisabled: false,
  completedStep: 0
};

const reducer: Reducer<IInternalState> = (state: IInternalState = initialState, action) => {
  switch ((action as InternalActions).type) {
    case UPDATE_PROCESS_LIST:
      return {...state, processList: action.payload.processList};
    case SET_PROCESS_ACTIONS_DISABLED:
      return {...state, processingActionsDisabled: action.payload.processingActionsDisabled};
    case DISABLE_NAVIGATION:
      return {...state, navigationDisabled: action.payload.navigationDisabled};
    case INCREMENT_COMPLETED_STEP:
      return {...state, completedStep: action.payload.completedStep};
    default:
      return state;
  }
};
export default reducer;