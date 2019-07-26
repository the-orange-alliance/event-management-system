import * as React from "react";
import {Button, Card, Dropdown, DropdownProps, Grid} from "semantic-ui-react";
import {getTheme} from "../AppTheme";
import {ApplicationActions, IApplicationState} from "../stores";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {ISetEventConfiguration} from "../stores/config/types";
import {setEventConfiguration} from "../stores/config/actions";
import {SyntheticEvent} from "react";
import ConfirmActionModal from "./ConfirmActionModal";
import {CONFIG_STORE} from "../AppStore";
import DialogManager from "../managers/DialogManager";
import {IIncrementCompletedStep} from "../stores/internal/types";
import {incrementCompletedStep} from "../stores/internal/actions";
import {
  AppError, SeriesType, EventConfiguration, Team, DropdownData, PlayoffsType,
  EliminationMatchesFormat, RankingMatchesFormat, RoundRobinFormat, RANKING_PRESET, ROUND_ROBIN_PRESET,
  ELIMINATIONS_PRESET
} from "@the-orange-alliance/lib-ems";
import NumericInput from "./NumericInput";

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
    this.setAdvancementConfig = this.setAdvancementConfig.bind(this);
    this.setAllianceCaptainConfig = this.setAllianceCaptainConfig.bind(this);
    this.setElimsSeriesConfig = this.setElimsSeriesConfig.bind(this);
    this.setRankingCutoffConfig = this.setRankingCutoffConfig.bind(this);
    this.setAlliances = this.setAlliances.bind(this);
    this.setTeamsPerAlliance = this.setTeamsPerAlliance.bind(this);
    this.updateConfig = this.updateConfig.bind(this);
  }

  public render() {
    const {confirmModalOpen} = this.state;
    const eventConfig = this.state.configCopy;
    const tournamentRound = Array.isArray(eventConfig.tournament) ? eventConfig.tournament[0] : eventConfig.tournament;
    return (
      <Card fluid={true} color={getTheme().secondary}>
        <ConfirmActionModal open={confirmModalOpen} onClose={this.closeConfirmModal} onConfirm={this.updateConfig} innerText={"Are you sure you want to update this event's post-qualification config?"}/>
        <Card.Content className="card-header"><h3>Post-Qualification Configuration</h3></Card.Content>
        <Card.Content>
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column className="center-left-items">
                <span>Tournament Config</span>
              </Grid.Column>
              <Grid.Column className="center-left-items">
                <Dropdown
                  fluid={true}
                  selection={true}
                  value={this.state.configCopy.tournamentConfig}
                  options={DropdownData.PostQualItems}
                  onChange={this.setAdvancementConfig}
                />
              </Grid.Column>
            </Grid.Row>
            {this.renderAdvancementView()}
            <Grid.Row>
              <Grid.Column className="center-left-items"><span>Teams Per Alliance</span></Grid.Column>
              <Grid.Column><NumericInput value={tournamentRound.format.teamsPerAlliance} onUpdate={this.setTeamsPerAlliance}/></Grid.Column>
            </Grid.Row>
            <Grid.Row width={16} centered={true}>
              <Grid.Column width={6}><Button fluid={true} color={getTheme().primary} onClick={this.openConfirmModal}>Save &amp; Update</Button></Grid.Column>
            </Grid.Row>
          </Grid>
        </Card.Content>
      </Card>
    );
  }

  private renderAdvancementView() {
    const eventConfig = this.state.configCopy;
    const tournamentRound = Array.isArray(eventConfig.tournament) ? eventConfig.tournament[0] : eventConfig.tournament;
    let advancementView;

    switch (eventConfig.tournamentConfig) {
      case "rr":
        const rrAlliances = (tournamentRound.format as RoundRobinFormat).alliances;
        advancementView = (
          <Grid.Row>
            <Grid.Column className={"center-left-items"}><span>Alliances</span></Grid.Column>
            <Grid.Column><NumericInput value={rrAlliances} onUpdate={this.setAlliances} label="Alliances"/></Grid.Column>
          </Grid.Row>
        );
        break;
      case "ranking":
        const rCutoff = (tournamentRound.format as RankingMatchesFormat).rankingCutoff;
        const rankingsOptions = this.props.teamList.map((team, index) => {
          return {
            text: index + 1,
            value: index + 1
          };
        });
        advancementView = (
          <Grid.Row>
            <Grid.Column className={"center-left-items"}><span>Ranking Cutoff</span></Grid.Column>
            <Grid.Column><Dropdown fluid={true} selection={true} value={rCutoff} options={rankingsOptions} onChange={this.setRankingCutoffConfig}/></Grid.Column>
          </Grid.Row>
        );
        break;
      case "elims":
        const elimsAlliances = (tournamentRound.format as EliminationMatchesFormat).alliances;
        const elimsSeries = (tournamentRound.format as EliminationMatchesFormat).seriesType;
        advancementView = [
          (
            <Grid.Row key={"#1"}>
              <Grid.Column className={"center-left-items"}><span>Alliance Captains</span></Grid.Column>
              <Grid.Column><Dropdown fluid={true} selection={true} value={elimsAlliances} options={DropdownData.AllianceCaptainItems} onChange={this.setAllianceCaptainConfig}/></Grid.Column>
            </Grid.Row>
          ),
          (
            <Grid.Row key={"#2"}>
              <Grid.Column className={"center-left-items"}><span>Eliminations Format</span></Grid.Column>
              <Grid.Column><Dropdown fluid={true} selection={true} value={elimsSeries} options={DropdownData.SeriesTypeItems} onChange={this.setElimsSeriesConfig}/></Grid.Column>
            </Grid.Row>
          )
        ];
        break;
      case "custom":
        advancementView = (
          <Grid.Column width={4}>
            <Dropdown fluid={true} selection={true} options={[]} error={true} label="Coming Soon!"/>
          </Grid.Column>
        );
    }

    return (advancementView);
  }

  private openConfirmModal() {
    this.setState({confirmModalOpen: true});
  }

  private closeConfirmModal() {
    this.setState({confirmModalOpen: false});
  }

  private setAdvancementConfig(event: SyntheticEvent, props: DropdownProps) {
    if (typeof props.value === "string") {
      this.state.configCopy.tournamentConfig = props.value as PlayoffsType;
      if (props.value as PlayoffsType === "rr") {
        this.state.configCopy.tournament = ROUND_ROBIN_PRESET;
      } else if (props.value as PlayoffsType === "ranking") {
        this.state.configCopy.tournament = RANKING_PRESET;
      } else if (props.value as PlayoffsType === "elims") {
        this.state.configCopy.tournament = ELIMINATIONS_PRESET;
      }
      this.forceUpdate();
    }
  }

  private setAllianceCaptainConfig(event: SyntheticEvent, props: DropdownProps) {
    const value: string = props.value.toString();
    if (!isNaN(parseInt(value, 10))) {
      const tournamentRound = Array.isArray(this.state.configCopy.tournament) ? this.state.configCopy.tournament[0] : this.state.configCopy.tournament;
      (tournamentRound.format as EliminationMatchesFormat).alliances = parseInt(value, 10);
      this.forceUpdate();
    }
  }

  private setElimsSeriesConfig(event: SyntheticEvent, props: DropdownProps) {
    const value: string = props.value.toString();
    const tournamentRound = Array.isArray(this.state.configCopy.tournament) ? this.state.configCopy.tournament[0] : this.state.configCopy.tournament;
    (tournamentRound.format as EliminationMatchesFormat).seriesType = value as SeriesType;
    this.forceUpdate();
  }

  private setRankingCutoffConfig(event: SyntheticEvent, props: DropdownProps) {
    const value: string = props.value.toString();
    if (!isNaN(parseInt(value, 10))) {
      const tournamentRound = Array.isArray(this.state.configCopy.tournament) ? this.state.configCopy.tournament[0] : this.state.configCopy.tournament;
      (tournamentRound.format as RankingMatchesFormat).rankingCutoff = parseInt(value, 10);
      this.forceUpdate();
    }
  }

  private setAlliances(newValue: number) {
    const tournamentRound = Array.isArray(this.state.configCopy.tournament) ? this.state.configCopy.tournament[0] : this.state.configCopy.tournament;
    (tournamentRound.format as RoundRobinFormat).alliances = newValue;
    this.forceUpdate();
  }

  private setTeamsPerAlliance(newValue: number) {
    const tournamentRound = Array.isArray(this.state.configCopy.tournament) ? this.state.configCopy.tournament[0] : this.state.configCopy.tournament;
    tournamentRound.format.teamsPerAlliance = newValue;
    this.forceUpdate();
  }

  private updateConfig() {
    this.closeConfirmModal();
    this.props.setEventConfig(this.state.configCopy);
    CONFIG_STORE.set("eventConfig", this.state.configCopy.toJSON()).then((data: any) => {
      if (this.state.configCopy.tournamentConfig === "ranking" && this.props.completedStep === 4) {
        this.props.setCompletedStep(5);
      } else if (this.state.configCopy.tournamentConfig === "elims" && this.props.completedStep !== 4) {
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