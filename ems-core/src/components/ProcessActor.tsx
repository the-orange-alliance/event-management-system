import * as React from "react";
import {Button, Grid} from "semantic-ui-react";
import {IDisableNavigation, ISetProcessActionsDisabled, IUpdateProcessList} from "../stores/internal/types";
import {ApplicationActions, IApplicationState} from "../stores";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {disableNavigation, setProcessActionsDisabled, updateProcessList} from "../stores/internal/actions";
import ProcessManager from "../managers/ProcessManager";
import {AppError, Process} from "@the-orange-alliance/lib-ems";

interface IProps {
  process: Process,
  actionsDisabled?: boolean,
  setNavigationDisabled?: (disabled: boolean) => IDisableNavigation
  setActionsDisabled?: (disabled: boolean) => ISetProcessActionsDisabled,
  updateProcessList?: (procList: Process[]) => IUpdateProcessList
}

class ProcessActor extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.restartProcess = this.restartProcess.bind(this);
    this.stopProcess = this.stopProcess.bind(this);
    this.startProcess = this.startProcess.bind(this);
  }

  public render() {
    const {process, actionsDisabled} = this.props;
    return (
      <Grid>
        <Grid.Row columns="equal">
          <Grid.Column className="bold center-items">{process.name || ""}</Grid.Column>
          <Grid.Column><Button fluid={true} loading={actionsDisabled} color="orange" onClick={this.restartProcess}>Restart</Button></Grid.Column>
          <Grid.Column><Button fluid={true} loading={actionsDisabled} color="red" onClick={this.stopProcess}>Stop</Button></Grid.Column>
          <Grid.Column><Button fluid={true} loading={actionsDisabled} color="green" onClick={this.restartProcess}>Start</Button></Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  private restartProcess() {
    this.disableNavigation();
    ProcessManager.restartProcess(this.props.process).then(() => {
      setTimeout(() => {
        ProcessManager.listEcosystem().then((procList: Process[]) => {
          this.props.updateProcessList(procList);
          this.enableNavigation();
        }).catch((error: AppError) => {
          this.enableNavigation();
          console.log(error); // TODO - Error dialog
        });
      },1000);
    }).catch((error: AppError) => {
      console.log(error); // TODO - Error dialog
      this.enableNavigation();
    });
  }

  private stopProcess() {
    this.disableNavigation();
    ProcessManager.stopProcess(this.props.process).then(() => {
      setTimeout(() => {
        ProcessManager.listEcosystem().then((procList: Process[]) => {
          this.props.updateProcessList(procList);
          this.enableNavigation();
        }).catch((error: AppError) => {
          this.enableNavigation();
          console.log(error); // TODO - Error dialog
        });
      }, 1000);
    }).catch((error: AppError) => {
      console.log(error); // TODO - Error dialog
      this.enableNavigation();
    });
  }

  private startProcess() {
    this.disableNavigation();
    ProcessManager.startProcess(this.props.process).then(() => {
      setTimeout(() => {
        ProcessManager.listEcosystem().then((procList: Process[]) => {
          this.props.updateProcessList(procList);
          this.enableNavigation();
        }).catch((error: AppError) => {
          this.enableNavigation();
          console.log(error); // TODO - Error dialog
        });
      }, 1000);
    }).catch((error: AppError) => {
      console.log(error); // TODO - Error dialog
      this.enableNavigation();
    });
  }

  private disableNavigation(): void {
    this.props.setActionsDisabled(true);
    this.props.setNavigationDisabled(true);
  }

  private enableNavigation(): void {
    this.props.setActionsDisabled(false);
    this.props.setNavigationDisabled(false);
  }

}

export function mapStateToProps({internalState}: IApplicationState) {
  return {
    actionsDisabled: internalState.processingActionsDisabled
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setActionsDisabled: (disabled: boolean) => dispatch(setProcessActionsDisabled(disabled)),
    setNavigationDisabled: (disabled: boolean) => dispatch(disableNavigation(disabled)),
    updateProcessList: (procList: Process[]) => dispatch(updateProcessList(procList))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProcessActor);