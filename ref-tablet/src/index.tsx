import * as React from 'react';
import {CookiesProvider} from "react-cookie";
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {HashRouter} from "react-router-dom";

ReactDOM.render(
  <CookiesProvider>
    <HashRouter>
      // tslint:disable-next-line
      <App />
    </HashRouter>
  </CookiesProvider>,
  document.getElementById('root') as HTMLElement
);