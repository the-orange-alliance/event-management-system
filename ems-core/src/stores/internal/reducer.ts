import {Reducer} from "redux";
import {UPDATE_PROCESS_LIST, DISABLE_NAVIGATION, INCREMENT_COMPLETED_STEP} from "./constants";
import {IInternalState} from "./models";
import {InternalActions} from "./types";
import Process from "../../shared/models/Process";

const testProcess1 = new Process();
testProcess1.name = "EMS WEB";
testProcess1.address = "127.0.0.1:80";
testProcess1.id = 0;
testProcess1.pid = 1234;
testProcess1.status = "ONLINE";
testProcess1.cpu = 12349873;
testProcess1.mem = 123498;

const testProcess2 = new Process();
testProcess2.name = "EMS API";
testProcess2.address = "127.0.0.1:8008";
testProcess2.id = 1;
testProcess2.pid = 3498;
testProcess2.status = "STOPPED";
testProcess2.cpu = 12349873;
testProcess2.mem = 123498;

const testProcess3 = new Process();
testProcess3.name = "EMS SCK";
testProcess3.address = "127.0.0.1:8080";
testProcess3.id = 2;
testProcess3.pid = 9835;
testProcess3.status = "WAITING...";
testProcess3.cpu = 12349873;
testProcess3.mem = 123498;

export const initialState: IInternalState = {
  processList: [testProcess1, testProcess2, testProcess3],
  navigationDisabled: false,
  completedStep: 0
};

const reducer: Reducer<IInternalState> = (state: IInternalState = initialState, action) => {
  switch ((action as InternalActions).type) {
    case UPDATE_PROCESS_LIST:
      return {...state, processList: action.payload.processList};
    case DISABLE_NAVIGATION:
      return {...state, navigationDisabled: action.payload.navigationDisabled};
    case INCREMENT_COMPLETED_STEP:
      return {...state, completedStep: action.payload.completedStep};
    default:
      return state;
  }
};
export default reducer;