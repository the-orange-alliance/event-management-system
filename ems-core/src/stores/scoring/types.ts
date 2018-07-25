import {SET_ACTIVE_MATCH, SET_MATCH_STATE} from "./constants";
import Match from "../../shared/models/Match";
import {MatchState} from "../../shared/models/MatchState";

export interface ISetActiveMatch {
  type: SET_ACTIVE_MATCH,
  payload: {
    activeMatch: Match
  }
}

export interface ISetMatchState {
  type: SET_MATCH_STATE,
  payload: {
    matchState: MatchState
  }
}

export type ScoringActions = ISetActiveMatch | ISetMatchState;