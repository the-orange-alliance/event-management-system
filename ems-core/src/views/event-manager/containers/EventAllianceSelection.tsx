import * as React from "react";
import {Button, Card, Divider, DropdownItemProps, DropdownProps, Form, Grid, Table} from "semantic-ui-react";
import {getTheme} from "../../../shared/AppTheme";
import EventConfiguration from "../../../shared/models/EventConfiguration";
import {ApplicationActions, IApplicationState} from "../../../stores";
import {connect} from "react-redux";
import Ranking from "../../../shared/models/Ranking";
import EMSProvider from "../../../shared/providers/EMSProvider";
import {AxiosResponse} from "axios";
import HttpError from "../../../shared/models/HttpError";
import DialogManager from "../../../shared/managers/DialogManager";
import Team from "../../../shared/models/Team";
import {SyntheticEvent} from "react";
import AllianceMember from "../../../shared/models/AllianceMember";
import Event from "../../../shared/models/Event";
import {IDisableNavigation, ISetAllianceMembers} from "../../../stores/internal/types";
import {Dispatch} from "redux";
import {disableNavigation, setAllianceMembers} from "../../../stores/internal/actions";
import EventPostingController from "../controllers/EventPostingController";
import SocketProvider from "../../../shared/providers/SocketProvider";

interface IProps {
  onComplete: () => void,
  eventConfig?: EventConfiguration,
  event?: Event,
  navigationDisabled?: boolean,
  setNavigationDisabled?: (disabled: boolean) => IDisableNavigation,
  setAllianceMembers?: (members: AllianceMember[]) => ISetAllianceMembers
}

interface IState {
  rankings: Ranking[],
  inputValues: number[],
  autoAddStack: number[],
}

class EventAllianceSelection extends React.Component<IProps, IState> {
  private _teamOptions: DropdownItemProps[];
  private _pickedTeams: number[];

  constructor(props: IProps) {
    super(props);
    const initialValues: number[] = [];
    for (let i = 0; i < (this.props.eventConfig.allianceCaptains * this.props.eventConfig.postQualTeamsPerAlliance); i++) {
      initialValues.push(0);
    }
    this._pickedTeams = [];
    this._teamOptions = [];
    this.state = {
      rankings: [],
      inputValues: initialValues,
      autoAddStack: []
    };
    this.autoRemoveTeam = this.autoRemoveTeam.bind(this);
    this.generateAlliances = this.generateAlliances.bind(this);
  }

  public componentDidMount() {
    EMSProvider.getRankingTeams().then((response: AxiosResponse) => {
      if (response.data && response.data.payload && response.data.payload.length > 0) {
        const ranks: Ranking[] = [];
        for (const rankJSON of response.data.payload) {
          const rank: Ranking = new Ranking().fromJSON(rankJSON);
          rank.team = new Team().fromJSON(rankJSON);
          ranks.push(rank);
        }
        this._teamOptions = ranks.map(ranking => {
          return {key: ranking.teamKey, value: ranking.teamKey, text: `#${ranking.rank}. ${ranking.team.getFromIdentifier(this.props.eventConfig.teamIdentifier)}`};
        });
        this.setState({rankings: ranks});
      }
    }).catch((error: HttpError) => {
      DialogManager.showErrorBox(error);
    });
  }

