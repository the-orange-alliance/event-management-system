import * as React from 'react';
import './App.css';
import AppContainer from "./components/AppContainer";
import {ApplicationActions, IApplicationState} from "./stores";
import {IDisableNavigation} from "./stores/internal/types";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import ProcessManager from "./shared/managers/ProcessManager";
import Process from "./shared/models/Process";

interface IProps {
  toggleNavigation?: (navigationDisabled: boolean) => IDisableNavigation
}

class App extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public componentDidMount() {
    ProcessManager.startEcosystem().then((procList: Process[]) => {
      console.log("Here!");
    });
  }

  public render() {
    return (
      <AppContainer/>
    );
  }
}

export function mapStateToProps(state: IApplicationState) {
  return {};
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
