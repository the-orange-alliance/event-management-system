import {combineReducers, Reducer} from "redux";
import {IConfigState} from "./config/models";
import configReducer from "./config/reducer";
import {ConfigActions} from "./config/types";
import {IInternalState} from "./internal/models";
import internalReducer from "./internal/reducer";
import {InternalActions} from "./internal/types";
import {IScoringState} from "./scoring/models";
import scoringReducer from "./scoring/reducer";
import {ScoringActions} from "./scoring/types";

export interface IApplicationState {
  internalState: IInternalState,
  configState: IConfigState,
  scoringState: IScoringState
}

export const reducers: Reducer<IApplicationState> = combineReducers<IApplicationState>({
  internalState: internalReducer,
  configState: configReducer,
  scoringState: scoringReducer
});

export type ApplicationActions = ConfigActions | InternalActions | ScoringActions;