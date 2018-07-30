import {SET_ACTIVE_MATCH, SET_MATCH_DURATION, SET_MATCH_STATE, UPDATE_SCORING_OBJECT} from "./constants";
import Match from "../../shared/models/Match";
import {MatchState} from "../../shared/models/MatchState";
import * as moment from "moment";
import SocketMatch from "../../shared/models/scoring/SocketMatch";

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

export interface ISetMatchDuration {
  type: SET_MATCH_DURATION,
  payload: {
    duration: moment.Duration
  }
}

export interface IUpdateScoringObject {
  type: UPDATE_SCORING_OBJECT,
  payload: {
    scoreObj: SocketMatch
  }
}

export type ScoringActions = ISetActiveMatch | ISetMatchState | ISetMatchDuration | IUpdateScoringObject;