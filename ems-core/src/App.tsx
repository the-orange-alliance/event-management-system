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
import EMSProvider from "./shared/providers/EMSProvider";
import Team from "./shared/models/Team";
import {AxiosResponse} from "axios";
import Match from "./shared/models/Match";
import MatchParticipant from "./shared/models/MatchParticipant";
import SocketProvider from "./shared/providers/SocketProvider";
import AllianceMember from "./shared/models/AllianceMember";

interface IProps {
  slaveModeEnabled: boolean,
  masterHost: string,
  networkHost: string,
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
    this.initializeSocket(this.props.networkHost);

    if (this.props.slaveModeEnabled) {
      document.title = "Event Management System (Slave to " + this.props.masterHost + ")";
      EMSProvider.initialize(this.props.masterHost);
    } else {
      document.title = "Event Management System";
      EMSProvider.initialize(this.props.networkHost);
    }

    // Preload app-wide variables like team list, schedule, etc.
    EMSProvider.getEvent().then((eventResponse: AxiosResponse) => {
      if (eventResponse.data.payload && eventResponse.data.payload[0] && eventResponse.data.payload[0].event_key) {
        this.props.setCompletedStep(1);
      }
      EMSProvider.getTeams().then((teamResponse: AxiosResponse) => {
        if (teamResponse.data && teamResponse.data.payload && teamResponse.data.payload.length > 0) {
          const teams: Team[] = [];
          for (const teamJSON of teamResponse.data.payload) {
            let team: Team = new Team();
            team = team.fromJSON(teamJSON);
            teams.push(team);
          }
          this.props.setTeamList(teams);
          this.props.setCompletedStep(2);
        }
        EMSProvider.getMatches(0).then((practiceMatchesResponse: AxiosResponse) => {
          if (practiceMatchesResponse.data && practiceMatchesResponse.data.payload && practiceMatchesResponse.data.payload.length > 0) {
            const practiceMatches: Match[] = [];
            for (const matchJSON of practiceMatchesResponse.data.payload) {
              const match: Match = new Match().fromJSON(matchJSON);
              const participants: MatchParticipant[] = [];
              for (let i = 0; i < matchJSON.participants.split(",").length; i++) {
                const participant: MatchParticipant = new MatchParticipant();
                participant.matchParticipantKey = matchJSON.participant_keys.split(",")[i];
                participant.matchKey = match.matchKey;
                participant.teamKey = parseInt(matchJSON.participants.split(",")[i], 10);
                participant.surrogate = matchJSON.surrogates.split(",")[i] === "1";
                participant.station = parseInt(matchJSON.stations.split(",")[i], 10);
                participants.push(participant);
              }
              match.participants = participants;
              practiceMatches.push(match);
            }
            this.props.setPracticeMatches(practiceMatches);
            this.props.setCompletedStep(3);
            EMSProvider.getMatches(1).then((qualMatchesResponse: AxiosResponse) => {
              if (qualMatchesResponse.data && qualMatchesResponse.data.payload && qualMatchesResponse.data.payload.length > 0) {
                const qualMatches: Match[] = [];
                for (const matchJSON of qualMatchesResponse.data.payload) {
                  const match: Match = new Match().fromJSON(matchJSON);
                  const participants: MatchParticipant[] = [];
                  for (let i = 0; i < matchJSON.participants.split(",").length; i++) {
                    const participant: MatchParticipant = new MatchParticipant();
                    participant.matchParticipantKey = matchJSON.participant_keys.split(",")[i];
                    participant.matchKey = match.matchKey;
                    participant.teamKey = parseInt(matchJSON.participants.split(",")[i], 10);
                    participant.surrogate = matchJSON.surrogates.split(",")[i] === "1";
                    participant.station = parseInt(matchJSON.stations.split(",")[i], 10);
                    participants.push(participant);
                  }
                  match.participants = participants;
                  qualMatches.push(match);
                }
                this.props.setQualificationMatches(qualMatches);
                this.props.setCompletedStep(4);
                EMSProvider.getMatches(6).then((finalsMatchesResponse: AxiosResponse) => {
                  if (finalsMatchesResponse.data && finalsMatchesResponse.data.payload && finalsMatchesResponse.data.payload.length > 0) {
                    const finalsMatches: Match[] = [];
                    for (const matchJSON of finalsMatchesResponse.data.payload) {
                      const match: Match = new Match().fromJSON(matchJSON);
                      const participants: MatchParticipant[] = [];
                      for (let i = 0; i < matchJSON.participants.split(",").length; i++) {
                        const participant: MatchParticipant = new MatchParticipant();
                        participant.matchParticipantKey = matchJSON.participant_keys.split(",")[i];
                        participant.matchKey = match.matchKey;
                        participant.teamKey = parseInt(matchJSON.participants.split(",")[i], 10);
                        participant.surrogate = matchJSON.surrogates.split(",")[i] === "1";
                        participant.station = parseInt(matchJSON.stations.split(",")[i], 10);
                        participants.push(participant);
                      }
                      match.participants = participants;
                      finalsMatches.push(match);
                    }
                    this.props.setFinalsMatches(finalsMatches);
                    this.props.setCompletedStep(6);
                  }
                });
                EMSProvider.getAlliances().then((allianceResponse: AxiosResponse) => {
                  if (allianceResponse.data && allianceResponse.data.payload && allianceResponse.data.payload.length > 0) {
                    const members: AllianceMember[] = [];
                    for (const memberJSON of allianceResponse.data.payload) {
                      members.push(new AllianceMember().fromJSON(memberJSON));
                    }
                    this.props.setAllianceMembers(members);
                    this.props.setCompletedStep(5);
                    EMSProvider.getMatches("elims").then((elimsMatchesResposne: AxiosResponse) => {
                      if (elimsMatchesResposne.data && elimsMatchesResposne.data.payload && elimsMatchesResposne.data.payload.length > 0) {
                        const elimsMatches: Match[] = [];
                        for (const matchJSON of elimsMatchesResposne.data.payload) {
                          const match: Match = new Match().fromJSON(matchJSON);
                          const participants: MatchParticipant[] = [];
                          for (let i = 0; i < matchJSON.participants.split(",").length; i++) {
                            const participant: MatchParticipant = new MatchParticipant();
                            participant.allianceKey = matchJSON.alliance_keys.split(",")[i];
                            participant.matchParticipantKey = matchJSON.participant_keys.split(",")[i];
                            participant.matchKey = match.matchKey;
                            participant.teamKey = parseInt(matchJSON.participants.split(",")[i], 10);
                            participant.surrogate = matchJSON.surrogates.split(",")[i] === "1";
                            participant.station = parseInt(matchJSON.stations.split(",")[i], 10);
                            participants.push(participant);
                          }
                          match.participants = participants;
                          elimsMatches.push(match);
                        }
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
    networkHost: state.configState.networkHost
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
