import * as React from "react";
import {Button, Card, Divider, DropdownItemProps, DropdownProps, Form, Grid, Table} from "semantic-ui-react";
import {getTheme} from "../AppTheme";
import {ApplicationActions, IApplicationState} from "../stores";
import {connect} from "react-redux";
import DialogManager from "../managers/DialogManager";
import {SyntheticEvent} from "react";
import {IDisableNavigation, ISetAllianceMembers} from "../stores/internal/types";
import {Dispatch} from "redux";
import {disableNavigation, setAllianceMembers} from "../stores/internal/actions";
import EventCreationManager from "../managers/EventCreationManager";
import {
  AppError, AllianceMember, EliminationMatchesFormat, EMSProvider, Event, EventConfiguration, HttpError, Ranking,
  RoundRobinFormat,
  SocketProvider, TournamentRound, Schedule
} from "@the-orange-alliance/lib-ems";
import {CONFIG_STORE} from "../AppStore";

interface IProps {
  activeRound: TournamentRound,
  allianceMembers: AllianceMember[],
  eventConfig?: EventConfiguration,
  event?: Event,
  playoffsSchedule?: Schedule[],
  navigationDisabled?: boolean,
  setNavigationDisabled?: (disabled: boolean) => IDisableNavigation,
  setAllianceMembers?: (members: AllianceMember[]) => ISetAllianceMembers
}

interface IState {
  availableTeams: Ranking[],
  canGenerate: boolean,
  rankings: Ranking[],
  inputValues: number[],
  autoAddStack: number[],
  teamOptions: DropdownItemProps[],
  pickedTeams: number[]
}

