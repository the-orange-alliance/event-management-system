import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {CookiesProvider} from "react-cookie";
import App from './App';
import './index.css';
import {BrowserRouter} from "react-router-dom";

ReactDOM.render(
  <BrowserRouter>
    <CookiesProvider>
      <App/>
    </CookiesProvider>
  </BrowserRouter>,
  document.getElementById('root') as HTMLElement
);