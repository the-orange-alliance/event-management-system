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

interface IProps {
  setProcessList?: (procList: Process[]) => IUpdateProcessList
}

class App extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public componentDidMount() {
    // ProcessManager.startEcosystem().then((procList: Process[]) => {
    //   this.props.setProcessList(procList);
    // });
    ProcessManager.listEcosystem().then((procList: any) => {
      console.log(procList);
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
    setProcessList: (procList: Process[]) => dispatch(updateProcessList(procList))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
