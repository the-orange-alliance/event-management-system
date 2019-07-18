import {ActionCreator} from "redux";
import {
  ISetActiveDetails,
  ISetActiveMatch, ISetActiveParticipants,
  ISetMatchDuration,
  ISetMatchState, IUpdateParticipantStatus,
} from "./types";
import {
  SET_ACTIVE_DETAILS,
  SET_ACTIVE_MATCH, SET_ACTIVE_PARTICIPANTS,
  SET_MATCH_DURATION,
  SET_MATCH_STATE, UPDATE_PARTICIPANT_STATUS
} from "./constants";
import * as moment from "moment";
import {Match, MatchState, MatchParticipant, MatchDetails} from "@the-orange-alliance/lib-ems";

export const setActiveMatch: ActionCreator<ISetActiveMatch> = (activeMatch: Match) => ({
  type: SET_ACTIVE_MATCH,
  payload: {
    activeMatch: activeMatch
  }
});

export const setActiveParticipants: ActionCreator<ISetActiveParticipants> = (participants: MatchParticipant[]) => ({
  type: SET_ACTIVE_PARTICIPANTS,
  payload: {
    participants: participants
  }
});

export const setActiveDetails: ActionCreator<ISetActiveDetails> = (details: MatchDetails) => ({
  type: SET_ACTIVE_DETAILS,
  payload: {
    details: details
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

export const updateParticipantStatus: ActionCreator<IUpdateParticipantStatus> = (participant: MatchParticipant, status: number) => ({
  type: UPDATE_PARTICIPANT_STATUS,
  payload: {
    participant: participant,
    status: status
  }
});