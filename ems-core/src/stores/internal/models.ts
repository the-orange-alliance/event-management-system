import Process from "../../shared/models/Process";
import Team from "../../shared/models/Team";
import Match from "../../shared/models/Match";
import AllianceMember from "../../shared/models/AllianceMember";

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