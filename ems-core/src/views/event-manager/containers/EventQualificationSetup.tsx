import * as React from "react";
import {SyntheticEvent} from "react";
import {Tab, TabProps} from "semantic-ui-react";
import {ApplicationActions, IApplicationState} from "../../../stores";
import {connect} from "react-redux";
import SetupScheduleParams from "../../../components/SetupScheduleParams";
import SetupScheduleOverview from "../../../components/SetupScheduleOverview";
import SetupRunMatchMaker from "../../../components/SetupRunMatchMaker";
import SetupMatchScheduleOverview from "../../../components/SetupMatchScheduleOverview";
import Schedule from "../../../shared/models/Schedule";
import Team from "../../../shared/models/Team";
import EventConfiguration from "../../../shared/models/EventConfiguration";
import ScheduleItem from "../../../shared/models/ScheduleItem";
import {IDisableNavigation, ISetQualificationMatches} from "../../../stores/internal/types";
import {Dispatch} from "redux";
import {disableNavigation, setQualificationMatches} from "../../../stores/internal/actions";
import EventPostingController from "../controllers/EventPostingController";
import HttpError from "../../../shared/models/HttpError";
import DialogManager from "../../../shared/managers/DialogManager";
import Match from "../../../shared/models/Match";
import Event from "../../../shared/models/Event";
import TOAUploadManager from "../../../shared/managers/TOAUploadManager";
import TOAConfig from "../../../shared/models/TOAConfig";

interface IProps {
  onComplete: () => void,
  navigationDisabled?: boolean,
  event: Event,
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
  }

  public componentDidMount() {
    this.props.schedule.teamsPerAlliance = this.props.eventConfig.teamsPerAlliance;
    this.props.schedule.teamsParticipating = this.props.teamList.length;
    this.forceUpdate();
  }

  public componentDidUpdate(prevProps: IProps) {
    if (prevProps.teamList.length !== this.props.teamList.length) {
      this.props.schedule.teamsParticipating = this.props.teamList.length;
      this.forceUpdate();
    }
  }

  public render() {
    return (
      <div className="step-view no-overflow">
        <Tab menu={{secondary: true}} activeIndex={this.state.activeIndex} onTabChange={this.onTabChange} panes={[
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

  private onParamsComplete(scheduleItems: ScheduleItem[]) {
    this.props.setNavigationDisabled(true);
    EventPostingController.createSchedule("Qualification", scheduleItems).then(() => {
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

  private onPublishSchedule() {
    this.props.setNavigationDisabled(true);
    if (this.props.toaConfig.enabled) {
      TOAUploadManager.postMatchSchedule(this.props.event.eventKey, this.props.qualificationMatches).then(() => {
        console.log(`${this.props.qualificationMatches.length} matches have been posted to TOA.`);
      }).catch((error: HttpError) => {
        DialogManager.showErrorBox(error);
      });
    }
    EventPostingController.createMatchSchedule(1, this.props.qualificationMatches).then(() => {
      EventPostingController.createRanks(this.props.teamList, this.props.event.eventKey).then(() => {
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