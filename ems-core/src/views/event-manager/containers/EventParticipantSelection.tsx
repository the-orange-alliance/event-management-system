import * as React from "react";
import {Button, Flag, Table} from "semantic-ui-react";
import {getTheme} from "../../../shared/AppTheme";
import Team from "../../../shared/models/Team";
import ConfirmActionModal from "../../../components/ConfirmActionModal";
import TeamEditModal from "../../../components/TeamEditModal";

interface IProps {
  teams?: Team[]
}

interface IState {
  removeMode: boolean,
  confirmModalOpen: boolean,
  teamModalOpen: boolean,
  activeTeam: Team
}

class EventParticipantSelection extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      removeMode: false,
      confirmModalOpen: false,
      teamModalOpen: false,
      activeTeam: null
    };
    this.toggleRemoveMode = this.toggleRemoveMode.bind(this);
    this.openConfirmModal = this.openConfirmModal.bind(this);
    this.closeConfirmModal = this.closeConfirmModal.bind(this);
    this.openTeamModal = this.openTeamModal.bind(this);
    this.closeTeamModal = this.closeTeamModal.bind(this);
  }

  public render() {
    const {removeMode, confirmModalOpen, teamModalOpen, activeTeam} = this.state;
    const teams: Team[] = [];
    const t: Team = new Team();
    t.teamKey = 4003;
    t.teamNameShort = "The TriSonics";
    t.city = "Allendale";
    t.stateProv = "MI";
    t.country = "USA";
    t.robotName = "Katie";
    t.countryCode = "us";
    teams.push(t);

    const teamsView = teams.map(team => {
      return (
        <Table.Row key={team.teamKey} onClick={this.modifyTeam.bind(this, team)}>
          <Table.Cell>{team.teamKey}</Table.Cell>
          <Table.Cell>{team.teamNameShort}</Table.Cell>
          <Table.Cell>{team.teamNameLong}</Table.Cell>
          <Table.Cell>{team.robotName}</Table.Cell>
          <Table.Cell>{team.location}</Table.Cell>
          <Table.Cell><Flag name={"us"}/></Table.Cell>
        </Table.Row>
      );
    });

    return (
      <div className="step-view">
        <div className="step-table-subview">
          <ConfirmActionModal open={confirmModalOpen} onClose={this.closeConfirmModal} onConfirm={this.closeConfirmModal} innerText={"Are you sure you want to remove this team from the event?"}/>
          <TeamEditModal open={teamModalOpen} onClose={this.closeTeamModal} onConfirm={this.closeTeamModal} team={activeTeam}/>
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
            <Button color={getTheme().primary}>Save &amp; Publish</Button>
            <Button color={getTheme().primary}>Import By CSV</Button>
          </div>
          <div>
            <Button color={getTheme().secondary}>Add Team</Button>
            <Button color={removeMode ? "red" : getTheme().secondary} onClick={this.toggleRemoveMode}>Remove Team</Button>
          </div>
        </div>
      </div>
    );
  }

  private modifyTeam(team: Team) {
    this.setState({activeTeam: team});
    if (this.state.removeMode) {
      this.openConfirmModal();
    } else {
      this.openTeamModal();
    }

  }

  private toggleRemoveMode() {
    this.setState({removeMode: !this.state.removeMode});
  }

  private openConfirmModal() {
    this.setState({confirmModalOpen: true});
  }

  private closeConfirmModal() {
    this.setState({confirmModalOpen: false});
  }

  private openTeamModal() {
    this.setState({teamModalOpen: true});
  }

  private closeTeamModal() {
    this.setState({teamModalOpen: false});
  }
}

export default EventParticipantSelection;