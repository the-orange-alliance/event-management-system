import * as React from "react";
import {IDisableNavigation} from "../../../stores/internal/types";
import {
  AppError, Event, EventConfiguration, EliminationsSchedule, HttpError, RoundRobinSchedule, Schedule,
  PlayoffsType, TOAConfig, Match, TournamentType
} from "@the-orange-alliance/lib-ems";
import {ApplicationActions, IApplicationState} from "../../../stores";
import {disableNavigation} from "../../../stores/internal/actions";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {Card, Tab, TabProps} from "semantic-ui-react";
import {SyntheticEvent} from "react";
import {Team, TournamentRound} from "@the-orange-alliance/lib-ems";
import TournamentRoundCard from "../../../components/TournamentRoundCard";
import {CONFIG_STORE} from "../../../AppStore";
import DialogManager from "../../../managers/DialogManager";
import TournamentParticipantSelection from "../../../components/TournamentParticipantSelection";
import TournamentScheduleSetup from "../../../components/TournamentScheduleSetup";
import {IAddPlayoffsSchedule} from "../../../stores/config/types";
import {addPlayoffsSchedule} from "../../../stores/config/actions";
import TournamentScheduleOverview from "../../../components/TournamentScheduleOverview";
import TournamentMatchMakerParams from "../../../components/TournamentMatchMakerParams";
import SetupMatchScheduleOverview from "../../../components/SetupMatchScheduleOverview";
import UploadManager from "../../../managers/UploadManager";
import EventCreationManager from "../../../managers/EventCreationManager";

interface IProps {
  onComplete: () => void,
  playoffsSchedule: Schedule[],
  playoffsMatches: Match[],
  eventConfig?: EventConfiguration,
  event?: Event,
  teams?: Team[],
  toaConfig?: TOAConfig,
  navigationDisabled?: boolean,
  setNavigationDisabled?: (disabled: boolean) => IDisableNavigation,
  addSchedule?: (schedule: Schedule) => IAddPlayoffsSchedule
}

interface IState {
  activeIndex: number
}

