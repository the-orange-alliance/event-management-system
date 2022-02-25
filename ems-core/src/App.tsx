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

import {
  EMSProvider, SocketProvider, WebProvider, MatchConfiguration,
  AllianceMember, UploadConfig
} from "@the-orange-alliance/lib-ems";
import UploadManager from "./managers/UploadManager";
import LoginContainer from "./LoginContainer";
import {Dimmer, Loader} from 'semantic-ui-react';

interface IProps {
  slaveModeEnabled: boolean,
  masterHost: string,
  networkHost: string,
  uploadConfig: UploadConfig,
  matchTimerConfig: MatchConfiguration,
  setSocketConnected?: (connected: boolean) => ISetSocketConnected,
  loggedIn?: boolean,
  uploadType?: number,
}
interface IState {
  loading: boolean
}

class App extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      loading: true
    }
  }

  public componentDidMount() {
    UploadManager.initialize(this.props.uploadType, this.props.uploadConfig);

    WebProvider.initialize(this.props.networkHost);
    if (this.props.slaveModeEnabled) {
      document.title = "Event Management System (Slave to " + this.props.masterHost + ")";
      EMSProvider.initialize(this.props.masterHost);
      this.initializeSocket(this.props.masterHost);
    } else {
      document.title = "Event Management System";
      EMSProvider.initialize(this.props.networkHost);
      this.initializeSocket(this.props.networkHost);
    }

    this.setState({loading: false});
  }

  public render() {
    return (
      <>
        {this.props.loggedIn && !this.state.loading && <AppContainer/>}
        {!this.props.loggedIn && !this.state.loading && <LoginContainer/>}
        {this.state.loading && <>
          <Dimmer active inverted>
              <Loader size={"massive"}>Loading EMS...</Loader>
          </Dimmer>
        </>}
      </>
    );
  }

  private initializeSocket(host: string) {
    SocketProvider.initialize(host, EMSProvider);
    SocketProvider.on("connect", () => {
      SocketProvider.emit("identify", "ems-core", ["scoring", "event", "fms"]);
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
    uploadConfig: state.configState.uploadConfig,
    uploadType: state.configState.eventConfiguration.uploadType,
    loggedIn: state.internalState.loggedIn,
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
