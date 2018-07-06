import {ActionCreator} from "redux";
import {CHANGE_ACTIVE_VIEW} from "./constants";
import {IChangeActiveView} from "./types";

export const changeActiveView: ActionCreator<IChangeActiveView> = (activeView: string) => ({
  type: CHANGE_ACTIVE_VIEW,
  payload: {
    activeView: activeView
  }
});