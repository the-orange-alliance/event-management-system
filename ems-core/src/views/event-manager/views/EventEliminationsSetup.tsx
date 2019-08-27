import * as React from "react";
import {Tab, TabProps} from "semantic-ui-react";
import {SyntheticEvent} from "react";
import {ApplicationActions, IApplicationState} from "../../../stores";
import {connect} from "react-redux";
import SetupElimsScheduleParams from "../../../components/SetupElimsScheduleParams";
import EventCreationManager from "../../../managers/EventCreationManager";
import DialogManager from "../../../managers/DialogManager";
import {IDisableNavigation, IAddPlayoffsMatches} from "../../../stores/internal/types";
import {Dispatch} from "redux";
import {disableNavigation, addPlayoffsMatches} from "../../../stores/internal/actions";
import SetupScheduleOverview from "../../../components/SetupScheduleOverview";
import SetupElimsRunMatchMaker from "../../../components/SetupElimsRunMatchMaker";
import SetupMatchScheduleOverview from "../../../components/SetupMatchScheduleOverview";
import TOAUploadManager from "../../../managers/TOAUploadManager";
import {
  EliminationMatchesFormat, EliminationsSchedule, Event, EventConfiguration, HttpError, Match, ScheduleItem,
  TOAConfig
} from "@the-orange-alliance/lib-ems";

interface IProps {
  onComplete: () => void,
  event?: Event,
  eventConfig?: EventConfiguration,
  toaConfig?: TOAConfig,
  navigationDisabled?: boolean,
  schedule?: EliminationsSchedule,
  playoffsMatches?: Match[],
  setNavigationDisabled?: (disabled: boolean) => IDisableNavigation,
  addPlayoffsMatches?: (matches: Match[]) => IAddPlayoffsMatches
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
    const tournamentRound = Array.isArray(this.props.eventConfig.tournament) ? this.props.eventConfig.tournament[0] : this.props.eventConfig.tournament; // TODO - CHANGE
    this.props.schedule.teamsPerAlliance = tournamentRound.format.teamsPerAlliance;
    this.props.schedule.allianceCaptains = (tournamentRound.format as EliminationMatchesFormat).alliances;
    this.props.schedule.eliminationsFormat = (tournamentRound.format as EliminationMatchesFormat).seriesType;
    this.onTabChange = this.onTabChange.bind(this);
    this.onParamsComplete = this.onParamsComplete.bind(this);
    this.onMatchMakerComplete = this.onMatchMakerComplete.bind(this);
    this.onPublishSchedule = this.onPublishSchedule.bind(this);
  }

  public render() {
    const {activeIndex} = this.state;
    const {schedule, playoffsMatches} = this.props;
    return (
      <div className="step-view no-overflow">
        <Tab menu={{secondary: true}} activeIndex={activeIndex} onTabChange={this.onTabChange} panes={[
          { menuItem: "Schedule Parameters", render: () => <SetupElimsScheduleParams onComplete={this.onParamsComplete} schedule={schedule}/>},
          { menuItem: "Schedule Overview", render: () => <SetupScheduleOverview type={"Eliminations"}/>},
          { menuItem: "Match Maker Parameters", render: () => <SetupElimsRunMatchMaker schedule={schedule} onComplete={this.onMatchMakerComplete}/>},
          { menuItem: "Match Schedule Overview", render: () => <SetupMatchScheduleOverview type="Eliminations" matchList={playoffsMatches} onComplete={this.onPublishSchedule}/>},
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
    this.props.addPlayoffsMatches(matches);
    this.setState({activeIndex: 3});
  }

  private onPublishSchedule() {
    this.props.setNavigationDisabled(true);
    if (this.props.toaConfig.enabled) {
      TOAUploadManager.postMatchSchedule(this.props.event.eventKey, this.props.playoffsMatches).then(() => {
        console.log(`${this.props.playoffsMatches.length} matches have been posted to TOA.`);
      }).catch((error: HttpError) => {
        DialogManager.showErrorBox(error);
      });
    }
    EventCreationManager.createElimsSchedule(this.props.playoffsMatches).then(() => {
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
    playoffsSchedule: configState.playoffsSchedule, // TODO - THIS NEEDS TO CHANGE HOW DO I EVEN HANDLE THIS HELP
    playoffsMatches: internalState.playoffsMatches
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setNavigationDisabled: (disabled: boolean) => dispatch(disableNavigation(disabled)),
    addPlayoffsMatches: (matches: Match[]) => dispatch(addPlayoffsMatches(matches))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventEliminationsSetup);