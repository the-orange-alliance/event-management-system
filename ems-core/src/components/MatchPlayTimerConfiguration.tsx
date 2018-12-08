import * as React from "react";
import {Button, Form, Grid, InputProps} from "semantic-ui-react";
import {getTheme} from "../shared/AppTheme";
import MatchConfiguration from "../shared/models/MatchConfiguration";
import {ISetMatchConfig} from "../stores/config/types";
import {SyntheticEvent} from "react";
import {CONFIG_STORE} from "../shared/AppStore";
import AppError from "../shared/models/AppError";
import DialogManager from "../shared/managers/DialogManager";
import {ApplicationActions, IApplicationState} from "../stores";
import {Dispatch} from "redux";
import {setMatchConfig} from "../stores/config/actions";
import {connect} from "react-redux";
import RestrictedAccessModal from "./RestrictedAccessModal";
import SocketProvider from "../shared/providers/SocketProvider";

interface IProps {
  matchConfig?: MatchConfiguration,
  setMatchConfig?: (matchConfig: MatchConfiguration) => ISetMatchConfig
}

interface IState {
  configCopy?: MatchConfiguration,
  modalOpen: boolean
}

class MatchPlayTimerConfiguration extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      configCopy: new MatchConfiguration().fromJSON(this.props.matchConfig.toJSON()),
      modalOpen: false
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.updateDelayTime = this.updateDelayTime.bind(this);
    this.updateAutoTime = this.updateAutoTime.bind(this);
    this.updateTeleTime = this.updateTeleTime.bind(this);
    this.updateEndTime = this.updateEndTime.bind(this);
    this.updateConfig = this.updateConfig.bind(this);
  }

  public render() {
    const {configCopy, modalOpen} = this.state;
    return (
      <Grid columns={16}>
        <RestrictedAccessModal open={modalOpen} onClose={this.closeModal} onSuccess={this.updateConfig}/>
        <Grid.Row>
          <Grid.Column computer={8} largeScreen={4} widescreen={4}><Form.Input label="Start Delay" value={configCopy.delayTime} onChange={this.updateDelayTime}/></Grid.Column>
          <Grid.Column computer={8} largeScreen={4} widescreen={4}><Form.Input label="Autonomous" value={configCopy.autoTime} onChange={this.updateAutoTime}/></Grid.Column>
          <Grid.Column computer={8} largeScreen={4} widescreen={4}><Form.Input label="Teleop" value={configCopy.teleTime} onChange={this.updateTeleTime}/></Grid.Column>
          <Grid.Column computer={8} largeScreen={4} widescreen={4}><Form.Input label="End Game" value={configCopy.endTime} onChange={this.updateEndTime}/></Grid.Column>
        </Grid.Row>
        <Grid.Row centered={true}>
          <Grid.Column width={8}><Button fluid={true} color={getTheme().secondary} onClick={this.openModal}>Update Time Config</Button></Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  private openModal() {
    this.setState({modalOpen: true});
  }

  private closeModal() {
    this.setState({modalOpen: false});
  }

  private updateDelayTime(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value)) {
      this.state.configCopy.delayTime = parseInt(props.value, 10) || 0;
      this.forceUpdate();
    }
  }

  private updateAutoTime(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value)) {
      this.state.configCopy.autoTime = parseInt(props.value, 10) || 0;
      this.forceUpdate();
    }
  }

  private updateTeleTime(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value)) {
      this.state.configCopy.teleTime = parseInt(props.value, 10) || 0;
      this.forceUpdate();
    }
  }

  private updateEndTime(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value)) {
      this.state.configCopy.endTime = parseInt(props.value, 10) || 0;
      this.forceUpdate();
    }
  }

  private updateConfig() {
    this.closeModal();
    this.props.setMatchConfig(new MatchConfiguration().fromJSON(this.state.configCopy));
    SocketProvider.emit("update-timer", this.state.configCopy.toJSON());
    CONFIG_STORE.set("matchConfig", this.state.configCopy.toJSON()).catch((error: AppError) => {
      DialogManager.showErrorBox(error);
    });
  }
}

export function mapStateToProps({configState}: IApplicationState) {
  return {
    matchConfig: configState.matchConfig
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setMatchConfig: (matchConfig: MatchConfiguration) => dispatch(setMatchConfig(matchConfig))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchPlayTimerConfiguration);