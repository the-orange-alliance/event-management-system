import {
  SET_ACTIVE_DETAILS,
  SET_ACTIVE_MATCH, SET_ACTIVE_PARTICIPANTS,
  SET_MATCH_DURATION,
  SET_MATCH_STATE, UPDATE_PARTICIPANT_STATUS,
} from "./constants";
import {Match, MatchState, MatchParticipant, MatchDetails} from "@the-orange-alliance/lib-ems";
import moment from "moment";

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
    participant: MatchParticipant,
    status: number
  }
}

export type ScoringActions = ISetActiveMatch | ISetMatchState | ISetMatchDuration | ISetActiveParticipants |
  ISetActiveDetails | IUpdateParticipantStatus;
