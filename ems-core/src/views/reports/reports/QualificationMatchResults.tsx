import * as React from "react";
import ReportTemplate from "./ReportTemplate";
import {Table} from "semantic-ui-react";
import {IApplicationState} from "../../../stores";
import {connect} from "react-redux";
import DialogManager from "../../../managers/DialogManager";
import * as moment from "moment";
import {EMSProvider, EventConfiguration, HttpError, Match, Ranking} from "@the-orange-alliance/lib-ems";

interface IProps {
  eventConfig?: EventConfiguration,
  onHTMLUpdate: (htmlStr: string) => void
}

interface IState {
  generated: boolean,
  rankings: Ranking[],
  matches: Match[]
}

class QualificationMatchResults extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      generated: false,
      rankings: [],
      matches: []
    };
  }

  public componentDidMount() {
    EMSProvider.getMatchesByTournamentLevel(1).then((matches: Match[]) => {
      this.setState({generated: true, matches});
    }).catch((error: HttpError) => {
      DialogManager.showErrorBox(error);
      this.setState({generated: true});
    });
  }

  // TODO - We already have game-specific rank tables... Use them?
  public render() {
    const {onHTMLUpdate} = this.props;
    const {generated, matches} = this.state;
    const qualMatches = matches.map(match => {
      return (
        <Table.Row key={match.matchKey}>
          <Table.Cell>{match.matchName}</Table.Cell>
          <Table.Cell>{match.fieldNumber}</Table.Cell>
          <Table.Cell>{(typeof match.redScore !== "undefined" && match.redScore >= 0 && match.redScore.toString() !== "null") ? match.redScore : "NOT PLAYED"}</Table.Cell>
          <Table.Cell>{(typeof match.blueScore !== "undefined" && match.blueScore >= 0 && match.blueScore.toString() !== "null") ? match.blueScore : "NOT PLAYED"}</Table.Cell>
          <Table.Cell>{match.redMinPen ? match.redMinPen : 0}</Table.Cell>
          <Table.Cell>{match.blueMinPen ? match.blueMinPen : 0}</Table.Cell>
        </Table.Row>
      );
    });
    let view = (
      <div>
        <div className="center-items">
          <b><i>Report Generated as of {moment().format("dddd, MMMM Do yyyy, h:mm:ss a")}</i></b>
        </div>
        <Table celled={true} structured={true} textAlign="center">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Match</Table.HeaderCell>
              <Table.HeaderCell>Field</Table.HeaderCell>
              <Table.HeaderCell>Red Score</Table.HeaderCell>
              <Table.HeaderCell>Blue Score</Table.HeaderCell>
              <Table.HeaderCell>Red Penalties</Table.HeaderCell>
              <Table.HeaderCell>Blue Penalties</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {qualMatches}
          </Table.Body>
        </Table>
      </div>
    );
    if (qualMatches.length <= 0) {
      view = (<span>There are no results to report.</span>);
    }
    return (
      <ReportTemplate
        generated={generated}
        name={"Qualification Match Results"}
        updateHTML={onHTMLUpdate}
        children={view}
      />
    );
  }
}

export function mapStateToProps({configState, internalState}: IApplicationState) {
  return {
    eventConfig: configState.eventConfiguration,
    qualificationMatches: internalState.qualificationMatches
  };
}

export default connect(mapStateToProps)(QualificationMatchResults);
