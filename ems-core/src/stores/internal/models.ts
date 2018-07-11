import Process from "../../shared/models/Process";

export interface IInternalState {
  processList: Process[]
  navigationDisabled: boolean,
  completedStep: number
}