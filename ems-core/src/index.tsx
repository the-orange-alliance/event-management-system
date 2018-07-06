import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import App from './App';
import './index.css';
import {applicationStore} from "./stores";

ReactDOM.render(
  <Provider store={applicationStore}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
