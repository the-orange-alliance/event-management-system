import {
  SET_ACTIVE_DETAILS,
  SET_ACTIVE_MATCH, SET_ACTIVE_PARTICIPANTS,
  SET_MATCH_DURATION,
  SET_MATCH_STATE, UPDATE_PARTICIPANT_STATUS,
} from "./constants";
import Match from "../../shared/models/Match";
import {MatchState} from "../../shared/models/MatchState";
import * as moment from "moment";
import MatchParticipant from "../../shared/models/MatchParticipant";
import MatchDetails from "../../shared/models/MatchDetails";

export interface ISetActiveMatch {
  type: SET_ACTIVE_MATCH,
  payload: {
    activeMatch: Match
  }
}

export interface ISetActiveParticipants {
  type: SET_ACTIVE_PARTICIPANTS,
  payload: {
    participants: MatchParticipant[]
  }
}

export interface ISetActiveDetails {
  type: SET_ACTIVE_DETAILS,
  payload: {
    details: MatchDetails
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

export interface IUpdateParticipantStatus {
  type: UPDATE_PARTICIPANT_STATUS,
  payload: {
    index: number,
    status: number
  }
}

export type ScoringActions = ISetActiveMatch | ISetMatchState | ISetMatchDuration | ISetActiveParticipants |
  ISetActiveDetails | IUpdateParticipantStatus;