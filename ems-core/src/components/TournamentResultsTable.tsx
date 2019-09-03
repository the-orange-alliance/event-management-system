import * as React from "react";
import {getTheme} from "../AppTheme";
import {Checkbox, Table} from "semantic-ui-react";
import {Ranking, TeamIdentifier} from "@the-orange-alliance/lib-ems";

interface IProps {
  rankings: Ranking[];
  identifier: TeamIdentifier;
  onChange?: (teamKeys: number[]) => void;
}

class TournamentResultsTable extends React.Component<IProps> {
  private _advancingTeams: number[];

  constructor(props: IProps) {
    super(props);
    this._advancingTeams = [];
  }

  public render() {
    const {identifier, rankings} = this.props;
    const rankingsView = rankings.map((r: Ranking) => {
      const displayName = typeof r.team !== undefined ? r.team.getFromIdentifier(identifier) : r.teamKey;
      return (
        <Table.Row key={r.rankKey}>
          <Table.Cell><Checkbox checked={this._advancingTeams.indexOf(r.teamKey) > -1} onChange={this.updateAdvancements.bind(this, r.teamKey)}/></Table.Cell>
          <Table.Cell>{r.rank}</Table.Cell>
          <Table.Cell>{displayName}</Table.Cell>
          <Table.Cell>{r.wins}-{r.losses}-{r.ties}</Table.Cell>
          <Table.Cell>{r.played}</Table.Cell>
        </Table.Row>
      );
    });

    return (
      <Table color={getTheme().secondary} attached={true} celled={true} textAlign="center" columns={16}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={1}>Advancing</Table.HeaderCell>
            <Table.HeaderCell width={1}>Rank</Table.HeaderCell>
            <Table.HeaderCell width={1}>Team #</Table.HeaderCell>
            <Table.HeaderCell width={1}>W-L-T</Table.HeaderCell>
            <Table.HeaderCell>Matches Played</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {rankingsView}
        </Table.Body>
      </Table>
    );
  }

  private updateAdvancements(teamKey: number) {
    const {onChange} = this.props;
    if (this._advancingTeams.indexOf(teamKey) > -1) {
      this._advancingTeams = this._advancingTeams.filter((key: number) => key !== teamKey);
    } else {
      this._advancingTeams.push(teamKey);
    }
    if (typeof onChange !== "undefined") {
      onChange(this._advancingTeams);
    }
    this.forceUpdate();
  }
}

export default TournamentResultsTable;