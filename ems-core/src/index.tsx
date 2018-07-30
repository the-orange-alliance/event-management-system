import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import App from './App';
import './index.css';
import 'react-datepicker/dist/react-datepicker.css';
import {reducers} from "./stores";
import {createStore} from "redux";
import {CONFIG_STORE} from "./shared/AppStore";
import AppError from "./shared/models/AppError";
import {IConfigState} from "./stores/config/models";
import * as Config from "./stores/config/reducer";
import * as Internal from "./stores/internal/reducer";
import Process from "./shared/models/Process";
import ProcessManager from "./shared/managers/ProcessManager";
import {IInternalState} from "./stores/internal/models";
import DialogManager from "./shared/managers/DialogManager";

const {ipcRenderer} = (window as any).require("electron");

(window as any).eval = global.eval = () => {
  throw new Error("This app does not support window.eval().")
};

console.log("Preloading application state...");

ProcessManager.performStartupCheck().then((procList: Process[]) => {
  const internalState: IInternalState = Internal.initialState;
  internalState.processList = procList;

  CONFIG_STORE.getAll().then((configStore: any) => {

    const configState: IConfigState = Config.initialState;

    configState.networkHost = procList[0].address;

    if (typeof configStore.event !== "undefined" && typeof configStore.eventConfig !== "undefined") {
      configState.event = configState.event.fromJSON(configStore.event);
      configState.eventConfiguration = configState.eventConfiguration.fromJSON(configStore.eventConfig);
    }

    if (typeof configStore.schedule !== "undefined") {
      if (typeof configStore.schedule.Practice !== "undefined") {
        configState.practiceSchedule = configState.practiceSchedule.fromJSON(configStore.schedule.Practice);
      }
      if (typeof configStore.schedule.Qualification !== "undefined") {
        configState.qualificationSchedule = configState.qualificationSchedule.fromJSON(configStore.schedule.Qualification);
      }
    }

    if (typeof configStore.matchConfig !== "undefined") {
      configState.matchConfig = configState.matchConfig.fromJSON(configStore.matchConfig);
    }

    const applicationStore = createStore(reducers, {
      configState: configState,
      internalState: internalState
    });

    // The microservices aren't 100% ready when the application loads, so we give it some time here.
    setTimeout(() => {
      console.log("Preloaded application state.");
      ipcRenderer.send("preload-finish");
      ReactDOM.render(
        <Provider store={applicationStore}>
          <App />
        </Provider>,
        document.getElementById('root') as HTMLElement
      );
    }, 0); // For development, get rid of this, BUT production NEEDS this delay!
  }).catch((error: AppError) => {
    console.log(error);
    const applicationStore = createStore(reducers);
    ipcRenderer.send("preload-finish");
    ReactDOM.render(
      <Provider store={applicationStore}>
        <App />
      </Provider>,
      document.getElementById('root') as HTMLElement
    );
  });

}).catch((error: AppError) => {
  DialogManager.showErrorBox(error);
});