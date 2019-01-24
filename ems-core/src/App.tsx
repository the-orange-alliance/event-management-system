import * as React from 'react';
import './App.css';
import AppContainer from "./components/AppContainer";
import {ApplicationActions, IApplicationState} from "./stores";
import {
  IIncrementCompletedStep, ISetAllianceMembers, ISetEliminationsMatches, ISetFinalsMatches,
  ISetPracticeMatches, ISetQualificationMatches, ISetSocketConnected,
  IUpdateTeamList
} from "./stores/internal/types";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {
  incrementCompletedStep, setAllianceMembers, setEliminationsMatches, setFinalsMatches,
  setPracticeMatches,
  setQualificationMatches, setSocketConnected,
  updateTeamList
} from "./stores/internal/actions";

import {EMSProvider, Event, TOAProvider, SocketProvider, WebProvider, TOAConfig, MatchConfiguration, Team, Match,
AllianceMember} from "@the-orange-alliance/lib-ems";

interface IProps {
  slaveModeEnabled: boolean,
  masterHost: string,
  networkHost: string,
  toaConfig: TOAConfig,
  matchTimerConfig: MatchConfiguration,
  setCompletedStep?: (step: number) => IIncrementCompletedStep,
  setTeamList?: (teams: Team[]) => IUpdateTeamList,
  setPracticeMatches?: (matches: Match[]) => ISetPracticeMatches,
  setQualificationMatches?: (matches: Match[]) => ISetQualificationMatches,
  setFinalsMatches?: (matches: Match[]) => ISetFinalsMatches,
  setElimsMatches?: (matches: Match[]) => ISetEliminationsMatches,
  setAllianceMembers?: (members: AllianceMember[]) => ISetAllianceMembers,
  setSocketConnected?: (connected: boolean) => ISetSocketConnected
}

class App extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public componentDidMount() {
    if (this.props.toaConfig.enabled) {
      TOAProvider.initialize(this.props.toaConfig);
    }

    this.initializeSocket(this.props.networkHost);
    WebProvider.initialize(this.props.networkHost);
    if (this.props.slaveModeEnabled) {
      document.title = "Event Management System (Slave to " + this.props.masterHost + ")";
      EMSProvider.initialize(this.props.masterHost);
    } else {
      document.title = "Event Management System";
      EMSProvider.initialize(this.props.networkHost);
    }

    // Preload app-wide variables like team list, schedule, etc.
    EMSProvider.getEvent().then((events: Event[]) => {
      if (events.length > 0) {
        this.props.setCompletedStep(1);
      }
      EMSProvider.getTeams().then((teams: Team[]) => {
        if (teams.length > 0) {
          this.props.setTeamList(teams);
          this.props.setCompletedStep(2);
        }
        EMSProvider.getMatchesAndParticipants("").then((practiceMatches: Match[]) => {
          if (practiceMatches.length > 0) {
            this.props.setPracticeMatches(practiceMatches);
            this.props.setCompletedStep(3);
            EMSProvider.getMatchesAndParticipants("").then((qualMatches: Match[]) => {
              if (qualMatches.length > 0) {
                this.props.setQualificationMatches(qualMatches);
                this.props.setCompletedStep(4);
                EMSProvider.getMatchesAndParticipants("").then((finalsMatches: Match[]) => {
                  if (finalsMatches.length > 0) {
                    this.props.setFinalsMatches(finalsMatches);
                    this.props.setCompletedStep(6);
                  }
                });
                EMSProvider.getAlliances().then((allianceMembers: AllianceMember[]) => {
                  if (allianceMembers.length > 0) {
                    this.props.setAllianceMembers(allianceMembers);
                    this.props.setCompletedStep(5);
                    EMSProvider.getMatchesAndParticipants("").then((elimsMatches: Match[]) => {
                      if (elimsMatches.length > 0) {
                        this.props.setElimsMatches(elimsMatches);
                        this.props.setCompletedStep(6);
                      }
                    });
                  }
                });
              }
            });
          }
        });
      });
    });
  }

  public render() {
    return (
      <AppContainer/>
    );
  }

  private initializeSocket(host: string) {
    SocketProvider.initialize(host);
    SocketProvider.on("connect", () => {
      SocketProvider.emit("identify", "ems-core", "scoring", "event");
      this.props.setSocketConnected(true);
      if (this.props.slaveModeEnabled) {
        setTimeout(() => {
          SocketProvider.emit("enter-slave", this.props.masterHost);
        }, 250);
      }
    });
    SocketProvider.on("disconnect", () => {
      this.props.setSocketConnected(false);
    });
  }
}

export function mapStateToProps(state: IApplicationState) {
  return {
    slaveModeEnabled: state.configState.slaveModeEnabled,
    masterHost: state.configState.masterHost,
    networkHost: state.configState.networkHost,
    matchTimerConfig: state.configState.matchConfig,
    toaConfig: state.configState.toaConfig
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setCompletedStep: (step: number) => dispatch(incrementCompletedStep(step)),
    setTeamList: (teams: Team[]) => dispatch(updateTeamList(teams)),
    setPracticeMatches: (matches: Match[]) => dispatch(setPracticeMatches(matches)),
    setQualificationMatches: (matches: Match[]) => dispatch(setQualificationMatches(matches)),
    setFinalsMatches: (matches: Match[]) => dispatch(setFinalsMatches(matches)),
    setElimsMatches: (matches: Match[]) => dispatch(setEliminationsMatches(matches)),
    setAllianceMembers: (members: AllianceMember[]) => dispatch(setAllianceMembers(members)),
    setSocketConnected: (connected: boolean) => dispatch(setSocketConnected(connected))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
