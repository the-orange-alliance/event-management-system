import {combineReducers, createStore, Reducer} from "redux";
import {IConfigState} from "./config/models";
import configReducer from "./config/reducer";

export interface IApplicationState {
  configState: IConfigState
}

export const reducers: Reducer<IApplicationState> = combineReducers<IApplicationState>({
  configState: configReducer
});

export const applicationStore = createStore(reducers);