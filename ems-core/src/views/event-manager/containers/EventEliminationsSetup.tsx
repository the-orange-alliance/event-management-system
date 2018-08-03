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
import {IDisableNavigation, ISetEliminationsMatches} from "../../../stores/internal/types";
import {Dispatch} from "redux";
import {disableNavigation, setEliminationsMatches} from "../../../stores/internal/actions";
import EliminationsSchedule from "../../../shared/models/EliminationsSchedule";
import SetupScheduleOverview from "../../../components/SetupScheduleOverview";
import SetupElimsRunMatchMaker from "../../../components/SetupElimsRunMatchMaker";
import Match from "../../../shared/models/Match";
import SetupMatchScheduleOverview from "../../../components/SetupMatchScheduleOverview";

interface IProps {
  onComplete: () => void,
  eventConfig?: EventConfiguration,
  navigationDisabled?: boolean,
  schedule?: EliminationsSchedule,
  elimsMatches?: Match[],
  setNavigationDisabled?: (disabled: boolean) => IDisableNavigation,
  setEliminationsMatches?: (matches: Match[]) => ISetEliminationsMatches
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
    this.onMatchMakerComplete = this.onMatchMakerComplete.bind(this);
    this.onPublishSchedule = this.onPublishSchedule.bind(this);
  }

  public render() {
    return (
      <div className="step-view no-overflow">
        <Tab menu={{secondary: true}} activeIndex={this.state.activeIndex} onTabChange={this.onTabChange} panes={[
          { menuItem: "Schedule Parameters", render: () => <SetupElimsScheduleParams onComplete={this.onParamsComplete} schedule={this.props.schedule}/>},
          { menuItem: "Schedule Overview", render: () => <SetupScheduleOverview type={"Eliminations"}/>},
          { menuItem: "Match Maker Parameters", render: () => <SetupElimsRunMatchMaker schedule={this.props.schedule} onComplete={this.onMatchMakerComplete}/>},
          { menuItem: "Match Schedule Overview", render: () => <SetupMatchScheduleOverview type="Eliminations" matchList={this.props.elimsMatches} onComplete={this.onPublishSchedule}/>},
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

  private onMatchMakerComplete(matches: Match[]) {
    this.props.setEliminationsMatches(matches);
    this.setState({activeIndex: 3});
  }

  private onPublishSchedule() {
    this.props.setNavigationDisabled(true);
    EventPostingController.createElimsSchedule(this.props.elimsMatches).then(() => {
      this.props.setNavigationDisabled(false);
      this.props.onComplete();
    }).catch((error: HttpError) => {
      console.log(error);
      this.props.setNavigationDisabled(false);
      DialogManager.showErrorBox(error);
    });
  }
}

export function mapStateToProps({internalState, configState}: IApplicationState) {
  return {
    navigationDisabled: internalState.navigationDisabled,
    eventConfig: configState.eventConfiguration,
    schedule: configState.eliminationsSchedule,
    elimsMatches: internalState.eliminationsMatches
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setNavigationDisabled: (disabled: boolean) => dispatch(disableNavigation(disabled)),
    setEliminationsMatches: (matches: Match[]) => dispatch(setEliminationsMatches(matches))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventEliminationsSetup);