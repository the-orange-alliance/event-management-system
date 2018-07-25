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

const {ipcRenderer} = (window as any).require("electron");

(window as any).eval = global.eval = () => {
  throw new Error("This app does not support window.eval().")
};

console.log("Preloading application state...");

CONFIG_STORE.getAll().then((configStore: any) => {

  const configState: IConfigState = Config.initialState;

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

  const applicationStore = createStore(reducers, {
    configState: configState
  });

  console.log("Preloaded application state.");
  ipcRenderer.send("preload-finish");
  ReactDOM.render(
    <Provider store={applicationStore}>
      <App />
    </Provider>,
    document.getElementById('root') as HTMLElement
  );
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