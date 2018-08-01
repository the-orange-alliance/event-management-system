import {IScoringState} from "./models";
import {Reducer} from "redux";
import {ScoringActions} from "./types";
import {
  SET_ACTIVE_DETAILS,
  SET_ACTIVE_MATCH, SET_ACTIVE_PARTICIPANTS,
  SET_MATCH_DURATION,
  SET_MATCH_STATE, UPDATE_PARTICIPANT_STATUS
} from "./constants";
import {MatchState} from "../../shared/models/MatchState";
import * as moment from "moment";

// Since redux only allows shallow copying, our participants/details must be flattened.
export const initialState: IScoringState = {
  activeMatch: null,
  activeParticipants: [],
  activeDetails: null,
  matchState: MatchState.PRESTART_READY,
  matchDuration: moment.duration("0", "seconds")
};

const reducer: Reducer<IScoringState> = (state: IScoringState = initialState, action) => {
  switch ((action as ScoringActions).type) {
    case SET_ACTIVE_MATCH:
      return {...state, activeMatch: action.payload.activeMatch};
    case SET_ACTIVE_PARTICIPANTS:
      return {...state, activeParticipants: action.payload.participants};
    case SET_ACTIVE_DETAILS:
      return {...state, activeDetails: action.payload.details};
    case SET_MATCH_STATE:
      return {...state, matchState: action.payload.matchState};
    case SET_MATCH_DURATION:
      return {...state, matchDuration: action.payload.duration};
    case UPDATE_PARTICIPANT_STATUS:
      return {...state, activeParticipants: state.activeParticipants.map((participant, index) => {
        if (index !== action.payload.index) {
          return participant;
        } else {
          participant.cardStatus = action.payload.status;
          return participant;
        }
      })};
    default:
      return state;
  }
};

export default reducer;