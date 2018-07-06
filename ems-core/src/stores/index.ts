import {combineReducers, createStore, Reducer} from "redux";
import {IConfigState} from "./config/models";
import configReducer from "./config/reducer";
import {IInternalState} from "./internal/models";
import internalReducer from "./internal/reducer";

export interface IApplicationState {
  internalState: IInternalState,
  configState: IConfigState
}

export const reducers: Reducer<IApplicationState> = combineReducers<IApplicationState>({
  internalState: internalReducer,
  configState: configReducer
});

export const applicationStore = createStore(reducers);