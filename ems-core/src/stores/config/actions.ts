import {ActionCreator} from "redux";
import {PostQualConfig} from "../../shared/AppTypes";
import {SET_POST_QUAL_CONFIG, TOGGLE_SLAVE_MODE} from "./constants";
import {ISetPostQualConfig, IToggleSlaveMode} from "./types";

export const enableSlaveMode: ActionCreator<IToggleSlaveMode> = (slaveModeEnabled: boolean) => ({
  type: TOGGLE_SLAVE_MODE,
  payload: {
    slaveModeEnabled: slaveModeEnabled
  }
});

export const setPostQualConfig: ActionCreator<ISetPostQualConfig> = (postQualConfig: PostQualConfig) => ({
  type: SET_POST_QUAL_CONFIG,
  payload: {
    postQualConfig: postQualConfig
  }
});