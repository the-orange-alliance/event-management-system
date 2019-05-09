import * as React from "react";
import {AppError, Schedule, Team, TournamentType} from "@the-orange-alliance/lib-ems";
import {IApplicationState} from "../stores";
import {connect} from "react-redux";
import {Button, Card, Checkbox, Table} from "semantic-ui-react";
import {getTheme} from "../AppTheme";
import {CONFIG_STORE} from "../AppStore";
import DialogManager from "../managers/DialogManager";
import MatchMakerManager from "../managers/MatchMakerManager";

interface IProps {
  onComplete: () => void,
  type: TournamentType,
  teams?: Team[]
  schedule: Schedule
}

interface IState {
  teamParticipants: number[],
  savingParticipants: boolean
}

class SetupScheduleParticipants extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      teamParticipants: [],
      savingParticipants: false
    };

    this.saveParticipants = this.saveParticipants.bind(this);
    this.selectAllTeams = this.selectAllTeams.bind(this);
    this.deselectAllTeams = this.deselectAllTeams.bind(this);
  }

  public componentDidMount() {
    this.setState({
      teamParticipants: this.props.schedule.teams
    });
  }

  public render() {
    const {teams,type} = this.props;
    const {teamParticipants, savingParticipants} = this.state;
    const teamsView = teams.map((team) => {
      return (
        <Table.Row key={team.teamKey}>
          <Table.Cell><Checkbox checked={teamParticipants.indexOf(team.teamKey) > -1} onChange={this.toggleParticipantStatus.bind(this, team.teamKey)}/></Table.Cell>
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
      <div className="step-view-tab">
        <Card fluid={true} color={getTheme().secondary}>
          <Card.Content>
            <span><i>{type} schedule teams can be selected here. Additional buttons are below the table.</i></span>
          </Card.Content>
          <Card.Content>
            <Table color={getTheme().secondary} attached={true} celled={true} selectable={true} textAlign="center" columns={16}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell width={1}>Playing</Table.HeaderCell>
                  <Table.HeaderCell width={2}>Team ID</Table.HeaderCell>
                  <Table.HeaderCell width={4}>Name (Short)</Table.HeaderCell>
                  <Table.HeaderCell width={4}>Name (Long)</Table.HeaderCell>
                  <Table.HeaderCell width={2}>Robot Name</Table.HeaderCell>
                  <Table.HeaderCell width={2}>Location</Table.HeaderCell>
                  <Table.HeaderCell width={2}>Flag</Table.HeaderCell>
                </Table.Row>
                {teamsView}
              </Table.Header>
            </Table>
            <div className="step-table-buttons">
              <div>
                <Button color={getTheme().primary} disabled={savingParticipants} loading={savingParticipants} onClick={this.saveParticipants}>Save</Button>
              </div>
              <div>
                <Button color={getTheme().primary} disabled={savingParticipants} onClick={this.selectAllTeams}>Select All Teams</Button>
                <Button color={getTheme().primary} disabled={savingParticipants} onClick={this.deselectAllTeams}>Deselect All Teams</Button>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    );
  }

  private saveParticipants() {
    this.setState({savingParticipants: true});
    this.props.schedule.teamsParticipating = this.state.teamParticipants.length;
    this.props.schedule.teams = this.state.teamParticipants;
    MatchMakerManager.createTeamList(this.props.schedule.type, this.props.schedule.teams).then(() => {
      CONFIG_STORE.getAll().then((config: any) => {
        let schedule: any = {};
        if (typeof config.schedule !== "undefined") {
          schedule = config.schedule;
        }
        schedule[this.props.schedule.type] = this.props.schedule.toJSON();
        CONFIG_STORE.set("schedule", schedule).then(() => {
          this.setState({savingParticipants: false});
          this.props.onComplete();
        }).catch((err) => {
          DialogManager.showErrorBox(err);
        });
      }).catch((err) => {
        DialogManager.showErrorBox(err);
      });
    }).catch((err: AppError) => {
      DialogManager.showErrorBox(err);
    });
  }

  private toggleParticipantStatus(teamKey: number) {
    if (this.state.teamParticipants.indexOf(teamKey) > -1) {
      this.state.teamParticipants.splice(this.state.teamParticipants.indexOf(teamKey), 1);
    } else {
      this.state.teamParticipants.push(teamKey);
    }
    this.forceUpdate();
  }

  private selectAllTeams() {
    this.setState({
      teamParticipants: this.props.teams.map((team: Team) => team.teamKey)
    });
  }

  private deselectAllTeams() {
    this.setState({
      teamParticipants: []
    });
  }
}

export function mapStateToProps({internalState}: IApplicationState) {
  return {
    teams: internalState.teamList
  };
}

export default connect(mapStateToProps)(SetupScheduleParticipants);