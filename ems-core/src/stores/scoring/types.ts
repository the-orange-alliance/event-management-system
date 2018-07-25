import {SET_ACTIVE_MATCH} from "./constants";
import Match from "../../shared/models/Match";

export interface ISetActiveMatch {
  type: SET_ACTIVE_MATCH,
  payload: {
    activeMatch: Match
  }
}

export type ScoringActions = ISetActiveMatch;