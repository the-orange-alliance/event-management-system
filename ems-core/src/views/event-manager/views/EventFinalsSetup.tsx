import * as React from "react";
import {Tab, TabProps} from "semantic-ui-react";
import {SyntheticEvent} from "react";
import {ApplicationActions, IApplicationState} from "../../../stores";
import SetupRankingsOverview from "../../../components/SetupRankingsOverview";
import SetupScheduleParams from "../../../components/SetupScheduleParams";
import EventCreationManager from "../../../managers/EventCreationManager";
import DialogManager from "../../../managers/DialogManager";
import {IDisableNavigation, IAddPlayoffsMatches} from "../../../stores/internal/types";
import {Dispatch} from "redux";
import {disableNavigation, addPlayoffsMatches} from "../../../stores/internal/actions";
import {connect} from "react-redux";
import SetupScheduleOverview from "../../../components/SetupScheduleOverview";
import SetupRunMatchMaker from "../../../components/SetupRunMatchMaker";
import SetupMatchScheduleOverview from "../../../components/SetupMatchScheduleOverview";
import {
  Event, EventConfiguration, HttpError, Match, RankingMatchesFormat, Schedule, ScheduleItem,
  Team
} from "@the-orange-alliance/lib-ems";

interface IProps {
  onComplete: () => void,
  navigationDisabled?: boolean,
  event?: Event,
  eventConfig?: EventConfiguration,
  teamList?: Team[],
  schedule?: Schedule,
  finalsMatches?: Match[],
  setNavigationDisabled?: (disabled?: boolean) => IDisableNavigation,
  addPlayoffsMatches: (matches: Match[]) => IAddPlayoffsMatches
}

interface IState {
  activeIndex: number,
  qualifiedTeams: Team[]
}

class EventFinalsSetup extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      activeIndex: 0,
      qualifiedTeams: []
    };
    this.onTabChange = this.onTabChange.bind(this);
    this.onParamsComplete = this.onParamsComplete.bind(this);
    this.onMatchMakerComplete = this.onMatchMakerComplete.bind(this);
    this.onPublishSchedule = this.onPublishSchedule.bind(this);
  }

  public componentDidMount() {
    const tournamentRound = Array.isArray(this.props.eventConfig.tournament) ? this.props.eventConfig.tournament[0] : this.props.eventConfig.tournament; // TODO - CHANGE
    this.props.schedule.teamsPerAlliance = tournamentRound.format.teamsPerAlliance;
    this.props.schedule.teamsParticipating = (tournamentRound.format as RankingMatchesFormat).rankingCutoff;
    this.setState({qualifiedTeams: this.props.teamList.slice(0, (tournamentRound.format as RankingMatchesFormat).rankingCutoff)});
    this.forceUpdate();
  }

  public render() {
    return (
      <div className="step-view no-overflow">
        <Tab menu={{secondary: true}} activeIndex={this.state.activeIndex} onTabChange={this.onTabChange} panes={[
          { menuItem: "Finals Participants", render: () => <SetupRankingsOverview/>},
          { menuItem: "Schedule Parameters", render: () => <SetupScheduleParams schedule={this.props.schedule} teams={this.state.qualifiedTeams} onComplete={this.onParamsComplete}/>},
          { menuItem: "Schedule Overview", render: () => <SetupScheduleOverview type={"Ranking"}/>},
          { menuItem: "Match Maker Parameters", render: () => <SetupRunMatchMaker schedule={this.props.schedule} teams={this.state.qualifiedTeams} onComplete={this.onMatchMakerComplete}/>},
          { menuItem: "Match Schedule Overview", render: () => <SetupMatchScheduleOverview type="Ranking" matchList={this.props.finalsMatches} onComplete={this.onPublishSchedule}/>},
        ]}
        />
      </div>
    );
  }

  private onTabChange(event: SyntheticEvent, props: TabProps) {
    const tournamentRound = Array.isArray(this.props.eventConfig.tournament) ? this.props.eventConfig.tournament[0] : this.props.eventConfig.tournament; // TODO - CHANGE
    if (!this.props.navigationDisabled && typeof (tournamentRound.format as RankingMatchesFormat).rankingCutoff !== "undefined") {
      this.setState({activeIndex: parseInt(props.activeIndex as string, 10)});
    }
  }

  private onParamsComplete(scheduleItems: ScheduleItem[]) {
    this.props.setNavigationDisabled(true);
    EventCreationManager.createSchedule("Ranking", scheduleItems).then(() => {
      this.props.setNavigationDisabled(false);
      this.setState({activeIndex: 2});
    }).catch((error: HttpError) => {
      this.props.setNavigationDisabled(false);
      DialogManager.showErrorBox(error);
    });
  }

  private onMatchMakerComplete(matches: Match[]) {
    this.props.addPlayoffsMatches(matches);
    this.setState({activeIndex: 4});
  }

  private onPublishSchedule() {
    this.props.setNavigationDisabled(true);
    EventCreationManager.deleteRanks().then(() => {
      EventCreationManager.createMatchSchedule(6, this.props.finalsMatches).then(() => {
        EventCreationManager.createRanks(this.state.qualifiedTeams, this.props.event.eventKey).then(() => {
          this.props.setNavigationDisabled(false);
          this.props.onComplete();
        }).catch((rankError: HttpError) => {
          this.props.setNavigationDisabled(false);
          DialogManager.showErrorBox(rankError);
        });
      }).catch((schedError: HttpError) => {
        this.props.setNavigationDisabled(false);
        DialogManager.showErrorBox(schedError);
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
    event: configState.event,
    schedule: configState.finalsSchedule,
    playoffsMatches: internalState.playoffsMatches
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setNavigationDisabled: (disabled: boolean) => dispatch(disableNavigation(disabled)),
    addPlayoffsMatches: (matches: Match[]) => dispatch(addPlayoffsMatches(matches))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventFinalsSetup);