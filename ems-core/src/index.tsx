import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import App from './App';
import './index.css';
import 'react-datepicker/dist/react-datepicker.css';
import {reducers} from "./stores";
import {createStore} from "redux";
import {CONFIG_STORE} from "./AppStore";
import * as Config from "./stores/config/reducer";
import * as Internal from "./stores/internal/reducer";
import {initialState} from "./stores/scoring/reducer";
// import {IInternalState} from "./stores/internal/models";
import ProcessManager from "./managers/ProcessManager";
import DialogManager from "./managers/DialogManager";
import {AppError, EliminationsSchedule, EMSProvider, Process, RoundRobinSchedule} from "@the-orange-alliance/lib-ems";
import InternalStateManager, {IInternalProgress} from "./managers/InternalStateManager";
import Schedule from "@the-orange-alliance/lib-ems/dist/models/ems/Schedule";

import { ipcRenderer } from 'electron'

console.log("Preloading application state...");

ProcessManager.performStartupCheck().then((procList: Process[]) => {
  const internalState = Internal.initialState;
  internalState.processList = procList;

  CONFIG_STORE.createIfNotExists();
  CONFIG_STORE.getAll().then((configStore: any) => {

    const configState = Config.initialState;

    configState.networkHost = procList[0].address;
    if (typeof configStore.event !== "undefined" && typeof configStore.eventConfig !== "undefined") {
      configState.event = configState.event.fromJSON(configStore.event);
      configState.eventConfiguration = configState.eventConfiguration.fromJSON(configStore.eventConfig);
    }

    if (typeof configStore.apiKey !== "undefined") {
      configState.apiKey = configStore.apiKey;
    }

    if (typeof configStore.schedule !== "undefined") {
      if (typeof configStore.schedule.Practice !== "undefined") {
        configState.practiceSchedule = configState.practiceSchedule.fromJSON(configStore.schedule.Practice);
      }
      if (typeof configStore.schedule.Qualification !== "undefined") {
        configState.qualificationSchedule = configState.qualificationSchedule.fromJSON(configStore.schedule.Qualification);
      }
      if (typeof configStore.schedule.Playoffs !== "undefined" && Array.isArray(configStore.schedule.Playoffs)) {
        configState.playoffsSchedule = configStore.schedule.Playoffs.map((scheduleJSON: any) => {
          switch (scheduleJSON.type) {
            case "Round Robin":
              return new RoundRobinSchedule().fromJSON(scheduleJSON);
            case "Eliminations":
              return new EliminationsSchedule().fromJSON(scheduleJSON);
            default:
              return new Schedule("Ranking").fromJSON(scheduleJSON);
          }
        });
      }
    }

    if (typeof configStore.matchConfig !== "undefined") {
      configState.matchConfig = configState.matchConfig.fromJSON(configStore.matchConfig);
    }

    if (typeof configStore.masterHost !== "undefined") {
      configState.slaveModeEnabled = true;
      configState.masterHost = configStore.masterHost;
    }

    if (typeof configStore.toaConfig !== "undefined") {
      configState.toaConfig = configState.toaConfig.fromJSON(configStore.toaConfig);
    }

    if (typeof configStore.backupDir !== "undefined") {
      configState.backupDir = configStore.backupDir;
    }

    console.log(configState.networkHost);
    if (configState.slaveModeEnabled) {
      EMSProvider.initialize(configState.masterHost);
    } else {
      EMSProvider.initialize(configState.networkHost);
    }

    InternalStateManager.pollServicesForResponse().then((res: any) => {
      InternalStateManager.refreshInternalProgress(configState.eventConfiguration, configState.apiKey).then((internalProgress: IInternalProgress) => {
        internalState.loggedIn = internalProgress.loggedIn;

        internalState.completedStep = internalProgress.currentStep;
        if (internalProgress.teams) {
          internalState.teamList = internalProgress.teams;
        }
        if (internalProgress.testMatches) {
          internalState.testMatches = internalProgress.testMatches;
        }
        if (internalProgress.practiceMatches) {
          internalState.practiceMatches = internalProgress.practiceMatches;
        }
        if (internalProgress.qualificationMatches) {
          internalState.qualificationMatches = internalProgress.qualificationMatches;
        }
        if (internalProgress.allianceMembers) {
          internalState.allianceMembers = internalProgress.allianceMembers;
        }
        if (internalProgress.playoffMatches) {
          internalState.playoffsMatches = internalProgress.playoffMatches;
        }
        const applicationStore = createStore(reducers, {
          configState: configState,
          internalState: internalState,
          scoringState: initialState
        });

        console.log("Preloaded application state.");
        ipcRenderer.send("preload-finish");
        ReactDOM.render(
          <Provider store={applicationStore}>
            <App />
          </Provider>,
          document.getElementById('root') as HTMLElement
        );
      });
    }).catch((reason: any) => {
      // TODO - Handle error dialog and application exit.
      console.log("Fatal error occurred. Please restart EMS entirely, or consider reinstalling.");
    });
  }).catch((error: AppError) => {
    console.log(error);
    const applicationStore = createStore(reducers);
    console.log("Could not load previous application config state. Resetting...");
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
