import * as React from "react";
import {SyntheticEvent} from "react";
import {Tab, TabProps} from "semantic-ui-react";
import {ApplicationActions, IApplicationState} from "../../../stores";
import {connect} from "react-redux";
import SetupScheduleParams from "../../../components/SetupScheduleParams";
import SetupScheduleOverview from "../../../components/SetupScheduleOverview";
import SetupRunMatchMaker from "../../../components/SetupRunMatchMaker";
import SetupMatchScheduleOverview from "../../../components/SetupMatchScheduleOverview";
import {IDisableNavigation, ISetQualificationMatches} from "../../../stores/internal/types";
import {Dispatch} from "redux";
import {disableNavigation, setQualificationMatches} from "../../../stores/internal/actions";
import EventCreationManager from "../../../managers/EventCreationManager";
import DialogManager from "../../../managers/DialogManager";
import {Event, EventConfiguration, HttpError, Match, Schedule, ScheduleItem, Team, TOAConfig} from "@the-orange-alliance/lib-ems";
import SetupScheduleParticipants from "../../../components/SetupScheduleParticipants";
import UploadManager from "../../../managers/UploadManager";

interface IProps {
  onComplete: () => void,
  navigationDisabled?: boolean,
  event?: Event,
  toaConfig?: TOAConfig,
  eventConfig?: EventConfiguration,
  teamList?: Team[],
  schedule?: Schedule,
  qualificationMatches?: Match[],
  setNavigationDisabled?: (disabled?: boolean) => IDisableNavigation,
  setQualificationMatches?: (matches: Match[]) => ISetQualificationMatches
}

interface IState {
  activeIndex: number,
}

class EventQualificationSetup extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      activeIndex: 0
    };
    this.onTabChange = this.onTabChange.bind(this);
    this.onParamsComplete = this.onParamsComplete.bind(this);
    this.onMatchMakerComplete = this.onMatchMakerComplete.bind(this);
    this.onPublishSchedule = this.onPublishSchedule.bind(this);
    this.onParticipantSelectionComplete = this.onParticipantSelectionComplete.bind(this);
  }

  public componentDidMount() {
    this.props.schedule.teamsPerAlliance = this.props.eventConfig.teamsPerAlliance;
    this.forceUpdate();
  }

  public render() {
    return (
      <div className="step-view no-overflow">
        <Tab menu={{secondary: true}} activeIndex={this.state.activeIndex} onTabChange={this.onTabChange} panes={[
          { menuItem: "Schedule Participants", render: () => <SetupScheduleParticipants schedule={this.props.schedule} type={"Qualification"} onComplete={this.onParticipantSelectionComplete}/>},
          { menuItem: "Schedule Parameters", render: () => <SetupScheduleParams schedule={this.props.schedule} teams={this.props.teamList} onComplete={this.onParamsComplete}/>},
          { menuItem: "Schedule Overview", render: () => <SetupScheduleOverview type={"Qualification"}/>},
          { menuItem: "Match Maker Parameters", render: () => <SetupRunMatchMaker schedule={this.props.schedule} teams={this.props.teamList} onComplete={this.onMatchMakerComplete}/>},
          { menuItem: "Match Schedule Overview", render: () => <SetupMatchScheduleOverview type="Qualification" matchList={this.props.qualificationMatches} onComplete={this.onPublishSchedule}/>},
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

  private onParticipantSelectionComplete() {
    this.setState({activeIndex: 1});
  }

  private onParamsComplete(scheduleItems: ScheduleItem[]) {
    this.props.setNavigationDisabled(true);
    EventCreationManager.createSchedule("Qualification", scheduleItems).then(() => {
      this.props.setNavigationDisabled(false);
      this.setState({activeIndex: 1});
    }).catch((error: HttpError) => {
      this.props.setNavigationDisabled(false);
      DialogManager.showErrorBox(error);
    });
  }

  private onMatchMakerComplete(matches: Match[]) {
    this.props.setQualificationMatches(matches);
    this.setState({activeIndex: 3});
  }

  private onPublishSchedule(upload: boolean) {
    this.props.setNavigationDisabled(true);
    if (this.props.toaConfig.enabled && upload) {
      UploadManager.postMatchSchedule(this.props.event.eventKey, this.props.qualificationMatches).then(() => {
        console.log(`${this.props.qualificationMatches.length} matches have been posted to TOA.`);
      }).catch((error: HttpError) => {
        DialogManager.showErrorBox(error);
      });
    }
    EventCreationManager.createMatchSchedule(1, this.props.qualificationMatches).then(() => {
      EventCreationManager.createRanks(this.props.teamList, this.props.event.eventKey).then(() => {
        this.props.setNavigationDisabled(false);
        this.props.onComplete();
      }).catch((rankError: HttpError) => {
        this.props.setNavigationDisabled(false);
        DialogManager.showErrorBox(rankError);
      });
    }).catch((error: HttpError) => {
      this.props.setNavigationDisabled(false);
      DialogManager.showErrorBox(error);
    });
  }

}

export function mapStateToProps({internalState, configState}: IApplicationState) {
  return {
    navigationDisabled: internalState.navigationDisabled,
    teamList: internalState.teamList,
    eventConfig: configState.eventConfiguration,
    toaConfig: configState.toaConfig,
    event: configState.event,
    schedule: configState.qualificationSchedule,
    qualificationMatches: internalState.qualificationMatches
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setNavigationDisabled: (disabled: boolean) => dispatch(disableNavigation(disabled)),
    setQualificationMatches: (matches: Match[]) => dispatch(setQualificationMatches(matches))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventQualificationSetup);