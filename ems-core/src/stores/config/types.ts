import {Action} from "redux";
import {PostQualConfig} from "../../shared/AppTypes";
import {SET_POST_QUAL_CONFIG, TOGGLE_SLAVE_MODE} from "./constants";

export interface IToggleSlaveMode extends Action {
  type: TOGGLE_SLAVE_MODE,
  payload: {
    slaveModeEnabled: boolean
  }
}

export interface ISetPostQualConfig extends Action {
  type: SET_POST_QUAL_CONFIG,
  payload: {
    postQualConfig: PostQualConfig
  }
}

export type ConfigActions = IToggleSlaveMode | ISetPostQualConfig;