import {ActionCreator} from "redux";
import {TOGGLE_SLAVE_MODE} from "./constants";
import {IToggleSlaveMode} from "./types";

export const enableSlaveMode: ActionCreator<IToggleSlaveMode> = (slaveModeEnabled: boolean) => ({
  type: TOGGLE_SLAVE_MODE,
  payload: {
    slaveModeEnabled: slaveModeEnabled
  }
});