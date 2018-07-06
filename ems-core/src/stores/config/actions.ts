import {ActionCreator} from "redux";
import {CHANGE_ACTIVE_VIEW} from "./models";
import {IUpdateActiveViewAction} from "./types";

export const updateActiveView: ActionCreator<IUpdateActiveViewAction> = (activeView: string) => ({
  type: CHANGE_ACTIVE_VIEW,
  payload: {
    activeView: activeView
  }
});