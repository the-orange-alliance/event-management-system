import Process from "../../shared/models/Process";
import Team from "../../shared/models/Team";

export interface IInternalState {
  processingActionsDisabled: boolean,
  processList: Process[]
  navigationDisabled: boolean,
  completedStep: number,
  teamList: Team[]
}