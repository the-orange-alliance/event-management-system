import * as React from "react";
import {Button, Card, Dropdown, DropdownProps, Grid} from "semantic-ui-react";
import {getTheme} from "../AppTheme";
import {TeamIdentifierItems} from "../shared/data/DropdownItemOptions";
import {ISetEventConfiguration} from "../stores/config/types";
import {SyntheticEvent} from "react";
import {ApplicationActions, IApplicationState} from "../stores";
import {Dispatch} from "redux";
import {setEventConfiguration} from "../stores/config/actions";
import {connect} from "react-redux";
import {TeamIdentifier} from "../shared/AppTypes";
import ConfirmActionModal from "./ConfirmActionModal";
import {CONFIG_STORE} from "../AppStore";
import DialogManager from "../managers/DialogManager";
import {AppError, Event, EventConfiguration} from "@the-orange-alliance/lib-ems";

interface IProps {
  event?: Event,
  eventConfig?: EventConfiguration,
  setEventConfig?: (config: EventConfiguration) => ISetEventConfiguration
}

interface IState {
  configCopy: EventConfiguration,
  confirmModalOpen: boolean
}

class SettingsEvent extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      configCopy: new EventConfiguration().fromJSON(this.props.eventConfig.toJSON()),
      confirmModalOpen: false
    };
    this.openConfirmModal = this.openConfirmModal.bind(this);
    this.closeConfirmModal = this.closeConfirmModal.bind(this);
    this.setTeamIdentifier = this.setTeamIdentifier.bind(this);
    this.setFieldsControlled = this.setFieldsControlled.bind(this);
    this.updateConfig = this.updateConfig.bind(this);
  }

  public render() {
    const {confirmModalOpen} = this.state;
    const fields = this.props.event.fieldCount || 0;
    const fieldOptions = [];
    for (let i = 0; i < fields; i++) {
      fieldOptions.push({text: "Field " + (i + 1), value: i + 1});
    }

    return (
      <Card fluid={true} color={getTheme().secondary}>
        <ConfirmActionModal open={confirmModalOpen} onClose={this.closeConfirmModal} onConfirm={this.updateConfig} innerText={"Are you sure you want to update the event configuration?"}/>
        <Card.Content className="card-header"><h3>Event Configuration</h3></Card.Content>
        <Card.Content>
          <Grid>
            <Grid.Row columns={16}>
              <Grid.Column width={4} className="center-left-items"><span>Field Control</span></Grid.Column>
              <Grid.Column width={12}>
                <Dropdown
                  fluid={true}
                  selection={true}
                  multiple={true}
                  value={this.state.configCopy.fieldsControlled}
                  options={fieldOptions}
                  onChange={this.setFieldsControlled}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={16}>
              <Grid.Column width={4} className="center-left-items"><span>Team Identifier</span></Grid.Column>
              <Grid.Column width={12}>
                <Dropdown
                  fluid={true}
                  selection={true}
                  value={this.state.configCopy.teamIdentifier}
                  options={TeamIdentifierItems}
                  onChange={this.setTeamIdentifier}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row width={16} centered={true}>
              <Grid.Column width={6}><Button fluid={true} color={getTheme().primary} onClick={this.openConfirmModal}>Save &amps; Update</Button></Grid.Column>
            </Grid.Row>
          </Grid>
        </Card.Content>
      </Card>
    );
  }

  private openConfirmModal() {
    this.setState({confirmModalOpen: true});
  }

  private closeConfirmModal() {
    this.setState({confirmModalOpen: false});
  }

  private setTeamIdentifier(event: SyntheticEvent, props: DropdownProps) {
    this.state.configCopy.teamIdentifier = props.value as TeamIdentifier;
    this.forceUpdate();
  }

  private setFieldsControlled(event: SyntheticEvent, props: DropdownProps) {
    if ((props.value as number[]).length > 0) {
      this.state.configCopy.fieldsControlled = (props.value as number[]).sort();
      this.forceUpdate();
    }
  }

  private updateConfig() {
    this.closeConfirmModal();
    this.props.setEventConfig(this.state.configCopy);
    CONFIG_STORE.set("eventConfig", this.state.configCopy.toJSON()).then((data: any) => {
      console.log(data);
    }).catch((error: AppError) => {
      DialogManager.showErrorBox(error);
    });
  }
}

function mapStateToProps({configState}: IApplicationState) {
  return {
    eventConfig: configState.eventConfiguration,
    event: configState.event
  };
}

function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setEventConfig: (config: EventConfiguration) => dispatch(setEventConfiguration(config))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsEvent);