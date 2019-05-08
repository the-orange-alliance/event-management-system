import * as React from "react";
import {Tab, TabProps} from "semantic-ui-react";
import {SyntheticEvent} from "react";
import {ApplicationActions, IApplicationState} from "../../../stores";
import {connect} from "react-redux";
import SetupElimsScheduleParams from "../../../components/SetupElimsScheduleParams";
import EventCreationManager from "../../../managers/EventCreationManager";
import DialogManager from "../../../managers/DialogManager";
import {IDisableNavigation, ISetEliminationsMatches} from "../../../stores/internal/types";
import {Dispatch} from "redux";
import {disableNavigation, setEliminationsMatches} from "../../../stores/internal/actions";
import SetupScheduleOverview from "../../../components/SetupScheduleOverview";
import SetupElimsRunMatchMaker from "../../../components/SetupElimsRunMatchMaker";
import SetupMatchScheduleOverview from "../../../components/SetupMatchScheduleOverview";
import TOAUploadManager from "../../../managers/TOAUploadManager";
import {EliminationsSchedule, Event, EventConfiguration, HttpError, Match, ScheduleItem, TOAConfig} from "@the-orange-alliance/lib-ems";

interface IProps {
  onComplete: () => void,
  event?: Event,
  eventConfig?: EventConfiguration,
  toaConfig?: TOAConfig,
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
    this.props.schedule.eliminationsFormat = this.props.eventConfig.elimsFormat;
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
    EventCreationManager.createSchedule("Eliminations", scheduleItems).then(() => {
      this.props.setNavigationDisabled(false);
      this.setState({activeIndex: 1});
    }).catch((error: HttpError) => {
      this.props.setNavigationDisabled(false);
      DialogManager.showErrorBox(error);
    });
  }

  private onMatchMakerComplete(matches: Match[]) {
    this.props.setEliminationsMatches(matches);
    console.log(matches);
    this.setState({activeIndex: 3});
  }

  private onPublishSchedule() {
    this.props.setNavigationDisabled(true);
    if (this.props.toaConfig.enabled) {
      TOAUploadManager.postMatchSchedule(this.props.event.eventKey, this.props.elimsMatches).then(() => {
        console.log(`${this.props.elimsMatches.length} matches have been posted to TOA.`);
      }).catch((error: HttpError) => {
        DialogManager.showErrorBox(error);
      });
    }
    EventCreationManager.createElimsSchedule(this.props.elimsMatches).then(() => {
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
    event: configState.event,
    eventConfig: configState.eventConfiguration,
    toaConfig: configState.toaConfig,
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