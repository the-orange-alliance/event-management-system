import * as React from "react";
import Team from "../../../shared/models/Team";
import EventConfiguration from "../../../shared/models/EventConfiguration";
import ReportTemplate from "./ReportTemplate";
import EMSProvider from "../../../shared/providers/EMSProvider";
import {AxiosResponse} from "axios";
import HttpError from "../../../shared/models/HttpError";
import DialogManager from "../../../shared/managers/DialogManager";
import Ranking from "../../../shared/models/Ranking";
import {Table} from "semantic-ui-react";
import {IApplicationState} from "../../../stores";
import {connect} from "react-redux";

interface IProps {
  eventConfig?: EventConfiguration,
  onHTMLUpdate: (htmlStr: string) => void
}

interface IState {
  generated: boolean,
  rankings: Ranking[]
}

class QualificationRankings extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      generated: false,
      rankings: []
    };
  }

  public componentDidMount() {
    EMSProvider.getRankingTeams().then((rankRes: AxiosResponse) => {
      const rankings: Ranking[] = [];
      if (rankRes.data && rankRes.data.payload && rankRes.data.payload.length > 0) {
        for (const rankJSON of rankRes.data.payload) {
          const rank: Ranking = new Ranking().fromJSON(rankJSON);
          rank.team = new Team().fromJSON(rankJSON);
          rankings.push(rank);
        }
      }
      this.setState({generated: true, rankings: rankings});
    }).catch((error: HttpError) => {
      DialogManager.showErrorBox(error);
      this.setState({generated: true});
    });
  }

  // TODO - We already have game-specific rank tables... Use them?
  public render() {
    const {onHTMLUpdate, eventConfig} = this.props;
    const {generated, rankings} = this.state;
    const ranks = rankings.map(ranking => {
      return (
        <Table.Row key={ranking.rankKey}>
          <Table.Cell>{ranking.rank}</Table.Cell>
          <Table.Cell>{ranking.team.getFromIdentifier(eventConfig.teamIdentifier)}</Table.Cell>
          <Table.Cell>{ranking.played}</Table.Cell>
        </Table.Row>
      );
    });
    let view = (
      <Table celled={true} structured={true} textAlign="center">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Rank</Table.HeaderCell>
            <Table.HeaderCell>Team</Table.HeaderCell>
            <Table.HeaderCell>Matches Played</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {ranks}
        </Table.Body>
      </Table>
    );
    if (rankings.length <= 0) {
      view = (<span>There are no rankings to report.</span>);
    }
    return (
      <ReportTemplate
        generated={generated}
        name={"Qualification Rankings"}
        updateHTML={onHTMLUpdate}
        children={view}
      />
    );
  }
}

export function mapStateToProps({configState}: IApplicationState) {
  return {
    eventConfig: configState.eventConfiguration
  };
}

export default connect(mapStateToProps)(QualificationRankings);