import {IScoringState} from "./models";
import {Reducer} from "redux";
import {ScoringActions} from "./types";
import {SET_ACTIVE_MATCH} from "./constants";

export const initialState: IScoringState = {
  activeMatch: null
};

const reducer: Reducer<IScoringState> = (state: IScoringState = initialState, action) => {
  switch ((action as ScoringActions).type) {
    case SET_ACTIVE_MATCH:
      return {...state, activeMatch: action.payload.activeMatch};
    default:
      return state;
  }
};

export default reducer;