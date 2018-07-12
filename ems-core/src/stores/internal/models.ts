import Process from "../../shared/models/Process";

export interface IInternalState {
  processingActionsDisabled: boolean,
  processList: Process[]
  navigationDisabled: boolean,
  completedStep: number
}