import * as React from "react";
import {Tab, TabProps} from "semantic-ui-react";
import EventConfiguration from "../../../shared/models/EventConfiguration";
import {SyntheticEvent} from "react";
import {ApplicationActions, IApplicationState} from "../../../stores";
import {connect} from "react-redux";
import SetupElimsScheduleParams from "../../../components/SetupElimsScheduleParams";
import ScheduleItem from "../../../shared/models/ScheduleItem";
import EventPostingController from "../controllers/EventPostingController";
import HttpError from "../../../shared/models/HttpError";
import DialogManager from "../../../shared/managers/DialogManager";
import {IDisableNavigation} from "../../../stores/internal/types";
import {Dispatch} from "redux";
import {disableNavigation} from "../../../stores/internal/actions";
import EliminationsSchedule from "../../../shared/models/EliminationsSchedule";
import SetupScheduleOverview from "../../../components/SetupScheduleOverview";

interface IProps {
  eventConfig?: EventConfiguration,
  navigationDisabled?: boolean,
  schedule?: EliminationsSchedule,
  setNavigationDisabled?: (disabled: boolean) => IDisableNavigation
}

interface IState {
  activeIndex: number
}

class EventEliminationsSetup extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      activeIndex: 0
    };
    this.props.schedule.teamsPerAlliance = this.props.eventConfig.postQualTeamsPerAlliance;
    this.props.schedule.allianceCaptains = this.props.eventConfig.allianceCaptains;
    this.onTabChange = this.onTabChange.bind(this);
    this.onParamsComplete = this.onParamsComplete.bind(this);
  }

  public render() {
    return (
      <div className="step-view no-overflow">
        <Tab menu={{secondary: true}} activeIndex={this.state.activeIndex} onTabChange={this.onTabChange} panes={[
          { menuItem: "Schedule Parameters", render: () => <SetupElimsScheduleParams onComplete={this.onParamsComplete} schedule={this.props.schedule}/>},
          { menuItem: "Schedule Overview", render: () => <SetupScheduleOverview type={"Eliminations"}/>},
          { menuItem: "Match Maker Parameters", render: () => <span/>},
          { menuItem: "Match Schedule Overview", render: () => <span/>}
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

  private onParamsComplete(scheduleItems: ScheduleItem[]) {
    this.props.setNavigationDisabled(true);
    EventPostingController.createSchedule("Eliminations", scheduleItems).then(() => {
      this.props.setNavigationDisabled(false);
      this.setState({activeIndex: 1});
    }).catch((error: HttpError) => {
      this.props.setNavigationDisabled(false);
      DialogManager.showErrorBox(error);
    });
  }
}

export function mapStateToProps({internalState, configState}: IApplicationState) {
  return {
    navigationDisabled: internalState.navigationDisabled,
    eventConfig: configState.eventConfiguration,
    schedule: configState.eliminationsSchedule
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setNavigationDisabled: (disabled: boolean) => dispatch(disableNavigation(disabled)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventEliminationsSetup);