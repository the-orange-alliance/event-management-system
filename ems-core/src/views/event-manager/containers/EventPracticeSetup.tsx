import * as React from "react";
import {SyntheticEvent} from "react";
import {Tab, TabProps} from "semantic-ui-react";
import {IApplicationState} from "../../../stores";
import {connect} from "react-redux";
import SetupScheduleParams from "../../../components/SetupScheduleParams";
import SetupScheduleOverview from "../../../components/SetupScheduleOverview";
import SetupRunMatchMaker from "../../../components/SetupRunMatchMaker";
import SetupMatchScheduleOverview from "../../../components/SetupMatchScheduleOverview";
import Schedule from "../../../shared/models/Schedule";
import Team from "../../../shared/models/Team";
import EventConfiguration from "../../../shared/models/EventConfiguration";

interface IProps {
  navigationDisabled?: boolean,
  eventConfig?: EventConfiguration,
  teamList?: Team[]
}

interface IState {
  activeIndex: number,
  schedule: Schedule
}

class EventPracticeSetup extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      activeIndex: 0,
      schedule: new Schedule("Practice")
    };
    this.onTabChange = this.onTabChange.bind(this);
  }

  public componentDidMount() {
    this.state.schedule.teamsPerAlliance = this.props.eventConfig.teamsPerAlliance;
    this.state.schedule.teamsParticipating = this.props.teamList.length;
    this.forceUpdate();
  }

  public componentDidUpdate(prevProps: IProps) {
    if (prevProps.teamList.length !== this.props.teamList.length) {
      this.state.schedule.teamsParticipating = this.props.teamList.length;
      this.forceUpdate();
    }
  }

  public render() {
    return (
      <div className="step-view">
        <Tab menu={{secondary: true}} activeIndex={this.state.activeIndex} onTabChange={this.onTabChange} panes={[
          { menuItem: "Schedule Parameters", render: () => <SetupScheduleParams schedule={this.state.schedule}/>},
          { menuItem: "Schedule Overview", render: () => <SetupScheduleOverview/>},
          { menuItem: "Match Maker Parameters", render: () => <SetupRunMatchMaker/>},
          { menuItem: "Match Schedule Overview", render: () => <SetupMatchScheduleOverview type="Practice"/>},
        ]}
        />
      </div>
    );
  }

  private onTabChange(event: SyntheticEvent, props: TabProps) {
    if (!this.props.navigationDisabled) {
      this.setState({activeIndex: parseInt(props.activeIndex as string, 10)});
    }
  }

}

export function mapStateToProps({internalState, configState}: IApplicationState) {
  return {
    navigationDisabled: internalState.navigationDisabled,
    teamList: internalState.teamList,
    eventConfig: configState.eventConfiguration
  };
}

export default connect(mapStateToProps)(EventPracticeSetup);