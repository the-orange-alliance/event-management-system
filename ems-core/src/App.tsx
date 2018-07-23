import * as React from 'react';
import './App.css';
import AppContainer from "./components/AppContainer";
import {ApplicationActions, IApplicationState} from "./stores";
import {IIncrementCompletedStep, IUpdateProcessList, IUpdateTeamList} from "./stores/internal/types";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import ProcessManager from "./shared/managers/ProcessManager";
import Process from "./shared/models/Process";
import {incrementCompletedStep, updateProcessList, updateTeamList} from "./stores/internal/actions";
import {ISetNetworkHost} from "./stores/config/types";
import {setNetworkHost} from "./stores/config/actions";
import EMSProvider from "./shared/providers/EMSProvider";
// import {AxiosResponse} from "axios";
import Team from "./shared/models/Team";
import {AxiosResponse} from "axios";

interface IProps {
  setCompletedStep: (step: number) => IIncrementCompletedStep,
  setProcessList?: (procList: Process[]) => IUpdateProcessList,
  setNetworkHost?: (host: string) => ISetNetworkHost,
  setTeamList: (teams: Team[]) => IUpdateTeamList
}

class App extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public componentDidMount() {
    ProcessManager.performStartupCheck().then((procList: Process[]) => {
      const networkHost = procList[0].address;
      this.props.setNetworkHost(networkHost);
      this.props.setProcessList(procList);

      EMSProvider.initialize(networkHost);
      this.props.setCompletedStep(2);
      // Preload app-wide variables like team list, schedule, etc.
      EMSProvider.getEvent().then((eventResponse: AxiosResponse) => {
        if (eventResponse.data.payload && eventResponse.data.payload[0] && eventResponse.data.payload[0].event_key) {
          // this.props.setCompletedStep(1);
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
            // this.props.setCompletedStep(2);
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
}

export function mapStateToProps(state: IApplicationState) {
  return {};
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setCompletedStep: (step: number) => dispatch(incrementCompletedStep(step)),
    setProcessList: (procList: Process[]) => dispatch(updateProcessList(procList)),
    setNetworkHost: (host: string) => dispatch(setNetworkHost(host)),
    setTeamList: (teams: Team[]) => dispatch(updateTeamList(teams))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
