import {IScoringState} from "./models";
import {Reducer} from "redux";
import {ScoringActions} from "./types";
import {SET_ACTIVE_MATCH, SET_MATCH_DURATION, SET_MATCH_STATE} from "./constants";
import {MatchState} from "../../shared/models/MatchState";
import * as moment from "moment";

export const initialState: IScoringState = {
  activeMatch: null,
  matchState: MatchState.PRESTART_READY,
  matchDuration: moment.duration("0", "seconds")
};

const reducer: Reducer<IScoringState> = (state: IScoringState = initialState, action) => {
  switch ((action as ScoringActions).type) {
    case SET_ACTIVE_MATCH:
      return {...state, activeMatch: action.payload.activeMatch};
    case SET_MATCH_STATE:
      return {...state, matchState: action.payload.matchState};
    case SET_MATCH_DURATION:
      return {...state, matchDuration: action.payload.duration};
    default:
      return state;
  }
};

export default reducer;