class EventAdvancementView extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      activeIndex: 0
    };

    this.renderTournamentOverview  = this.renderTournamentOverview.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.onPublishSchedule = this.onPublishSchedule.bind(this);
    this.onAdvanceTeams = this.onAdvanceTeams.bind(this);
  }

  public componentDidMount() {
    this.initSchedules();
  }

  public render() {
    const {eventConfig, playoffsMatches} = this.props;
    const {activeIndex} = this.state;

    let activeTournament: TournamentRound;
    if (Array.isArray(eventConfig.tournament)) {
      const rounds = eventConfig.tournament.filter((r: TournamentRound) => r.id === eventConfig.activeTournamentID);
      if (rounds.length > 0) {
        activeTournament = rounds[0];
      }
    } else {
      if (eventConfig.tournament.id === eventConfig.activeTournamentID) {
        activeTournament = eventConfig.tournament;
      }
    }

    return (
      <div className={"step-view no-overflow"}>
        <Tab menu={{secondary: true}} activeIndex={activeIndex} onTabChange={this.onTabChange} panes={[
          { menuItem: "Tournament Overview", render: this.renderTournamentOverview },
          { menuItem: "Participants", render: ()=> <TournamentParticipantSelection/> },
          { menuItem: "Schedule Parameters", render: ()=> <TournamentScheduleSetup/> },
          { menuItem: "Schedule Overview", render: ()=> <TournamentScheduleOverview/> },
          { menuItem: "Match Maker Parameters", render: () => <TournamentMatchMakerParams/> },
          { menuItem: "Match Schedule Overview", render: () => <SetupMatchScheduleOverview type={this.getTypeFromTournament(activeTournament ? activeTournament.type : "elims")} matchList={playoffsMatches} tournamentRound={activeTournament} onComplete={this.onPublishSchedule}/> }
        ]}/>
      </div>
    );
  }

  private renderTournamentOverview() {
    const {eventConfig} = this.props;

    let roundsView: any[] = [];
    if (Array.isArray(eventConfig.tournament)) {
      roundsView = eventConfig.tournament.map((r: TournamentRound) => {
        return (
          <TournamentRoundCard key={r.id} round={r} onActivate={this.onRoundActivate.bind(this, r.id)} onAdvanceTeams={this.onAdvanceTeams}/>
        );
      });
    } else {
      const r = eventConfig.tournament;
      roundsView.push(
        <TournamentRoundCard key={r.id} round={r} onActivate={this.onRoundActivate.bind(this, r.id)} onAdvanceTeams={this.onAdvanceTeams}/>
      );
    }

    return (
      <Tab.Pane className="step-view-tab">
        <i>Below are your current tournament configurations. Click the 'Activate' button to the right to make that tournament round active, and proceed to the schedule as normal.</i>
        <Card.Group itemsPerRow={3}>
          {roundsView}
        </Card.Group>
      </Tab.Pane>
    );
  }

  private initSchedules() {
    const {eventConfig, playoffsSchedule} = this.props;
    if (Array.isArray(eventConfig.tournament)) {
      if (playoffsSchedule.length < eventConfig.tournament.length) {
        for (const round of eventConfig.tournament) {
          this.addScheduleByType(round.type);
        }
      }
    } else {
      if (playoffsSchedule.length < 1) {
        this.addScheduleByType(eventConfig.tournament.type);
      }
    }
  }

  private onTabChange(event: SyntheticEvent, props: TabProps) {
    if (!this.props.navigationDisabled) {
      this.setState({activeIndex: parseInt(props.activeIndex as string, 10)});
    }
  }

  private onRoundActivate(id: number) {
    const {eventConfig, setNavigationDisabled} = this.props;
    setNavigationDisabled(true);
    eventConfig.activeTournamentID = id;
    CONFIG_STORE.set("eventConfig", eventConfig.toJSON()).then((data: any) => {
      setNavigationDisabled(false);
    }).catch((error: AppError) => {
      DialogManager.showErrorBox(error);
    });
  }

  private addScheduleByType(type: PlayoffsType): void {
    const {addSchedule} = this.props;
    switch (type) {
      case "rr":
        addSchedule(new RoundRobinSchedule());
        break;
      case "elims":
        addSchedule(new EliminationsSchedule());
        break;
      default:
        addSchedule(new Schedule("Ranking"));
    }
  }

  private onPublishSchedule(upload: boolean) {
    const {eventConfig, teams, playoffsSchedule} = this.props;
    this.props.setNavigationDisabled(true);
    const matches: Match[] = this.props.playoffsMatches.filter((m: Match) => m.matchKey.split("-")[3].substring(1, 2) === (this.props.eventConfig.activeTournamentID + ""));
    EventCreationManager.createRanks(teams.filter((t: Team) => playoffsSchedule[eventConfig.activeTournamentID].teams.indexOf(t.teamKey) > 0), this.props.event.eventKey).then(() => {
      if (this.props.toaConfig.enabled && upload) {
        UploadManager.postMatchSchedule(this.props.event.eventKey, matches).then(() => {
          console.log(`${matches.length} matches have been posted to TOA.`);
        }).catch((error: HttpError) => {
          DialogManager.showErrorBox(error);
        });
      }
      EventCreationManager.createPlayoffsSchedule(matches).then(() => {
        this.props.setNavigationDisabled(false);
        this.props.onComplete();
      }).catch((error: HttpError) => {
        console.log(error);
        this.props.setNavigationDisabled(false);
        DialogManager.showErrorBox(error);
      });
    }).catch((rankError: HttpError) => {
      this.props.setNavigationDisabled(false);
      DialogManager.showErrorBox(rankError);
    });
  }

  private onAdvanceTeams(keys: number[]) {
    const {eventConfig, playoffsSchedule} = this.props;
    let tournament: TournamentRound;
    let rounds: TournamentRound[] = [];
    if (Array.isArray(eventConfig.tournament)) {
      rounds = eventConfig.tournament.filter((r: TournamentRound) => r.id === eventConfig.activeTournamentID);
      if (rounds.length > 0) {
        tournament = rounds[0];
      }
    } else {
      if (eventConfig.tournament.id === eventConfig.activeTournamentID) {
        tournament = eventConfig.tournament;
        rounds = [tournament];
      }
    }
    if (rounds.length > 1) {
      const tournaments: number = rounds.length;
      let nextTournament: TournamentRound = tournament;
      if (tournaments > 1) {
        nextTournament = tournaments >= tournament.id ? tournament : (eventConfig.tournament as TournamentRound[])[tournament.id + 1];
      }
      playoffsSchedule[nextTournament.id].teams = keys;
      playoffsSchedule[nextTournament.id].teamsParticipating = keys.length;
    } else {
      console.log("ALL DONE");
    }
  }

  private getTypeFromTournament(type: PlayoffsType): TournamentType {
    switch(type) {
      case "elims":
        return "Eliminations";
      case "ranking":
        return "Ranking";
      case "rr":
        return "Round Robin";
      default:
        return "Eliminations";
    }
  }
}

function mapStateToProps({configState, internalState}: IApplicationState) {
  return {
    event: configState.event,
    eventConfig: configState.eventConfiguration,
    teams: internalState.teamList,
    toaConfig: configState.toaConfig,
    playoffsSchedule: configState.playoffsSchedule,
    playoffsMatches: internalState.playoffsMatches
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setNavigationDisabled: (disabled: boolean) => dispatch(disableNavigation(disabled)),
    addSchedule: (schedule: Schedule) => dispatch(addPlayoffsSchedule(schedule))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventAdvancementView);