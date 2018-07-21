import * as React from "react";
import {Table} from "semantic-ui-react";
import {getTheme} from "../shared/AppTheme";
import {TournamentLevels} from "../shared/AppTypes";
import EventConfiguration from "../shared/models/EventConfiguration";
import {IApplicationState} from "../stores";
import {connect} from "react-redux";

interface IProps {
  type: TournamentLevels,
  eventConfig?: EventConfiguration
}

class SetupMatchScheduleOverview extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const tpa = (this.props.type === "Qualification" || this.props.type === "Practice") ? this.props.eventConfig.teamsPerAlliance : this.props.eventConfig.postQualTeamsPerAlliance;

    const redLabels = [];
    for (let i = 0; i < tpa; i++) {
      redLabels.push(
        <Table.HeaderCell key={i + "-red"} width={2}>Red {i + 1}</Table.HeaderCell>
      );
    }

    const blueLabels = [];
    for (let i = 0; i < tpa; i++) {
      blueLabels.push(
        <Table.HeaderCell key={i + "-blue"} width={2}>Blue {i + 1}</Table.HeaderCell>
      );
    }

    return (
      <div className="step-view-tab">
        <Table color={getTheme().secondary} attached={true} celled={true} selectable={true} textAlign="center" columns={16}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={2}>Match</Table.HeaderCell>
              <Table.HeaderCell width={2}>Field</Table.HeaderCell>
              {redLabels}
              {blueLabels}
            </Table.Row>
          </Table.Header>
        </Table>
      </div>
    );
  }
}

export function mapStateToProps({configState}: IApplicationState) {
  return {
    eventConfig: configState.eventConfiguration
  };
}

export default connect(mapStateToProps)(SetupMatchScheduleOverview);