class EventAllianceSelection extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    let initialValues: number[] = [];

    if (props.allianceMembers.length === (this.getAlliances() * props.activeRound.format.teamsPerAlliance)) {
      initialValues = props.allianceMembers.map((member: AllianceMember) => member.teamKey);
    } else {
      for (let i = 0; i < (this.getAlliances() * props.activeRound.format.teamsPerAlliance); i++) {
        initialValues.push(-1);
      }
    }
    this.state = {
      availableTeams: [],
      canGenerate: false,
      rankings: [],
      inputValues: initialValues,
      autoAddStack: [],
      teamOptions: [],
      pickedTeams: []
    };
    this.autoRemoveTeam = this.autoRemoveTeam.bind(this);
    this.generateAlliances = this.generateAlliances.bind(this);
  }

  public componentDidMount() {
    EMSProvider.getRankingTeams().then((rankings: Ranking[]) => {
      let teamOptions: DropdownItemProps[] = [];
      if (rankings.length) {
        teamOptions = rankings.map(ranking => {
          return {key: ranking.teamKey, value: ranking.teamKey, text: `#${ranking.rank}. ${ranking.team.getFromIdentifier(this.props.eventConfig.teamIdentifier)}`};
        });
        this.setState({rankings, teamOptions, availableTeams: rankings});
      }
    }).catch((error: HttpError) => {
      DialogManager.showErrorBox(error);
    });
  }

  public render() {
    const {availableTeams, canGenerate, teamOptions, inputValues} = this.state;
    const {activeRound, eventConfig, navigationDisabled} = this.props;

    const rankingsView = availableTeams.map((rank: Ranking) => {
      const displayName = typeof rank.team !== "undefined" ? rank.team.getFromIdentifier(eventConfig.teamIdentifier) : rank.teamKey;
      return (
        <Table.Row key={rank.teamKey} onClick={this.autoAddTeam.bind(this, rank.teamKey)}>
          <Table.Cell>{rank.rank}</Table.Cell>
          <Table.Cell>{displayName}</Table.Cell>
          <Table.Cell>{rank.played}</Table.Cell>
        </Table.Row>
      );
    });

    const alliances: any[] = [];
    for (let i = 0; i < this.getAlliances(); i++) {
      const alliancePicks: any[] = [];
      for (let j = 0; j < (activeRound.format.teamsPerAlliance - 1); j++) {
        const index = (j + 1) + (i * activeRound.format.teamsPerAlliance);
        alliancePicks.push(
          <Grid.Column key={"alliance-" + (i + 1) + "-pick-" + (j + 1)}>
            <Form.Dropdown fluid={true} search={true} selection={true} options={teamOptions} value={inputValues[index]} onChange={this.changeTeam.bind(this, index)} label={"Pick #" + (j + 1)}/>
          </Grid.Column>
        );
      }
      alliances.push(
        <Grid.Row key={"alliance-" + (i + 1)}>
          <Grid.Column><Form.Dropdown fluid={true} search={true} selection={true} options={teamOptions} value={inputValues[i * activeRound.format.teamsPerAlliance]} onChange={this.changeTeam.bind(this, i * activeRound.format.teamsPerAlliance)} label={"Alliance Captain #" + (i + 1)}/></Grid.Column>
          {alliancePicks}
        </Grid.Row>
      );
    }

    return (
      <Card fluid={true} color={getTheme().secondary} className="step-view">
        <Card.Content className='card-header'>
          <Card.Header>Alliance Selections</Card.Header>
        </Card.Content>
        <Card.Content>
          <Grid columns={16}>
            <Grid.Row>
              <Grid.Column width={10}>
                <Form>
                  <Grid columns="equal">
                    {alliances}
                  </Grid>
                </Form>
              </Grid.Column>
              <Grid.Column width={6} className="step-view-inner-table">
                <Table color={getTheme().primary} selectable={true} attached={true} celled={true} textAlign="center">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Rank</Table.HeaderCell>
                      <Table.HeaderCell>Team</Table.HeaderCell>
                      <Table.HeaderCell>Played</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {rankingsView}
                  </Table.Body>
                </Table>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Divider/>
          <div className="step-table-buttons">
            <div>
              <Button color={getTheme().primary} loading={navigationDisabled} disabled={!canGenerate || navigationDisabled} onClick={this.generateAlliances}>Save &amp; Publish</Button>
              <Button color={getTheme().primary} disabled={navigationDisabled} onClick={this.autoRemoveTeam}>Undo Action</Button>
            </div>
            <div>
              <Button color={getTheme().secondary} disabled={navigationDisabled} onClick={this.switchVideo.bind(this, 7)}>Show Available Teams</Button>
              <Button color={getTheme().secondary} disabled={navigationDisabled} onClick={this.switchVideo.bind(this, 8)}>Show Current Alliances</Button>
            </div>
          </div>
        </Card.Content>
      </Card>
    );
  }

  private getAlliances(): number {
    const {activeRound} = this.props;
    switch (activeRound.type) {
      case "rr":
        return (activeRound.format as RoundRobinFormat).alliances;
      case "elims":
        return (activeRound.format as EliminationMatchesFormat).alliances;
      default:
        return 0;
    }
  }

  private updateAvailableTeams() {
    const {availableTeams, inputValues, pickedTeams} = this.state;
    for (const value of inputValues) {
      if (value > 0 && pickedTeams.indexOf(value) <= -1) {
        pickedTeams.push(value);
      }
    }
    const newTeams: Ranking[] = availableTeams.filter((r: Ranking) => pickedTeams.indexOf(r.teamKey) === -1);
    this.setState({canGenerate: inputValues.length === pickedTeams.length, availableTeams: newTeams});
  }

  private changeTeam(index: number, event: SyntheticEvent, props: DropdownProps) {
    this.state.inputValues[index] = props.value as number;
    this.updateAvailableTeams();
    this.sendAllianceUpdate();
    this.forceUpdate();
  }

  private autoAddTeam(teamKey: number) {
    for (let i = 0; i < this.state.inputValues.length; i++) {
      if (this.state.inputValues[i] <= 0) {
        this.state.inputValues[i] = teamKey;
        this.state.autoAddStack.push(i);
        this.updateAvailableTeams();
        this.sendAllianceUpdate();
        this.forceUpdate();
        break;
      }
    }
  }

  private autoRemoveTeam() {
    if (this.state.autoAddStack.length > 0) {
      const index = this.state.autoAddStack.pop();
      this.state.inputValues[index] = 0;
      this.updateAvailableTeams();
      this.sendAllianceUpdate();
      this.forceUpdate();
    }
  }

  private generateAlliances() {
    const {activeRound, playoffsSchedule} = this.props;
    this.props.setNavigationDisabled(true);
    const members: AllianceMember[] = [];
    const rankings: Ranking[] = [];
    let allianceIndex = 0;
    for (let i = 0; i < this.state.inputValues.length; i++) {
      const member: AllianceMember = new AllianceMember();
      const memberIndex = i % activeRound.format.teamsPerAlliance === 0 ? 1 : (i % activeRound.format.teamsPerAlliance + 1);
      if (i % activeRound.format.teamsPerAlliance !== 0) {
        member.isCaptain = false;
      } else {
        member.isCaptain = true;
        allianceIndex++;
      }
      member.allianceKey = `${this.props.event.eventKey}-${activeRound.id}A${allianceIndex}-M${memberIndex}`;
      member.allianceRank = allianceIndex;
      member.allianceNameShort = allianceIndex.toString();
      member.teamKey = this.state.inputValues[i];
      members.push(member);

      const rank: Ranking = new Ranking();
      rank.allianceKey = member.allianceKey;
      rank.teamKey = member.teamKey;
      rank.rankKey = this.props.event.eventKey + "R" + member.teamKey;
      rankings.push(rank);
    }

    const schedule = playoffsSchedule[activeRound.id];
    schedule.teams = this.state.pickedTeams;
    EventCreationManager.deleteRanks().then(() => {
      EventCreationManager.createTournamentRanks(rankings).then(() => {
        EventCreationManager.postAlliances(members).then(() => {
          CONFIG_STORE.getAll().then((config: any) => {
            let configSchedule: any = {};
            if (typeof config.schedule !== "undefined") {
              configSchedule = config.schedule;
            }
            configSchedule.Playoffs = playoffsSchedule.map((s: Schedule) => s.toJSON());
            CONFIG_STORE.set("schedule", configSchedule).then(() => {
              this.props.setAllianceMembers(members);
              this.props.setNavigationDisabled(false);
            }).catch((setError: AppError) => {
              this.props.setNavigationDisabled(false);
              DialogManager.showErrorBox(setError);
            });
          }).catch((getError: AppError) => {
            this.props.setNavigationDisabled(false);
            DialogManager.showErrorBox(getError);
          });
        }).catch((postError: HttpError) => {
          this.props.setNavigationDisabled(false);
          DialogManager.showErrorBox(postError);
        });
      }).catch((postRankErr: HttpError) => {
        this.props.setNavigationDisabled(false);
        DialogManager.showErrorBox(postRankErr);
      });
    }).catch((delRankErr: HttpError) => {
      this.props.setNavigationDisabled(false);
      DialogManager.showErrorBox(delRankErr);
    });
  }

  private switchVideo(id: number) {
    SocketProvider.send("request-video", id);
  }

  private sendAllianceUpdate() {
    SocketProvider.send("alliance-update", this.state.inputValues);
  }
}

export function mapStateToProps({configState, internalState}: IApplicationState) {
  return {
    allianceMembers: internalState.allianceMembers,
    eventConfig: configState.eventConfiguration,
    event: configState.event,
    playoffsSchedule: configState.playoffsSchedule,
    navigationDisabled: internalState.navigationDisabled
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setNavigationDisabled: (disabled: boolean) => dispatch(disableNavigation(disabled)),
    setAllianceMembers: (members: AllianceMember[]) => dispatch(setAllianceMembers(members))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventAllianceSelection);