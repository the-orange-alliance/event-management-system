import * as React from "react";
import Team from "../../../shared/models/Team";
import EventConfiguration from "../../../shared/models/EventConfiguration";
import ReportTemplate from "./ReportTemplate";
import EMSProvider from "../../../shared/providers/EMSProvider";
import {AxiosResponse} from "axios";
import HttpError from "../../../shared/models/HttpError";
import DialogManager from "../../../shared/managers/DialogManager";
import {Table} from "semantic-ui-react";

interface IProps {
  eventConfig?: EventConfiguration,
  onHTMLUpdate: (htmlStr: string) => void
}

interface IState {
  generated: boolean,
  teams: Team[]
}

class OtherCompetingTeams extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      generated: false,
      teams: []
    };
  }

  public componentDidMount() {
    EMSProvider.getTeams().then((teamRes: AxiosResponse) => {
      const teams: Team[] = [];
      if (teamRes.data && teamRes.data.payload && teamRes.data.payload.length > 0) {
        for (const teamJSON of teamRes.data.payload) {
          teams.push(new Team().fromJSON(teamJSON));
        }
      }
      this.setState({generated: true, teams: teams});
    }).catch((error: HttpError) => {
      DialogManager.showErrorBox(error);
      this.setState({generated: true});
    });
  }

  // TODO - We already have game-specific rank tables... Use them?
  public render() {
    const {onHTMLUpdate} = this.props;
    const {generated, teams} = this.state;
    const teamsView = teams.map(team => {
      return (
        <Table.Row key={team.teamKey}>
          <Table.Cell>{team.teamKey}</Table.Cell>
          <Table.Cell>{team.teamNameShort}</Table.Cell>
          <Table.Cell>{team.teamNameLong}</Table.Cell>
          <Table.Cell>{team.robotName}</Table.Cell>
          <Table.Cell>{team.location}</Table.Cell>
          <Table.Cell>{team.country}</Table.Cell>
          <Table.Cell>{team.countryCode}</Table.Cell>
        </Table.Row>
      );
    });
    let view = (
      <Table celled={true} structured={true} textAlign="center">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Team ID</Table.HeaderCell>
            <Table.HeaderCell>Name (Short)</Table.HeaderCell>
            <Table.HeaderCell>Name (Long)</Table.HeaderCell>
            <Table.HeaderCell>Robot Name</Table.HeaderCell>
            <Table.HeaderCell>Location</Table.HeaderCell>
            <Table.HeaderCell>Country</Table.HeaderCell>
            <Table.HeaderCell>ISO 2 Code</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {teamsView}
        </Table.Body>
      </Table>
    );
    if (teams.length <= 0) {
      view = (<span>There are no teams to report.</span>);
    }
    return (
      <ReportTemplate
        generated={generated}
        name={"Competing Teams"}
        updateHTML={onHTMLUpdate}
        children={view}
      />
    );
  }
}

export default OtherCompetingTeams;