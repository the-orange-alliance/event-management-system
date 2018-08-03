import {ActionCreator} from "redux";
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
  SET_ALLIANCE_MEMBERS
} from "./constants";
import {
  IUpdateProcessList,
  IDisableNavigation,
  IIncrementCompletedStep,
  ISetProcessActionsDisabled,
  IUpdateTeamList,
  IAddTeam,
  IAlterTeam,
  IRemoveTeam,
  ISetPracticeMatches,
  ISetQualificationMatches,
  ISetSocketConnected,
  ISetFinalsMatches, ISetEliminationsMatches, ISetAllianceMembers
} from "./types";
import Process from "../../shared/models/Process";
import Team from "../../shared/models/Team";
import Match from "../../shared/models/Match";
import AllianceMember from "../../shared/models/AllianceMember";

export const updateProcessList: ActionCreator<IUpdateProcessList> = (processList: Process[]) => ({
  type: UPDATE_PROCESS_LIST,
  payload: {
    processList: processList
  }
});

export const setProcessActionsDisabled: ActionCreator<ISetProcessActionsDisabled> = (disabled: boolean) => ({
  type: SET_PROCESS_ACTIONS_DISABLED,
  payload: {
    processingActionsDisabled: disabled
  }
});

export const disableNavigation: ActionCreator<IDisableNavigation> = (navigationDisabled: boolean) => ({
  type: DISABLE_NAVIGATION,
  payload: {
    navigationDisabled: navigationDisabled
  }
});

export const incrementCompletedStep: ActionCreator<IIncrementCompletedStep> = (completedStep: number) => ({
  type: INCREMENT_COMPLETED_STEP,
  payload: {
    completedStep: completedStep
  }
});

export const updateTeamList: ActionCreator<IUpdateTeamList> = (teamList: Team[]) => ({
  type: UPDATE_TEAM_LIST,
  payload: {
    teamList: teamList
  }
});

export const addTeam: ActionCreator<IAddTeam> = (team: Team) => ({
  type: ADD_TEAM,
  payload: {
    team: team
  }
});

export const alterTeam: ActionCreator<IAlterTeam> = (index: number, team: Team) => ({
  type: ALTER_TEAM,
  payload: {
    index: index,
    team: team
  }
});

export const removeTeam: ActionCreator<IRemoveTeam> = (index: number) => ({
  type: REMOVE_TEAM,
  payload: {
    index: index
  }
});

export const setPracticeMatches: ActionCreator<ISetPracticeMatches> = (matches: Match[]) => ({
  type: SET_PRACTICE_MATCHES,
  payload: {
    matches: matches
  }
});

export const setQualificationMatches: ActionCreator<ISetQualificationMatches> = (matches: Match[]) => ({
  type: SET_QUALIFICATION_MATCHES,
  payload: {
    matches: matches
  }
});

export const setFinalsMatches: ActionCreator<ISetFinalsMatches> = (matches: Match[]) => ({
  type: SET_FINALS_MATCHES,
  payload: {
    matches: matches
  }
});

export const setEliminationsMatches: ActionCreator<ISetEliminationsMatches> = (matches: Match[]) => ({
  type: SET_ELIMINATIONS_MATCHES,
  payload: {
    matches: matches
  }
});

export const setAllianceMembers: ActionCreator<ISetAllianceMembers> = (members: AllianceMember[]) => ({
  type: SET_ALLIANCE_MEMBERS,
  payload: {
    members: members
  }
});

export const setSocketConnected: ActionCreator<ISetSocketConnected> = (connected: boolean) => ({
  type: SET_SOCKET_CONNECTED,
  payload: {
    connected: connected
  }
});