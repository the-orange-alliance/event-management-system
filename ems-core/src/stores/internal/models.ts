import {Process, Team, Match, AllianceMember} from "@the-orange-alliance/lib-ems";

export interface IInternalState {
  processingActionsDisabled: boolean,
  processList: Process[]
  navigationDisabled: boolean,
  completedStep: number,
  teamList: Team[],
  testMatches: Match[],
  practiceMatches: Match[],
  qualificationMatches: Match[],
  playoffsMatches: Match[],
  allianceMembers: AllianceMember[]
  socketConnected: boolean,
  loggedIn: boolean
}
