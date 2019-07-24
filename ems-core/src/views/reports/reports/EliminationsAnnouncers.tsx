import * as React from "react";
import ReportTemplate from "./ReportTemplate";
import {IApplicationState} from "../../../stores";
import {connect} from "react-redux";
import {Table} from "semantic-ui-react";
import {
  EliminationMatchesFormat, EventConfiguration, Match, MatchParticipant,
  Team
} from "@the-orange-alliance/lib-ems";

interface IProps {
  teamList?: Team[],
  eliminationsMatches?: Match[],
  eventConfig?: EventConfiguration,
  onHTMLUpdate: (htmlStr: string) => void
}

interface IState {
  generated: boolean
}

class EliminationsAnnouncers extends React.Component<IProps, IState> {
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
    const tournamentRound = Array.isArray(this.props.eventConfig.tournament) ? this.props.eventConfig.tournament[0] : this.props.eventConfig.tournament; // TODO - CHANGE
    const matches = eliminationsMatches.map(match => {
      const participants = match.participants.map((participant: MatchParticipant, index: number) => {
        if (typeof this._teamMap.get(participant.teamKey) !== "undefined") {
          const team: Team = this._teamMap.get(participant.teamKey);
          return (
            <Table.Row key={participant.matchParticipantKey}>
              {
                index === 0 &&
                <Table.Cell rowSpan={(tournamentRound.format as EliminationMatchesFormat).teamsPerAlliance * 2}>{match.matchName}</Table.Cell>
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
                <Table.Cell rowSpan={(tournamentRound.format as EliminationMatchesFormat).teamsPerAlliance * 2}>{match.matchName}</Table.Cell>
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
    if (eliminationsMatches.length <= 0) {
      view = (<span>There are no eliminations matches to report.</span>);
    }
    return (
      <ReportTemplate
        children={view}
        generated={generated}
        name={"Eliminations Announcer's Report"}
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

export default connect(mapStateToProps)(EliminationsAnnouncers);