import {Action} from "redux";
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
  SET_FINALS_MATCHES,
  SET_ELIMINATIONS_MATCHES,
  SET_ALLIANCE_MEMBERS, SET_TEST_MATCHES
} from "./constants";
import {Process, Team, Match, AllianceMember} from "@the-orange-alliance/lib-ems";

export interface IUpdateProcessList extends Action {
  type: UPDATE_PROCESS_LIST,
  payload: {
    processList: Process[]
  }
}

export interface ISetProcessActionsDisabled extends Action {
  type: SET_PROCESS_ACTIONS_DISABLED,
  payload: {
    processingActionsDisabled: boolean
  }
}

export interface IDisableNavigation extends Action {
  type: DISABLE_NAVIGATION,
  payload: {
    navigationDisabled: boolean
  }
}

export interface IIncrementCompletedStep extends Action {
  type: INCREMENT_COMPLETED_STEP,
  payload: {
    completedStep: number
  }
}

export interface IUpdateTeamList extends Action {
  type: UPDATE_TEAM_LIST,
  payload: {
    teamList: Team[]
  }
}

export interface IAddTeam extends Action {
  type: ADD_TEAM,
  payload: {
    team: Team
  }
}

export interface IAlterTeam extends Action {
  type: ALTER_TEAM,
  payload: {
    index: number,
    team: Team
  }
}

export interface IRemoveTeam extends Action {
  type: REMOVE_TEAM,
  payload: {
    index: number
  }
}

export interface ISetTestMatches extends Action {
  type: SET_TEST_MATCHES,
  payload: {
    matches: Match[]
  }
}

export interface ISetPracticeMatches extends Action {
  type: SET_PRACTICE_MATCHES,
  payload: {
    matches: Match[]
  }
}

export interface ISetQualificationMatches extends Action {
  type: SET_QUALIFICATION_MATCHES,
  payload: {
    matches: Match[]
  }
}

export interface ISetFinalsMatches extends Action {
  type: SET_FINALS_MATCHES,
  payload: {
    matches: Match[]
  }
}

export interface ISetEliminationsMatches extends Action {
  type: SET_ELIMINATIONS_MATCHES,
  payload: {
    matches: Match[]
  }
}

export interface ISetAllianceMembers extends Action {
  type: SET_ALLIANCE_MEMBERS,
  payload: {
    members: AllianceMember[]
  }
}

export interface ISetSocketConnected extends Action {
  type: SET_SOCKET_CONNECTED,
  payload: {
    connected: boolean
  }
}

export type InternalActions = ISetProcessActionsDisabled | IUpdateProcessList | IDisableNavigation |
  IIncrementCompletedStep | IUpdateTeamList | IAddTeam | IAlterTeam | IRemoveTeam | ISetTestMatches | ISetPracticeMatches |
  ISetFinalsMatches | ISetQualificationMatches | ISetEliminationsMatches | ISetSocketConnected | ISetAllianceMembers;