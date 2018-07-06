import * as React from 'react';
import './App.css';

import AppContainer from "./components/AppContainer";

class App extends React.Component {
  public render() {
    return (
      <AppContainer limitedMode={false} slaveMode={false} navigationDisabled={false} />
    );
  }
}

export default App;
