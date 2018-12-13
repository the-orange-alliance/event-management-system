import * as React from "react";
import ReportTemplate from "./ReportTemplate";
import Team from "../../../shared/models/Team";
import Match from "../../../shared/models/Match";
import {IApplicationState} from "../../../stores";
import {connect} from "react-redux";
import {Table} from "semantic-ui-react";
import EventConfiguration from "../../../shared/models/EventConfiguration";
import MatchParticipant from "../../../shared/models/MatchParticipant";

interface IProps {
  teamList?: Team[],
  qualificationMatches?: Match[],
  eventConfig?: EventConfiguration,
  onHTMLUpdate: (htmlStr: string) => void
}

interface IState {
  generated: boolean
}

class QualificationAnnouncers extends React.Component<IProps, IState> {
  private _teamMap: Map<number, Team>;

  constructor(props: IProps) {
    super(props);
    this.state = {
      generated: false
    };
    this._teamMap = new Map<number, Team>();
  }

  public componentDidMount() {
    const {qualificationMatches, teamList} = this.props;
    if (qualificationMatches.length <= 0 || teamList.length <= 0) {
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
    const {onHTMLUpdate, eventConfig, qualificationMatches} = this.props;
    const {generated} = this.state;
    const matches = qualificationMatches.map(match => {
      const participants = match.participants.map((participant: MatchParticipant, index: number) => {
        if (typeof this._teamMap.get(participant.teamKey) !== "undefined") {
          const team: Team = this._teamMap.get(participant.teamKey);
          return (
            <Table.Row key={participant.matchParticipantKey}>
              {
                index === 0 &&
                <Table.Cell rowSpan={eventConfig.teamsPerAlliance * 2}>{match.matchName}</Table.Cell>
              }
              <Table.Cell className={participant.station < 20 ? "red-bg" : "blue-bg"}>{team.getFromIdentifier(eventConfig.teamIdentifier)}{participant.surrogate ? "*" : ""}</Table.Cell>
              <Table.Cell>{team.teamNameShort}</Table.Cell>
              <Table.Cell>{team.teamNameLong}</Table.Cell>
              <Table.Cell>{team.location}</Table.Cell>
            </Table.Row>
          );
        } else {
          return (
            <Table.Row key={participant.matchParticipantKey}>
              {
                index === 0 &&
                <Table.Cell rowSpan={eventConfig.teamsPerAlliance * 2}>{match.matchName}</Table.Cell>
              }
              <Table.Cell className={participant.station < 20 ? "red-bg" : "blue-bg"}>{participant.teamKey}{participant.surrogate ? "*" : ""}</Table.Cell>
              <Table.Cell>-</Table.Cell>
              <Table.Cell>-</Table.Cell>
              <Table.Cell>-</Table.Cell>
            </Table.Row>
          );
        }
      });
      return (participants);
    });
    let view = (
      <Table celled={true} structured={true} textAlign="center">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Match</Table.HeaderCell>
            <Table.HeaderCell>Team #</Table.HeaderCell>
            <Table.HeaderCell>Name (Short)</Table.HeaderCell>
            <Table.HeaderCell>Name (Long)</Table.HeaderCell>
            <Table.HeaderCell>Location</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {matches}
        </Table.Body>
      </Table>
    );
    if (qualificationMatches.length <= 0) {
      view = (<span>There are no qualification matches to report.</span>);
    }
    return (
      <ReportTemplate
        children={view}
        generated={generated}
        name={"Qualification Announcer's Report"}
        updateHTML={onHTMLUpdate}
      />
    );
  }
}

export function mapStateToProps({configState, internalState}: IApplicationState) {
  return {
    teamList: internalState.teamList,
    qualificationMatches: internalState.qualificationMatches,
    eventConfig: configState.eventConfiguration
  };
}

export default connect(mapStateToProps)(QualificationAnnouncers);