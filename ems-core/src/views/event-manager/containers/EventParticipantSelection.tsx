import * as React from "react";
import {Button, Table} from "semantic-ui-react";
import {getTheme} from "../../../shared/AppTheme";
import Team from "../../../shared/models/Team";
import ConfirmActionModal from "../../../components/ConfirmActionModal";
import TeamEditModal from "../../../components/TeamEditModal";
import {ApplicationActions, IApplicationState} from "../../../stores";
import {Dispatch} from "redux";
import {IAddTeam, IAlterTeam, IDisableNavigation, IRemoveTeam, IUpdateTeamList} from "../../../stores/internal/types";
import {addTeam, alterTeam, disableNavigation, removeTeam, updateTeamList} from "../../../stores/internal/actions";
import {connect} from "react-redux";
import DialogManager from "../../../shared/managers/DialogManager";
import TeamValidator from "../controllers/TeamValidator";
import EventConfiguration from "../../../shared/models/EventConfiguration";
import EventPostingController from "../controllers/EventPostingController";
import HttpError from "../../../shared/models/HttpError";
import Event from "../../../shared/models/Event";
import TOAConfig from "../../../shared/models/TOAConfig";
import TOAProvider from "../../../shared/providers/TOAProvider";
import {AxiosResponse} from "axios";
import TOATeam from "../../../shared/models/toa/TOATeam";
import EMSTeamAdapter from "../../../shared/adapters/EMSTeamAdapter";

interface IProps {
  onComplete: () => void,
  teams?: Team[],
  eventConfig?: EventConfiguration,
  event: Event,
  toaConfig?: TOAConfig
  addTeam?: (team: Team) => IAddTeam,
  alterTeam?: (index: number, team: Team) => IAlterTeam,
  removeTeam?: (index: number) => IRemoveTeam
  setTeamList?: (teams: Team[]) => IUpdateTeamList,
  setNavigationDisabled?: (disabled: boolean) => IDisableNavigation
}

interface IState {
  removeMode: boolean,
  confirmModalOpen: boolean,
  teamModalOpen: boolean,
  creatingNewTeam: boolean
  activeTeam: Team,
  activeTeamIndex: number,
  loadingTeams: boolean
}

