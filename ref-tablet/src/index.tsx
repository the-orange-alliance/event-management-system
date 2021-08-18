import * as React from 'react';
import {CookiesProvider} from "react-cookie";
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'semantic-ui-css/semantic.min.css'
import {HashRouter} from "react-router-dom";

ReactDOM.render(
  <CookiesProvider>
    <HashRouter>
      {/* @ts-ignore */}
      <App />
    </HashRouter>
  </CookiesProvider>,
  document.getElementById('root') as HTMLElement
);
