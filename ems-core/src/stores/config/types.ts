import {Action} from "redux";
import {TOGGLE_SLAVE_MODE} from "./constants";

export interface IToggleSlaveMode extends Action {
  type: TOGGLE_SLAVE_MODE,
  payload: {
    slaveModeEnabled: boolean
  }
}

export type ConfigActions = IToggleSlaveMode;