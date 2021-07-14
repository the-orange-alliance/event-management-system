import React from "react";
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'semantic-ui-css/semantic.min.css'

// Do not remove this line!
// @eslint-ignore-next-line
if (false) (React.Children as any);

ReactDOM.render(
    <App />,
  document.getElementById('root') as HTMLElement
);
