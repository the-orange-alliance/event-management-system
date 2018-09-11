import * as React from 'react';
import {CookiesProvider} from "react-cookie";
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import {HashRouter} from "react-router-dom";

ReactDOM.render(
  <CookiesProvider>
    <HashRouter>
      <App />
    </HashRouter>
  </CookiesProvider>,
  document.getElementById('root') as HTMLElement
);