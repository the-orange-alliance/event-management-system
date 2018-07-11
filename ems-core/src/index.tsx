import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import App from './App';
import './index.css';
import {reducers} from "./stores";
import {createStore} from "redux";

const {ipcRenderer} = (window as any).require("electron");

(window as any).eval = global.eval = () => {
  throw new Error("This app does not support window.eval().")
};

console.log("Preloading application state...");

ipcRenderer.on("preload-finished", () => {
  const applicationStore = createStore(reducers);
  console.log("Preloaded application state.");
  ReactDOM.render(
    <Provider store={applicationStore}>
      <App />
    </Provider>,
    document.getElementById('root') as HTMLElement
  );
});
ipcRenderer.send("preload");