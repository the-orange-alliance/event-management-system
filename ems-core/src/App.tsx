import * as React from 'react';
import './App.css';
import AppContainer from "./components/AppContainer";
import {ApplicationActions, IApplicationState} from "./stores";
import {ISetSocketConnected} from "./stores/internal/types";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {
  incrementCompletedStep, setAllianceMembers, setSocketConnected,
} from "./stores/internal/actions";

import {EMSProvider, SocketProvider, WebProvider, TOAConfig, MatchConfiguration,
AllianceMember} from "@the-orange-alliance/lib-ems";
import UploadManager from "./managers/UploadManager";

interface IProps {
  slaveModeEnabled: boolean,
  masterHost: string,
  networkHost: string,
  toaConfig: TOAConfig,
  matchTimerConfig: MatchConfiguration,
  setSocketConnected?: (connected: boolean) => ISetSocketConnected
}

class App extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public componentDidMount() {
    UploadManager.initialize(1, this.props.toaConfig);

    this.initializeSocket(this.props.networkHost);
    WebProvider.initialize(this.props.networkHost);
    if (this.props.slaveModeEnabled) {
      document.title = "Event Management System (Slave to " + this.props.masterHost + ")";
      EMSProvider.initialize(this.props.masterHost);
    } else {
      document.title = "Event Management System";
      EMSProvider.initialize(this.props.networkHost);
    }
  }

  public render() {
    return (
      <AppContainer/>
    );
  }

  private initializeSocket(host: string) {
    SocketProvider.initialize('localhost');
    SocketProvider.on("connect", () => {
      SocketProvider.emit("identify", "ems-core", ["scoring", "event", "ds"]);
      this.props.setSocketConnected(true);
      if (this.props.slaveModeEnabled) {
        setTimeout(() => {
          SocketProvider.emit("enter-slave", this.props.masterHost);
        }, 250);
      }
    });
    SocketProvider.on("disconnect", () => {
      this.props.setSocketConnected(false);
    });
  }
}

export function mapStateToProps(state: IApplicationState) {
  return {
    slaveModeEnabled: state.configState.slaveModeEnabled,
    masterHost: state.configState.masterHost,
    networkHost: state.configState.networkHost,
    matchTimerConfig: state.configState.matchConfig,
    toaConfig: state.configState.toaConfig
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setCompletedStep: (step: number) => dispatch(incrementCompletedStep(step)),
    setAllianceMembers: (members: AllianceMember[]) => dispatch(setAllianceMembers(members)),
    setSocketConnected: (connected: boolean) => dispatch(setSocketConnected(connected))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
