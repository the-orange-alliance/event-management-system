import {Action} from "redux";
import {CHANGE_ACTIVE_VIEW, DISABLE_NAVIGATION, INCREMENT_COMPLETED_STEP} from "./constants";

export interface IChangeActiveView extends Action {
  type: CHANGE_ACTIVE_VIEW,
  payload: {
    activeView: string
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

export type InternalActions = IChangeActiveView | IDisableNavigation | IIncrementCompletedStep;