class EventParticipantSelection extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      removeMode: false,
      confirmModalOpen: false,
      teamModalOpen: false,
      creatingNewTeam: false,
      activeTeam: null,
      activeTeamIndex: 0,
      loadingTeams: false
    };
    this.toggleRemoveMode = this.toggleRemoveMode.bind(this);
    this.closeConfirmModal = this.closeConfirmModal.bind(this);
    this.closeTeamModal = this.closeTeamModal.bind(this);
    this.updateModifiedTeam = this.updateModifiedTeam.bind(this);
    this.createNewTeam = this.createNewTeam.bind(this);
    this.removeTeam = this.removeTeam.bind(this);
    this.importTeamsByCSV = this.importTeamsByCSV.bind(this);
    this.importByTOA = this.importByTOA.bind(this);
    this.createTeamList = this.createTeamList.bind(this);
  }

  public render() {
    const {teams, toaConfig} = this.props;
    const {removeMode, confirmModalOpen, teamModalOpen, activeTeam, loadingTeams} = this.state;

    const teamsView = teams.map((team, index) => {
      return (
        <Table.Row key={team.teamKey} onClick={this.modifyTeam.bind(this, team, index)}>
          <Table.Cell>{team.teamKey}</Table.Cell>
          <Table.Cell>{team.teamNameShort}</Table.Cell>
          <Table.Cell>{team.teamNameLong}</Table.Cell>
          <Table.Cell>{team.robotName}</Table.Cell>
          <Table.Cell>{team.location}</Table.Cell>
          <Table.Cell><span className={"flag-icon flag-icon-" + team.countryCode}/></Table.Cell>
        </Table.Row>
      );
    });

    return (
      <div className="step-view">
        <div className="step-table-subview">
          <ConfirmActionModal open={confirmModalOpen} onClose={this.closeConfirmModal} onConfirm={this.removeTeam} innerText={"Are you sure you want to remove this team from the event?"}/>
          <TeamEditModal open={teamModalOpen} onClose={this.closeTeamModal} onUpdate={this.updateModifiedTeam} team={activeTeam}/>
          <Table color={getTheme().secondary} attached={true} celled={true} selectable={true} textAlign="center" columns={16}>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width={2}>Team ID</Table.HeaderCell>
                <Table.HeaderCell width={4}>Name (Short)</Table.HeaderCell>
                <Table.HeaderCell width={4}>Name (Long)</Table.HeaderCell>
                <Table.HeaderCell width={2}>Robot Name</Table.HeaderCell>
                <Table.HeaderCell width={2}>Location</Table.HeaderCell>
                <Table.HeaderCell width={2}>Flag</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {teamsView}
            </Table.Body>
          </Table>
        </div>
        <div className="step-table-buttons">
          <div>
            <Button color={getTheme().primary} loading={loadingTeams} disabled={loadingTeams || !this.canCreateTeamList()} onClick={this.createTeamList}>Save &amp; Publish</Button>
            <Button color={getTheme().primary} loading={loadingTeams} disabled={loadingTeams} onClick={this.importTeamsByCSV}>Import By CSV</Button>
            {
              toaConfig.enabled &&
              <Button color={getTheme().primary} loading={loadingTeams} disabled={loadingTeams} onClick={this.importByTOA}>Import From TOA</Button>
            }
          </div>
          <div>
            <Button color={getTheme().secondary} loading={loadingTeams} disabled={loadingTeams} onClick={this.createNewTeam}>Add Team</Button>
            <Button color={removeMode ? "red" : getTheme().secondary} loading={loadingTeams} disabled={loadingTeams} onClick={this.toggleRemoveMode}>Remove Team</Button>
          </div>
        </div>
      </div>
    );
  }

  private createTeamList() {
    this.setState({loadingTeams: true});
    this.props.setNavigationDisabled(true);
    const updatedTeams: Team[] = this.props.teams;
    for (let i = 0; i < this.props.teams.length; i++) {
      updatedTeams[i].participantKey = this.props.event.eventKey + "-T" + (i + 1);
    }
    EventPostingController.createTeamList(updatedTeams).then(() => {
      setTimeout(() => {
        this.setState({loadingTeams: false});
        this.props.setNavigationDisabled(false);
        this.props.onComplete();
      }, 500);
    }).catch((error: HttpError) => {
      this.setState({loadingTeams: false});
      this.props.setNavigationDisabled(false);
      DialogManager.showErrorBox(error);
    });
  }

  private importTeamsByCSV() {
    DialogManager.showOpenDialog({title: "Team CSV Import", files: true, filters: [{name: "CSV Files", extensions: ["csv"]}]}).then((paths: string[]) => {
      this.setState({loadingTeams: true});
      this.props.setNavigationDisabled(true);
      DialogManager.parseCSV(paths[0]).then((lines: string[]) => {
        const teams: Team[] = [];
        const failedImports: string[] = [];
        for (const line of lines) {
          const data = line.split(",");
          try {
            const team: Team = new Team();
            const validator: TeamValidator = new TeamValidator(team);
            team.teamKey = parseInt(data[0], 10);
            team.teamNameShort = data[1];
            team.teamNameLong = data[2];
            team.robotName = data[3];
            team.city = data[4];
            team.stateProv = data[5];
            team.country = data[6];
            team.countryCode = data[7];
            validator.update(team);
            if (validator.isValid) {
              teams.push(team);
            } else {
              failedImports.push(data[0]);
            }
          } catch (e) {
            console.error(e);
            failedImports.push(data[0]);
          }
        }
        this.setState({loadingTeams: false});
        this.props.setNavigationDisabled(false);
        this.props.setTeamList(teams);
        setTimeout(() => {
          DialogManager.showInfoBox("Team Import Result", "Imported " + teams.length + " of original " + lines.length + ". The following teams were not imported due to parsing errors: " + failedImports.toString());
        }, 250);
      }).catch((error: any) => {
        DialogManager.showErrorBox(error);
      });
    });
  }

  private importByTOA() {
    this.setState({loadingTeams: true});
    this.props.setNavigationDisabled(true);
    TOAProvider.getTeams(this.props.event.eventKey).then((res: AxiosResponse) => {
      const teams: Team[] = [];
      const failedImports: number[] = [];
      if (res.data && res.data.length > 0) {
        for (const teamJSON of res.data) {
          if (typeof teamJSON.team !== "undefined") {
            const team: Team = new EMSTeamAdapter(new TOATeam().fromJSON(teamJSON.team)).get();
            team.participantKey = teamJSON.event_participant_key;
            const validator: TeamValidator = new TeamValidator(team);
            validator.update(team);
            if (validator.isValid) {
              teams.push(team);
            } else {
              failedImports.push(teamJSON.team_key);
            }
          } else {
            failedImports.push(teamJSON.team_key);
          }
        }
      }
      this.setState({loadingTeams: false});
      this.props.setNavigationDisabled(false);
      this.props.setTeamList(teams);
      setTimeout(() => {
        DialogManager.showInfoBox("Team Import Result", "Imported " + teams.length + " of original " + res.data.length + ". The following teams were not imported due to parsing errors: " + failedImports.toString());
      }, 250);
    }).catch((error: HttpError) => {
      this.setState({loadingTeams: false});
      this.props.setNavigationDisabled(false);
      DialogManager.showErrorBox(error);
    });
  }

  private canCreateTeamList(): boolean {
    if (this.props.eventConfig.postQualConfig === "elims") {
      const maxTeamsPerAlliance = Math.max(this.props.eventConfig.teamsPerAlliance, this.props.eventConfig.postQualTeamsPerAlliance);
      return this.props.teams.length >= (maxTeamsPerAlliance * this.props.eventConfig.allianceCaptains);
    } else {
      return this.props.teams.length > 8;
    }
  }

  private modifyTeam(team: Team, index: number) {
    if (this.state.removeMode) {
      this.setState({confirmModalOpen: true, activeTeam: team, activeTeamIndex: index});
    } else {
      this.setState({teamModalOpen: true, activeTeam: team, activeTeamIndex: index});
    }
  }

  private updateModifiedTeam(newTeam: Team) {
    if (this.state.creatingNewTeam) {
      this.props.addTeam(newTeam);
    } else {
      this.props.alterTeam(this.state.activeTeamIndex, newTeam);
    }
    this.setState({teamModalOpen: false, creatingNewTeam: false, activeTeam: null, activeTeamIndex: 0});
    this.forceUpdate();
  }

  private createNewTeam() {
    this.setState({teamModalOpen: true, creatingNewTeam: true, activeTeam: new Team()});
  }

  private removeTeam() {
    this.props.removeTeam(this.state.activeTeamIndex);
    this.setState({confirmModalOpen: false, removeMode: false});
  }

  private toggleRemoveMode() {
    this.setState({removeMode: !this.state.removeMode});
  }

  private closeConfirmModal() {
    this.setState({confirmModalOpen: false});
  }

  private closeTeamModal() {
    this.setState({teamModalOpen: false});
  }
}

export function mapStateToProps({internalState, configState}: IApplicationState) {
  return {
    teams: internalState.teamList,
    eventConfig: configState.eventConfiguration,
    event: configState.event,
    toaConfig: configState.toaConfig
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    addTeam: (team: Team) => dispatch(addTeam(team)),
    alterTeam: (index: number, team: Team) => dispatch(alterTeam(index, team)),
    removeTeam: (index: number) => dispatch(removeTeam(index)),
    setTeamList: (teams: Team[]) => dispatch(updateTeamList(teams)),
    setNavigationDisabled: (disabled: boolean) => dispatch(disableNavigation(disabled))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventParticipantSelection);