import {Action} from "redux";
import {
  UPDATE_PROCESS_LIST, DISABLE_NAVIGATION, INCREMENT_COMPLETED_STEP,
  SET_PROCESS_ACTIONS_DISABLED
} from "./constants";
import Process from "../../shared/models/Process";

export interface IUpdateProcessList extends Action {
  type: UPDATE_PROCESS_LIST,
  payload: {
    processList: Process[]
  }
}

export interface ISetProcessActionsDisabled extends Action {
  type: SET_PROCESS_ACTIONS_DISABLED,
  payload: {
    processingActionsDisabled: boolean
  }
}

export interface IDisableNavigation extends Action {
  type: DISABLE_NAVIGATION,
  payload: {
    navigationDisabled: boolean
  }
}

export interface IIncrementCompletedStep extends Action {
  type: INCREMENT_COMPLETED_STEP,
  payload: {
    completedStep: number
  }
}

export type InternalActions = ISetProcessActionsDisabled | IUpdateProcessList | IDisableNavigation | IIncrementCompletedStep;