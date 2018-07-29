import {ActionCreator} from "redux";
import {ISetActiveMatch, ISetMatchDuration, ISetMatchState} from "./types";
import Match from "../../shared/models/Match";
import {SET_ACTIVE_MATCH, SET_MATCH_DURATION, SET_MATCH_STATE} from "./constants";
import {MatchState} from "../../shared/models/MatchState";
import * as moment from "moment";

export const setActiveMatch: ActionCreator<ISetActiveMatch> = (activeMatch: Match) => ({
  type: SET_ACTIVE_MATCH,
  payload: {
    activeMatch: activeMatch
  }
});

export const setMatchState: ActionCreator<ISetMatchState> = (matchState: MatchState) => ({
  type: SET_MATCH_STATE,
  payload: {
    matchState: matchState
  }
});

export const setMatchDuration: ActionCreator<ISetMatchDuration> = (duration: moment.Duration) => ({
  type: SET_MATCH_DURATION,
  payload: {
    duration: duration
  }
});