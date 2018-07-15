import * as React from 'react';
import './App.css';
import AppContainer from "./components/AppContainer";
import {ApplicationActions, IApplicationState} from "./stores";
import {IUpdateProcessList} from "./stores/internal/types";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import ProcessManager from "./shared/managers/ProcessManager";
import Process from "./shared/models/Process";
import {updateProcessList} from "./stores/internal/actions";
import {ISetNetworkHost} from "./stores/config/types";
import {setNetworkHost} from "./stores/config/actions";
import EMSProvider from "./shared/providers/EMSProvider";

interface IProps {
  setProcessList?: (procList: Process[]) => IUpdateProcessList,
  setNetworkHost?: (host: string) => ISetNetworkHost
}

class App extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public componentDidMount() {
    ProcessManager.performStartupCheck().then((procList: Process[]) => {
      const networkHost = procList[0].address;
      this.props.setNetworkHost(networkHost);
      this.props.setProcessList(procList);

      EMSProvider.initialize(networkHost);
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
    setProcessList: (procList: Process[]) => dispatch(updateProcessList(procList)),
    setNetworkHost: (host: string) => dispatch(setNetworkHost(host))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
