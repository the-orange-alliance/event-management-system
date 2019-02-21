import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import App from './App';
import './index.css';
import 'react-datepicker/dist/react-datepicker.css';
import {reducers} from "./stores";
import {createStore} from "redux";
import {CONFIG_STORE} from "./AppStore";
import {IConfigState} from "./stores/config/models";
import * as Config from "./stores/config/reducer";
import * as Internal from "./stores/internal/reducer";
import {IInternalState} from "./stores/internal/models";
import ProcessManager from "./managers/ProcessManager";
import DialogManager from "./managers/DialogManager";
import {AppError, EMSProvider, Event, Match, Process} from "@the-orange-alliance/lib-ems";
import Team from "@the-orange-alliance/lib-ems/dist/models/ems/Team";
import EventConfiguration from "@the-orange-alliance/lib-ems/dist/models/ems/EventConfiguration";
import AllianceMember from "@the-orange-alliance/lib-ems/dist/models/ems/AllianceMember";

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
      if (typeof configStore.schedule.Finals !== "undefined") {
        configState.finalsSchedule = configState.finalsSchedule.fromJSON(configStore.schedule.Finals);
      }
      if (typeof configStore.schedule.Eliminations !== "undefined") {
        configState.eliminationsSchedule = configState.eliminationsSchedule.fromJSON(configStore.schedule.Eliminations);
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

    const applicationStore = createStore(reducers, {
      configState: configState,
      internalState: internalState
    });

    // The microservices aren't 100% ready when the application loads, so we give it some time here.
    const time = process.env.NODE_ENV === "production" ? 4000 : 1000;
    setTimeout(() => {
      console.log("Preloaded application state.");
      ipcRenderer.send("preload-finish");
      ReactDOM.render(
        <Provider store={applicationStore}>
          <App />
        </Provider>,
        document.getElementById('root') as HTMLElement
      );
    }, time);
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

async function setCompletedStep(eventConfig: EventConfiguration, networkHost: string) {
  let completedStep: number = 0;

  EMSProvider.initialize(networkHost);
  const events: Event[] = await EMSProvider.getEvent();

  if (events.length === 0) {
    return completedStep;
  } else {
    completedStep++;
  }

  const teams: Team[] = await EMSProvider.getTeams();

  if (teams.length === 0) {
    return completedStep;
  } else {
    completedStep++;
  }

  const eventKey: string = events[0].eventKey;

  const pMatches: Match[] = await EMSProvider.getMatchesAndParticipants(eventKey + "-P");

  if (pMatches.length === 0) {
    return completedStep;
  } else {
    completedStep++;
  }

  const qMatches: Match[] = await EMSProvider.getMatchesAndParticipants(eventKey + "-Q");

  if (qMatches.length === 0) {
    return completedStep;
  } else {
    completedStep++;
  }

  const alliances: AllianceMember[] = await EMSProvider.getAlliances();

  if (alliances.length === 0 && eventConfig.playoffsConfig === "finals") {
    completedStep+=2;
  }

  const eMatches: Match[] = await EMSProvider.getMatchesAndParticipants(eventKey + "-E");

  if (eMatches.length === 0) {
    return completedStep;
  } else {
    completedStep++;
  }

  return completedStep;
}