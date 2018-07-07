import {ActionCreator} from "redux";
import {CHANGE_ACTIVE_VIEW, DISABLE_NAVIGATION, INCREMENT_COMPLETED_STEP} from "./constants";
import {IChangeActiveView, IDisableNavigation, IIncrementCompletedStep} from "./types";

export const changeActiveView: ActionCreator<IChangeActiveView> = (activeView: string) => ({
  type: CHANGE_ACTIVE_VIEW,
  payload: {
    activeView: activeView
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