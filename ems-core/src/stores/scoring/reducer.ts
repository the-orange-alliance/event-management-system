import {IScoringState} from "./models";
import {Reducer} from "redux";
import {ScoringActions} from "./types";
import {SET_ACTIVE_MATCH, SET_MATCH_STATE} from "./constants";
import {MatchState} from "../../shared/models/MatchState";

export const initialState: IScoringState = {
  activeMatch: null,
  matchState: MatchState.PRESTART_READY
};

const reducer: Reducer<IScoringState> = (state: IScoringState = initialState, action) => {
  switch ((action as ScoringActions).type) {
    case SET_ACTIVE_MATCH:
      return {...state, activeMatch: action.payload.activeMatch};
    case SET_MATCH_STATE:
      return {...state, matchState: action.payload.matchState};
    default:
      return state;
  }
};

export default reducer;