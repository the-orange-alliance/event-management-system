import {Reducer} from "redux";
import {
  UPDATE_PROCESS_LIST,
  DISABLE_NAVIGATION,
  INCREMENT_COMPLETED_STEP,
  SET_PROCESS_ACTIONS_DISABLED,
  UPDATE_TEAM_LIST,
  ADD_TEAM,
  ALTER_TEAM,
  REMOVE_TEAM,
  SET_PRACTICE_MATCHES,
  SET_QUALIFICATION_MATCHES,
  SET_SOCKET_CONNECTED,
  SET_PLAYOFFS_MATCHES,
  SET_ALLIANCE_MEMBERS, SET_TEST_MATCHES, ADD_PLAYOFFS_MATCHES,
} from "./constants";
import {IInternalState} from "./models";
import {InternalActions} from "./types";

import {Match} from "@the-orange-alliance/lib-ems";

export const initialState: IInternalState = {
  processingActionsDisabled: false,
  processList: [],
  navigationDisabled: false,
  completedStep: 0,
  teamList: [],
  testMatches: [],
  practiceMatches: [],
  qualificationMatches: [],
  playoffsMatches: [],
  allianceMembers: [],
  socketConnected: false,
};

const reducer: Reducer<IInternalState> = (state: IInternalState = initialState, action) => {
  switch ((action as InternalActions).type) {
    case UPDATE_PROCESS_LIST:
      return {...state, processList: action.payload.processList};
    case SET_PROCESS_ACTIONS_DISABLED:
      return {...state, processingActionsDisabled: action.payload.processingActionsDisabled};
    case DISABLE_NAVIGATION:
      return {...state, navigationDisabled: action.payload.navigationDisabled};
    case INCREMENT_COMPLETED_STEP:
      if (action.payload.completedStep === 0) {
        return {...state, completedStep: action.payload.completedStep};
      } else if (action.payload.completedStep > state.completedStep) {
        return {...state, completedStep: action.payload.completedStep};
      } else {
        return state;
      }
    case UPDATE_TEAM_LIST:
      return {...state, teamList: action.payload.teamList};
    case ADD_TEAM:
      return {...state, teamList: [...state.teamList, action.payload.team]};
    case ALTER_TEAM:
      return {
        ...state,
        teamList: state.teamList.map((team, index) => {
          if (index !== action.payload.index) {
            return team;
          } else {
            return team.fromJSON(action.payload.team.toJSON())
          }
        })
      };
    case REMOVE_TEAM:
      return {
        ...state,
        teamList: [...state.teamList.slice(0, action.payload.index), ...state.teamList.slice(1 + action.payload.index)] // TODO - Make this and change element constant functions inside of this reducer
      };
    case SET_TEST_MATCHES:
      return {...state, testMatches: action.payload.matches};
    case SET_PRACTICE_MATCHES:
      return {...state, practiceMatches: action.payload.matches};
    case SET_QUALIFICATION_MATCHES:
      return {...state, qualificationMatches: action.payload.matches};
    case SET_PLAYOFFS_MATCHES:
      return {...state, playoffsMatches: action.payload.matches};
    case ADD_PLAYOFFS_MATCHES:
      return {...state, playoffsMatches: [...state.playoffsMatches.filter((m: Match) => {
        const partialKey: string = m.matchKey.split("-")[3];
        if (partialKey.length > 4) {
          const id: number = parseInt(partialKey.substring(1, 2), 10);
          return id !== action.payload.tournamentId;
        } else {
          return true;
        }
      }), ...action.payload.matches]};
    case SET_ALLIANCE_MEMBERS:
      return {...state, allianceMembers: action.payload.members};
    case SET_SOCKET_CONNECTED:
      return {...state, socketConnected: action.payload.connected};
    default:
      return state;
  }
};
export default reducer;
