// import React from "react";
import {CookiesProvider} from "react-cookie";
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

ReactDOM.render(
  <CookiesProvider>
    {/* @ts-ignore */}
    <App />
  </CookiesProvider>,
  document.getElementById('root') as HTMLElement
);
