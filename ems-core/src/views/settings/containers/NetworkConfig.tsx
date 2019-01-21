import * as React from "react";
import {Button, Card, Dimmer, Divider, Form, Grid, InputProps, Loader, Tab} from "semantic-ui-react";
import {ApplicationActions, IApplicationState} from "../../../stores";
import {connect} from "react-redux";
import ProcessDescriptor from "../../../components/ProcessDescriptor";
import {getTheme} from "../../../AppTheme";
import ExplanationIcon from "../../../components/ExplanationIcon";
import ProcessActor from "../../../components/ProcessActor";
import {IDisableNavigation, ISetProcessActionsDisabled, IUpdateProcessList} from "../../../stores/internal/types";
import {Dispatch} from "redux";
import {disableNavigation, setProcessActionsDisabled, updateProcessList} from "../../../stores/internal/actions";
import ProcessManager from "../../../managers/ProcessManager";
import {SyntheticEvent} from "react";
import {ISetNetworkHost} from "../../../stores/config/types";
import {setNetworkHost} from "../../../stores/config/actions";
import RestrictedAccessModal from "../../../components/RestrictedAccessModal";
import DialogManager from "../../../managers/DialogManager";
import {AppError, EMSProvider, Process, SocketProvider, WebProvider} from "@the-orange-alliance/lib-ems";

interface IProps {
  processingAction?: boolean,
  processList?: Process[],
  updateProcessList?: (procList: Process[]) => IUpdateProcessList,
  setNetworkHost?: (networkHost: string) => ISetNetworkHost,
  setProcessActionsDisabled?: (disabled: boolean) => ISetProcessActionsDisabled,
  setNavigationDisabled?: (disabled: boolean) => IDisableNavigation
}

interface IState {
  updateIP: string,
  updateIPValid: boolean,
  networkModalOpen: boolean,
  processModalOpen: boolean,
  resetModalOpen: boolean,
}

