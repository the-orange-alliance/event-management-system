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
import Event from "./shared/models/Event";
import EventConfiguration from "./shared/models/EventConfiguration";

const {ipcRenderer} = (window as any).require("electron");

(window as any).eval = global.eval = () => {
  throw new Error("This app does not support window.eval().")
};

console.log("Preloading application state...");

CONFIG_STORE.getAll().then((configStore: any) => {

  let applicationStore;

  if (typeof configStore.event === "undefined" || typeof configStore.eventConfig === "undefined") {
    applicationStore = createStore(reducers);
  } else {
    let event: Event = new Event();
    let config: EventConfiguration = new EventConfiguration();
    event = event.fromJSON(configStore.event);
    config = config.fromJSON(configStore.eventConfig);

    applicationStore = createStore(reducers, {
      configState: {
        event: event,
        eventConfiguration: config
      }
    });
  }

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