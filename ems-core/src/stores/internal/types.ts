import {Action} from "redux";
import {CHANGE_ACTIVE_VIEW} from "./constants";

export interface IChangeActiveView extends Action {
  type: CHANGE_ACTIVE_VIEW,
  payload: {
    activeView: string
  }
}

export type InternalActions = IChangeActiveView;