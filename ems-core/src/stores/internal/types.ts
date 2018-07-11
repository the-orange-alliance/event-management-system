import {Action} from "redux";
import {UPDATE_PROCESS_LIST, DISABLE_NAVIGATION, INCREMENT_COMPLETED_STEP} from "./constants";
import Process from "../../shared/models/Process";

export interface IUpdateProcessList extends Action {
  type: UPDATE_PROCESS_LIST,
  payload: {
    processList: Process[]
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

export type InternalActions = IUpdateProcessList | IDisableNavigation | IIncrementCompletedStep;