const ipRegex = /\b(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\b/;

class NetworkConfig extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      updateIP: "",
      updateIPValid: false,
      networkModalOpen: false,
      processModalOpen: false,
      resetModalOpen: false,
    };

    this.setUpdateIP = this.setUpdateIP.bind(this);
    this.updateNetworkHost = this.updateNetworkHost.bind(this);
    this.resetNetworkHost = this.resetNetworkHost.bind(this);
    this.deleteProcesses = this.deleteProcesses.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openProcessModal = this.openProcessModal.bind(this);
    this.closeProcessModal = this.closeProcessModal.bind(this);
    this.openResetModal = this.openResetModal.bind(this);
    this.closeResetModal = this.closeResetModal.bind(this);
  }

  public componentWillMount() {
    ProcessManager.listEcosystem().then((procList: Process[]) => {
      this.props.updateProcessList(procList);
    });
  }

  public render() {
    const {updateIP, updateIPValid, networkModalOpen, processModalOpen, resetModalOpen} = this.state;
    const processes = this.props.processList.map(process => {
      return <ProcessDescriptor key={process.id} process={process}/>;
    });
    const processActions = this.props.processList.map(process => {
      return <ProcessActor key={process.id} process={process}/>;
    });
    return (
      <Tab.Pane className="tab-subview">
        <RestrictedAccessModal open={networkModalOpen} onClose={this.closeModal} onSuccess={this.updateNetworkHost}/>
        <RestrictedAccessModal open={processModalOpen} onClose={this.closeProcessModal} onSuccess={this.deleteProcesses}/>
        <RestrictedAccessModal open={resetModalOpen} onClose={this.closeResetModal} onSuccess={this.resetNetworkHost}/>
        <h3>Network Config</h3>
        <Divider />
        <Card fluid={true} color={getTheme().secondary}>
          <Card.Content><h3>Status</h3></Card.Content>
          <Card.Content>
            <Grid>
              <Grid.Row columns="equal" textAlign="center" className="bold">
                <Grid.Column>Name</Grid.Column>
                <Grid.Column>Address</Grid.Column>
                <Grid.Column>Status</Grid.Column>
                <Grid.Column>PID</Grid.Column>
                <Grid.Column>CPU Usage</Grid.Column>
                <Grid.Column>Memory Usage</Grid.Column>
              </Grid.Row>
              {processes}
            </Grid>
          </Card.Content>
        </Card>
        <Card.Group itemsPerRow={2}>
          <Card fluid={true} color={getTheme().secondary}>
            <Dimmer active={this.props.processingAction}>
              <Loader />
            </Dimmer>
            <Card.Content className="card-header"><h3>Network Management</h3></Card.Content>
            <Card.Content>
              <Form>
                <Grid columns={16}>
                  <Grid.Row>
                    <Grid.Column width={10}><Form.Input fluid={true} error={!updateIPValid} value={updateIP} onChange={this.setUpdateIP} placeholder="IPv4 Address (xxx.xxx.xxx.xxx)" label={<ExplanationIcon title={"New Host Address"} content={"If EMS incorrectly detects your IPv4 address, set it here then click 'Update Network'."}/>}/></Grid.Column>
                    <Grid.Column width={6} className="align-bottom"><Form.Button fluid={true} disabled={!updateIPValid} color="orange" onClick={this.openModal}>Update Network Address</Form.Button></Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width={6} floated="right"><Button fluid={true} color="red" onClick={this.openResetModal}>Reset Network Addresses</Button></Grid.Column>
                  </Grid.Row>
                </Grid>
              </Form>
            </Card.Content>
          </Card>
          <Card fluid={true} color={getTheme().secondary}>
            <Dimmer active={this.props.processingAction}>
              <Loader />
            </Dimmer>
            <Card.Content className="card-header"><h3>Process Management</h3></Card.Content>
            <Card.Content>
              {processActions}
              <Grid columns="equal">
                <Grid.Row>
                  <Grid.Column><Button fluid={true} color="red" onClick={this.openProcessModal}>Delete All (Restricted)</Button></Grid.Column>
                </Grid.Row>
              </Grid>
            </Card.Content>
          </Card>
        </Card.Group>
      </Tab.Pane>
    )
  }

  private setUpdateIP(event: SyntheticEvent, props: InputProps) {
    const validIP = props.value.toString().match(ipRegex) !== null;
    this.setState({updateIP: props.value, updateIPValid: validIP});
  }

  private updateNetworkHost() {
    this.updateNetworkAddress(this.state.updateIP);
  }

  private resetNetworkHost() {
    this.updateNetworkAddress();
  }

  private updateNetworkAddress(host?: string) {
    this.props.setNavigationDisabled(true);
    this.props.setProcessActionsDisabled(true);
    ProcessManager.startEcosystem(host).then(() => {
      ProcessManager.listEcosystem().then((procList: Process[]) => {
        const newHost: string = procList[0].address;
        EMSProvider.initialize(newHost);
        WebProvider.initialize(newHost);
        SocketProvider.initialize(newHost);
        this.props.updateProcessList(procList);
        this.props.setNetworkHost(newHost);
        this.props.setNavigationDisabled(false);
        this.props.setProcessActionsDisabled(false);
      }).catch((error: AppError) => {
        this.props.setNavigationDisabled(false);
        this.props.setProcessActionsDisabled(false);
        DialogManager.showErrorBox(error);
      });
    }).catch((error: AppError) => {
      this.props.setNavigationDisabled(false);
      this.props.setProcessActionsDisabled(false);
      DialogManager.showErrorBox(error);
    });
  }

  private deleteProcesses() {
    this.props.setNavigationDisabled(true);
    this.props.setProcessActionsDisabled(true);
    ProcessManager.killEcosystem().then(() => {
      ProcessManager.listEcosystem().then((procList: Process[]) => {
        this.props.updateProcessList(procList);
        this.props.setNavigationDisabled(false);
        this.props.setProcessActionsDisabled(false);
        DialogManager.showInfoBox("EMS", "All processes have been killed. Please restart EMS, or else the entire system will not function.");
      }).catch((error: AppError) => {
        this.props.setNavigationDisabled(false);
        this.props.setProcessActionsDisabled(false);
        DialogManager.showInfoBox("EMS", "All processes have been killed. Please restart EMS, or else the entire system will not function.");
      });
    }).catch((error: AppError) => {
      this.props.setNavigationDisabled(false);
      this.props.setProcessActionsDisabled(false);
      DialogManager.showErrorBox(error);
    });
  }

  private openModal() {
    this.setState({networkModalOpen: true});
  }

  private closeModal() {
    this.setState({networkModalOpen: false});
  }

  private openProcessModal() {
    this.setState({processModalOpen: true});
  }

  private closeProcessModal() {
    this.setState({processModalOpen: false});
  }

  private openResetModal() {
    this.setState({resetModalOpen: true});
  }

  private closeResetModal() {
    this.setState({resetModalOpen: false});
  }
}

export function mapStateToProps({internalState}: IApplicationState) {
  return {
    processingAction: internalState.processingActionsDisabled,
    processList: internalState.processList
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    updateProcessList: (procList: Process[]) => dispatch(updateProcessList(procList)),
    setNetworkHost: (networkHost: string) => dispatch(setNetworkHost(networkHost)),
    setNavigationDisabled: (disabled: boolean) => dispatch(disableNavigation(disabled)),
    setProcessActionsDisabled: (disabled: boolean) => dispatch(setProcessActionsDisabled(disabled))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NetworkConfig);