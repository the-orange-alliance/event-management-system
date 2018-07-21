import {Reducer} from "redux";
import {
  UPDATE_PROCESS_LIST, DISABLE_NAVIGATION, INCREMENT_COMPLETED_STEP,
  SET_PROCESS_ACTIONS_DISABLED, UPDATE_TEAM_LIST, ADD_TEAM, ALTER_TEAM, REMOVE_TEAM
} from "./constants";
import {IInternalState} from "./models";
import {InternalActions} from "./types";

export const initialState: IInternalState = {
  processingActionsDisabled: false,
  processList: [],
  navigationDisabled: false,
  completedStep: 0,
  teamList: []
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
      if (action.payload.completedStep > state.completedStep) {
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
    default:
      return state;
  }
};
export default reducer;