import {Action} from "redux";
import {CHANGE_ACTIVE_VIEW} from "./models";

export interface IUpdateActiveViewAction extends Action {
  type: CHANGE_ACTIVE_VIEW,
  payload: {
    activeView: string
  }
}

export type ConfigActions = IUpdateActiveViewAction;