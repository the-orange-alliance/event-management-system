import * as React from "react";
import ReportTemplate from "./ReportTemplate";
import Team from "../../../shared/models/Team";
import Match from "../../../shared/models/Match";
import {IApplicationState} from "../../../stores";
import {connect} from "react-redux";
import {Table} from "semantic-ui-react";
import EventConfiguration from "../../../shared/models/EventConfiguration";

interface IProps {
  teamList?: Team[],
  eliminationsMatches?: Match[],
  eventConfig?: EventConfiguration,
  onHTMLUpdate: (htmlStr: string) => void
}

interface IState {
  generated: boolean
}

class EliminationsSchedule extends React.Component<IProps, IState> {
  private _teamMap: Map<number, Team>;

  constructor(props: IProps) {
    super(props);
    this.state = {
      generated: false
    };
    this._teamMap = new Map<number, Team>();
  }

  public componentDidMount() {
    const {eliminationsMatches, teamList} = this.props;
    if (eliminationsMatches.length <= 0 || teamList.length <= 0) {
      this.setState({generated: true});
    } else {
      for (const team of teamList) {
        this._teamMap.set(team.teamKey, team);
      }
      setTimeout(() => {
        this.setState({generated: true});
      }, 250);
    }
  }

  public render() {
    const {onHTMLUpdate, eventConfig, eliminationsMatches} = this.props;
    const {generated} = this.state;
    const matches = eliminationsMatches.map(match => {
      const participants = [];
      for (let i = 0; i < (eventConfig.postQualTeamsPerAlliance * 2); i++) {
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
          <Table.Cell>{match.scheduledStartTime.format("dddd h:mm a")}</Table.Cell>
          {participants}
        </Table.Row>
      );
    });
    const allianceHeaders = [];
    for (let i = 0; i < eventConfig.postQualTeamsPerAlliance; i++) {
      allianceHeaders.push(
        <Table.HeaderCell key={i}>Team {i + 1}</Table.HeaderCell>
      );
    }
    let view = (
      <Table celled={true} structured={true} textAlign="center">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell rowSpan={2}>Match</Table.HeaderCell>
            <Table.HeaderCell rowSpan={2}>Time</Table.HeaderCell>
            <Table.HeaderCell colSpan={eventConfig.postQualTeamsPerAlliance}>Red Alliance</Table.HeaderCell>
            <Table.HeaderCell colSpan={eventConfig.postQualTeamsPerAlliance}>Blue Alliance</Table.HeaderCell>
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
    if (eliminationsMatches.length <= 0) {
      view = (<span>There are no eliminations matches to report.</span>);
    }
    return (
      <ReportTemplate
        children={view}
        generated={generated}
        name={"Eliminations Schedule"}
        updateHTML={onHTMLUpdate}
      />
    );
  }
}

export function mapStateToProps({configState, internalState}: IApplicationState) {
  return {
    teamList: internalState.teamList,
    eliminationsMatches: internalState.eliminationsMatches,
    eventConfig: configState.eventConfiguration
  };
}

export default connect(mapStateToProps)(EliminationsSchedule);