import {ActionCreator} from "redux";
import {UPDATE_PROCESS_LIST, DISABLE_NAVIGATION, INCREMENT_COMPLETED_STEP} from "./constants";
import {IUpdateProcessList, IDisableNavigation, IIncrementCompletedStep} from "./types";
import Process from "../../shared/models/Process";

export const updateProcessList: ActionCreator<IUpdateProcessList> = (processList: Process[]) => ({
  type: UPDATE_PROCESS_LIST,
  payload: {
    processList: processList
  }
});

export const disableNavigation: ActionCreator<IDisableNavigation> = (navigationDisabled: boolean) => ({
  type: DISABLE_NAVIGATION,
  payload: {
    navigationDisabled: navigationDisabled
  }
});

export const incrementCompletedStep: ActionCreator<IIncrementCompletedStep> = (completedStep: number) => ({
  type: INCREMENT_COMPLETED_STEP,
  payload: {
    completedStep: completedStep
  }
});