  public render() {

    const {rankings, inputValues} = this.state;
    const {eventConfig, navigationDisabled} = this.props;
    let canGenerate: boolean = true;

    this._pickedTeams = [];
    for (const value of inputValues) {
      if (value <= 0) {
        canGenerate = false;
      } else {
        if (value > 0 && this._pickedTeams.indexOf(value) <= -1) {
          this._pickedTeams.push(value);
        } else {
          canGenerate = false;
        }
      }
    }

    const teamOptions = this._teamOptions;
    const alliances: any[] = [];
    for (let i = 0; i < eventConfig.allianceCaptains; i++) {
      const alliancePicks: any[] = [];
      for (let j = 0; j < (eventConfig.postQualTeamsPerAlliance - 1); j++) {
        const index = (j + 1) + (i * eventConfig.postQualTeamsPerAlliance);
        alliancePicks.push(
          <Grid.Column key={"alliance-" + (i + 1) + "-pick-" + (j + 1)}>
            <Form.Dropdown fluid={true} search={true} selection={true} options={teamOptions} value={inputValues[index]} onChange={this.changeTeam.bind(this, index)} label={"Pick #" + (j + 1)}/>
          </Grid.Column>
        );
      }
      alliances.push(
        <Grid.Row key={"alliance-" + (i + 1)}>
          <Grid.Column><Form.Dropdown fluid={true} search={true} selection={true} options={teamOptions} value={inputValues[i * eventConfig.postQualTeamsPerAlliance]} onChange={this.changeTeam.bind(this, i * eventConfig.postQualTeamsPerAlliance)} label={"Alliance Captain #" + (i + 1)}/></Grid.Column>
          {alliancePicks}
        </Grid.Row>
      );
    }

    const availableRankings: any[] = [];
    for (const rank of rankings) {
      if (this._pickedTeams.indexOf(rank.teamKey) <= -1) {
        const displayName = typeof rank.team !== "undefined" ? rank.team.getFromIdentifier(eventConfig.teamIdentifier) : rank.teamKey;
        availableRankings.push(
          <Table.Row key={rank.teamKey} onClick={this.autoAddTeam.bind(this, rank.teamKey)}>
            <Table.Cell>{rank.rank}</Table.Cell>
            <Table.Cell>{displayName}</Table.Cell>
            <Table.Cell>{rank.played}</Table.Cell>
          </Table.Row>
        );
      }
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
                    {availableRankings}
                  </Table.Body>
                </Table>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Divider/>
          <div className="step-table-buttons">
            <div>
              <Button color={getTheme().primary} loading={navigationDisabled} disabled={!canGenerate || navigationDisabled} onClick={this.generateAlliances}>Save & Publish</Button>
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

  private changeTeam(index: number, event: SyntheticEvent, props: DropdownProps) {
    this.state.inputValues[index] = props.value as number;
    this.sendAllianceUpdate();
    this.forceUpdate();
  }

  private autoAddTeam(teamKey: number) {
    for (let i = 0; i < this.state.inputValues.length; i++) {
      if (this.state.inputValues[i] <= 0) {
        this.state.inputValues[i] = teamKey;
        this.state.autoAddStack.push(i);
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
      this.sendAllianceUpdate();
      this.forceUpdate();
    }
  }

  private generateAlliances() {
    this.props.setNavigationDisabled(true);
    const members: AllianceMember[] = [];
    let allianceIndex = 0;
    for (let i = 0; i < this.state.inputValues.length; i++) {
      const member: AllianceMember = new AllianceMember();
      const memberIndex = i % this.props.eventConfig.postQualTeamsPerAlliance === 0 ? 1 : (i % this.props.eventConfig.postQualTeamsPerAlliance + 1);
      if (i % this.props.eventConfig.postQualTeamsPerAlliance !== 0) {
        member.isCaptain = false;
      } else {
        member.isCaptain = true;
        allianceIndex++;
      }
      member.allianceKey = this.props.event.eventKey + "-A" + allianceIndex + "-M" + memberIndex;
      member.allianceRank = allianceIndex;
      member.allianceNameShort = allianceIndex.toString();
      member.teamKey = this.state.inputValues[i];
      members.push(member);
    }
    EventPostingController.postAlliances(members).then(() => {
      this.props.setAllianceMembers(members);
      this.props.setNavigationDisabled(false);
      this.props.onComplete();
    }).catch((error: HttpError) => {
      this.props.setNavigationDisabled(false);
      DialogManager.showErrorBox(error);
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
    eventConfig: configState.eventConfiguration,
    event: configState.event,
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