import {Process, Team, Match, AllianceMember} from "@the-orange-alliance/lib-ems";

export interface IInternalState {
  processingActionsDisabled: boolean,
  processList: Process[]
  navigationDisabled: boolean,
  completedStep: number,
  teamList: Team[],
  practiceMatches: Match[],
  qualificationMatches: Match[],
  finalsMatches: Match[],
  eliminationsMatches: Match[],
  allianceMembers: AllianceMember[]
  socketConnected: boolean
}