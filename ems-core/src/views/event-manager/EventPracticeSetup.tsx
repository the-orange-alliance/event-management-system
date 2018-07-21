import * as React from "react";
import {SyntheticEvent} from "react";
import {Tab, TabProps} from "semantic-ui-react";
import {IApplicationState} from "../../stores";
import {connect} from "react-redux";
import SetupScheduleParams from "../../components/SetupScheduleParams";
import SetupScheduleOverview from "../../components/SetupScheduleOverview";
import SetupRunMatchMaker from "../../components/SetupRunMatchMaker";
import SetupMatchScheduleOverview from "../../components/SetupMatchScheduleOverview";

interface IProps {
  navigationDisabled?: boolean
}

interface IState {
  activeIndex: number
}

class EventPracticeSetup extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      activeIndex: 0
    };
    this.onTabChange = this.onTabChange.bind(this);
  }

  public render() {
    return (
      <div className="step-view">
        <Tab menu={{secondary: true}} activeIndex={this.state.activeIndex} onTabChange={this.onTabChange} panes={[
          { menuItem: "Schedule Parameters", render: () => <SetupScheduleParams type="Practice"/>},
          { menuItem: "Schedule Overview", render: () => <SetupScheduleOverview/>},
          { menuItem: "Match Maker", render: () => <SetupRunMatchMaker/>},
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

export function mapStateToProps({internalState}: IApplicationState) {
  return {
    navigationDisabled: internalState.navigationDisabled
  };
}

export default connect(mapStateToProps)(EventPracticeSetup);