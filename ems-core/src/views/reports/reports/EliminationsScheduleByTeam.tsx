import * as React from "react";
import ReportTemplate from "./ReportTemplate";
import {IApplicationState} from "../../../stores";
import {connect} from "react-redux";
import {Dimmer, Loader, Table} from "semantic-ui-react";
import {EventConfiguration, Match, Team} from "@the-orange-alliance/lib-ems";

interface IProps {
  teamList?: Team[],
  playoffsMatches?: Match[],
  eventConfig?: EventConfiguration,
  onHTMLUpdate: (htmlStr: string) => void
}

interface IState {
  generated: boolean
}

class EliminationsScheduleByTeam extends React.Component<IProps, IState> {
  private _teamMap: Map<number, Team>;
  private _teamMatches: Map<number, Match[]>;
  private _ref: React.RefObject<any>;

  constructor(props: IProps) {
    super(props);
    this.state = {
      generated: false
    };
    this._teamMap = new Map<number, Team>();
    this._teamMatches = new Map<number, Match[]>();
    this._ref = React.createRef();
  }

  public componentDidMount() {
    const {playoffsMatches, teamList} = this.props;
    if (playoffsMatches.length <= 0 || teamList.length <= 0) {
      this.setState({generated: true});
    } else {
      for (const team of teamList) {
        this._teamMap.set(team.teamKey, team);
      }
      for (const match of playoffsMatches) {
        for (const participant of match.participants) {
          if (typeof this._teamMatches.get(participant.teamKey) === "undefined") {
            this._teamMatches.set(participant.teamKey, []);
          }
          this._teamMatches.get(participant.teamKey).push(match);
        }
      }
      setTimeout(() => {
        this.setState({generated: true});
      }, 250);
    }
  }

  public componentDidUpdate() {
    this.props.onHTMLUpdate(this._ref.current.innerHTML);
  }

  public render() {
    const {onHTMLUpdate, eventConfig} = this.props;
    const {generated} = this.state;
    const reports: JSX.Element[] = [];
    const tournamentRound = Array.isArray(this.props.eventConfig.tournament) ? this.props.eventConfig.tournament[0] : this.props.eventConfig.tournament; // TODO - CHANGE
    this._teamMatches.forEach((teamMatches: Match[], teamNumber: number) => {
      const matches = teamMatches.map(match => {
        const participants = [];
        for (let i = 0; i < (tournamentRound.format.teamsPerAlliance * 2); i++) {
          if (typeof match.participants[i] !== "undefined") {
            const participant = match.participants[i];
            if (typeof this._teamMap.get(participant.teamKey) !== "undefined") {
              participants.push(
                <Table.Cell key={participant.matchParticipantKey}>
                  {this._teamMap.get(participant.teamKey).getFromIdentifier(eventConfig.teamIdentifier)}{participant.surrogate ? "*" : ""}
                </Table.Cell>
              );
            } else {
              participants.push(
                <Table.Cell key={participant.matchParticipantKey}>
                  {participant.teamKey}{participant.surrogate ? "*" : ""}
                </Table.Cell>
              );
            }
          } else {
            participants.push(<Table.Cell key={match.matchKey + "-T" + (i + 1)}><b>TBD</b></Table.Cell>);
          }
        }
        return (
          <Table.Row key={match.matchKey}>
            <Table.Cell>{match.matchName}</Table.Cell>
            <Table.Cell>{match.fieldNumber}</Table.Cell>
            <Table.Cell>{match.scheduledStartTime.format("dddd h:mm a")}</Table.Cell>
            {participants}
          </Table.Row>
        );
      });
      const allianceHeaders = [];
      for (let i = 0; i < tournamentRound.format.teamsPerAlliance; i++) {
        allianceHeaders.push(
          <Table.HeaderCell key={i}>Team {i + 1}</Table.HeaderCell>
        );
      }
      const view = (
        <Table celled={true} structured={true} textAlign="center">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell rowSpan={2}>Match</Table.HeaderCell>
              <Table.HeaderCell rowSpan={2}>Field</Table.HeaderCell>
              <Table.HeaderCell rowSpan={2}>Time</Table.HeaderCell>
              <Table.HeaderCell colSpan={tournamentRound.format.teamsPerAlliance}>Red Alliance</Table.HeaderCell>
              <Table.HeaderCell colSpan={tournamentRound.format.teamsPerAlliance}>Blue Alliance</Table.HeaderCell>
            </Table.Row>
            <Table.Row>
              {allianceHeaders}
              {allianceHeaders}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {matches}
          </Table.Body>
        </Table>
      );
      let displayName: any = teamNumber;
      if (typeof this._teamMap.get(teamNumber) !== "undefined") {
        displayName = this._teamMap.get(teamNumber).getFromIdentifier(eventConfig.teamIdentifier);
      }
      reports.push(
        <ReportTemplate
          key={teamNumber}
          children={view}
          generated={generated}
          name={"Eliminations Schedule For " + displayName}
          updateHTML={onHTMLUpdate}
        />
      );
    });
    return (
      <div ref={this._ref}>
        <Dimmer active={!generated}>
          <Loader/>
        </Dimmer>
        {reports}
      </div>
    );
  }
}

export function mapStateToProps({configState, internalState}: IApplicationState) {
  return {
    teamList: internalState.teamList,
    playoffsMatches: internalState.playoffsMatches,
    eventConfig: configState.eventConfiguration
  };
}

export default connect(mapStateToProps)(EliminationsScheduleByTeam);