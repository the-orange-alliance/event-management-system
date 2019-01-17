import * as React from "react";
import {Button, Card, Dropdown, DropdownProps, Grid} from "semantic-ui-react";
import {getTheme} from "../AppTheme";
import {ApplicationActions, IApplicationState} from "../stores";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {ISetEventConfiguration} from "../stores/config/types";
import {setEventConfiguration} from "../stores/config/actions";
import {SyntheticEvent} from "react";
import {EliminationsFormats, PostQualConfig} from "../shared/AppTypes";
import ConfirmActionModal from "./ConfirmActionModal";
import {CONFIG_STORE} from "../AppStore";
import DialogManager from "../managers/DialogManager";
import {IIncrementCompletedStep} from "../stores/internal/types";
import {incrementCompletedStep} from "../stores/internal/actions";
import {AppError, EventConfiguration, Team, DropdownData} from "@the-orange-alliance/lib-ems";

interface IProps {
  eventConfig?: EventConfiguration,
  setEventConfig?: (eventConfig: EventConfiguration) => ISetEventConfiguration,
  completedStep?: number,
  teamList?: Team[],
  setCompletedStep?: (step: number) => IIncrementCompletedStep
}

interface IState {
  configCopy: EventConfiguration,
  confirmModalOpen: boolean
}

class SettingsPostQual extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      configCopy: new EventConfiguration().fromJSON(this.props.eventConfig.toJSON()),
      confirmModalOpen: false
    };
    this.openConfirmModal = this.openConfirmModal.bind(this);
    this.closeConfirmModal = this.closeConfirmModal.bind(this);
    this.setPostQualConfig = this.setPostQualConfig.bind(this);
    this.setAllianceCaptainConfig = this.setAllianceCaptainConfig.bind(this);
    this.setElimsFormatConfig = this.setElimsFormatConfig.bind(this);
    this.setRankingCutoffConfig = this.setRankingCutoffConfig.bind(this);
    this.updateConfig = this.updateConfig.bind(this);
  }

  public render() {
    const {confirmModalOpen} = this.state;
    const rankingsOptions = this.props.teamList.map((team, index) => {
      return {
        text: index + 1,
        value: index + 1
      };
    });
    return (
      <Card fluid={true} color={getTheme().secondary}>
        <ConfirmActionModal open={confirmModalOpen} onClose={this.closeConfirmModal} onConfirm={this.updateConfig} innerText={"Are you sure you want to update this event's post-qualification config?"}/>
        <Card.Content className="card-header"><h3>Post-Qualification Configuration</h3></Card.Content>
        <Card.Content>
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column className="center-left-items">
                <span>Post-Qualification Type</span>
              </Grid.Column>
              <Grid.Column>
                <Dropdown
                  fluid={true}
                  selection={true}
                  value={this.state.configCopy.playoffsConfig}
                  options={DropdownData.PostQualItems}
                  onChange={this.setPostQualConfig}
                />
              </Grid.Column>
            </Grid.Row>
            {
              this.state.configCopy.playoffsConfig === "elims" &&
              <Grid.Row>
                <Grid.Column><span>Alliance Captains</span></Grid.Column>
                <Grid.Column><Dropdown fluid={true} selection={true} value={this.state.configCopy.allianceCaptains} options={DropdownData.AllianceCaptainItems} onChange={this.setAllianceCaptainConfig}/></Grid.Column>
              </Grid.Row>
            }
            {
              this.state.configCopy.playoffsConfig === "elims" &&
              <Grid.Row>
                <Grid.Column><span>Eliminations Format</span></Grid.Column>
                <Grid.Column><Dropdown fluid={true} selection={true} value={this.state.configCopy.elimsFormat} options={DropdownData.EliminationsFormatItems} onChange={this.setElimsFormatConfig}/></Grid.Column>
              </Grid.Row>
            }
            {
              this.state.configCopy.playoffsConfig === "finals" &&
              <Grid.Row>
                <Grid.Column><span>Ranking Cutoff</span></Grid.Column>
                <Grid.Column><Dropdown fluid={true} selection={true} value={this.state.configCopy.rankingCutoff} options={rankingsOptions} onChange={this.setRankingCutoffConfig}/></Grid.Column>
              </Grid.Row>
            }
            <Grid.Row width={16} centered={true}>
              <Grid.Column width={6}><Button fluid={true} color={getTheme().primary} onClick={this.openConfirmModal}>Save &amp; Update</Button></Grid.Column>
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

  private setPostQualConfig(event: SyntheticEvent, props: DropdownProps) {
    if (typeof props.value === "string") {
      this.state.configCopy.playoffsConfig = props.value as PostQualConfig;
      this.forceUpdate();
    }
  }

  private setAllianceCaptainConfig(event: SyntheticEvent, props: DropdownProps) {
    const value: string = props.value.toString();
    if (!isNaN(parseInt(value, 10))) {
      this.state.configCopy.allianceCaptains = parseInt(value, 10);
      this.forceUpdate();
    }
  }

  private setElimsFormatConfig(event: SyntheticEvent, props: DropdownProps) {
    const value: string = props.value.toString();
    this.state.configCopy.elimsFormat = value as EliminationsFormats;
    this.forceUpdate();
  }

  private setRankingCutoffConfig(event: SyntheticEvent, props: DropdownProps) {
    const value: string = props.value.toString();
    if (!isNaN(parseInt(value, 10))) {
      this.state.configCopy.rankingCutoff = parseInt(value, 10);
      this.forceUpdate();
    }
  }

  private updateConfig() {
    this.closeConfirmModal();
    this.props.setEventConfig(this.state.configCopy);
    CONFIG_STORE.set("eventConfig", this.state.configCopy.toJSON()).then((data: any) => {
      if (this.state.configCopy.playoffsConfig === "finals" && this.props.completedStep === 4) {
        this.props.setCompletedStep(5);
      } else if (this.state.configCopy.playoffsConfig === "elims" && this.props.completedStep !== 4) {
        this.props.setCompletedStep(4);
      }
    }).catch((error: AppError) => {
      DialogManager.showErrorBox(error);
    });
  }

}

function mapStateToProps({configState, internalState}: IApplicationState) {
  return {
    eventConfig: configState.eventConfiguration,
    completedStep: internalState.completedStep,
    teamList: internalState.teamList
  };
}

function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setEventConfig: (eventConfig: EventConfiguration) => (dispatch(setEventConfiguration(eventConfig))),
    setCompletedStep: (step: number) => dispatch(incrementCompletedStep(step))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPostQual);