import * as React from "react";
import ScoringComponent from "./ScoringComponent";
import * as moment from "moment";

import "./MatchPlayScreen.css";
import FGC_LOGO from "../res/Global_Logo.png";

import REACTOR_BASE from "../res/Grey_Reactor_Icon.png";
import BLUE_REACTOR_STARTED from "../res/Blue_Reactor_Core_Icon.png";
import BLUE_REACTOR_COMPLETE from "../res/Blue_Reactor_Complete_Icon.png";
import RED_REACTOR_STARTED from "../res/Red_Reactor_Core_Icon.png";
import RED_REACTOR_COMPLETE from "../res/Red_Reactor_Complete_Icon.png";

import COMBUSTION_BASE from "../res/Grey_Burning_Icon.png";
import BLUE_COMBUSTION_STARTED from "../res/Blue_Burning_Complete_Icon.png";
import BLUE_COMBUSTION_COMPLETE from "../res/Blue_Burning_Complete_Icon.png";
import RED_COMBUSTION_STARTED from "../res/Red_Burning_Complete_Icon.png";
import RED_COMBUSTION_COMPLETE from "../res/Red_Burning_Complete_Icon.png";

import TURBINE_BASE from "../res/Grey_Wind_Icon.png";
import BLUE_TURBINE_STARTED from "../res/Blue_Wind_Core_Icon.png";
import BLUE_TURBINE_COMPLETE from "../res/Blue_Wind_Complete_Icon.png";
import RED_TURBINE_STARTED from "../res/Red_Wind_Core_Icon.png";
import RED_TURBINE_COMPLETE from "../res/Red_Wind_Complete_Icon.png";
import TeamCardStatus from "./TeamCardStatus";
import SolarCapsule from "./ScoringCapsule";
import Match from "../../../shared/models/Match";
import Team from "../../../shared/models/Team";
import MatchParticipant from "../../../shared/models/MatchParticipant";
import SocketProvider from "../../../shared/providers/SocketProvider";
import BasicMatch from "../../../shared/models/BasicMatch";

interface IProps {
  match: Match
}

interface IState {
  match: Match,
  teams: Team[],
  time: moment.Duration,
  timerID: any,
  matchData: BasicMatch,
  panels: number[]
}

class MatchPlayScreen extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      match: this.getUpdatedMatchInfo(),
      teams: this.getUpdatedTeamInfo(),
      time: moment.duration(0, "seconds"),
      timerID: null,
      matchData: new BasicMatch(),
      panels: [0, 0]
    };
  }

  public componentDidMount() {
    SocketProvider.on("match-start", (matchTime: number) => {
      this.setState({time: moment.duration(matchTime, "seconds")});
      this.startTimer();
    });
    SocketProvider.on("match-abort", () => {
      this.setState({time: moment.duration(0, "seconds")});
      this.stopTimer();
    });
    SocketProvider.on("match-end", () => {
      this.stopTimer();
    });
    SocketProvider.on("score-update", (scoreObj: any) => {
      this.setState({matchData: new BasicMatch().fromJSON(scoreObj)});
    });
    SocketProvider.on("onSolar", (solarObj) => {
      const alliance = solarObj.alliance_index === 0 ? "red" : "blue";
      if (solarObj.value === true) {
        this.state.panels[alliance]++;
      } else {
        if (this.state.panels[alliance] > 0) {
          this.state.panels[alliance]--;
        }
      }
      this.forceUpdate();
    });
  }

  public componentWillUnmount() {
    SocketProvider.off("match-start");
    SocketProvider.off("match-end");
    SocketProvider.off("match-abort");
    SocketProvider.off("score-update");
    SocketProvider.off("onSolar");
  }

  public componentDidUpdate(prevProps: IProps) {
    if (prevProps.match.matchKey !== this.props.match.matchKey) {
      this.setState({match: this.getUpdatedMatchInfo(), teams: this.getUpdatedTeamInfo()});
    }
  }

  public render() {
    const {match, teams, time, matchData, panels} = this.state;
    const disMin = time.minutes() < 10 ? "0" + time.minutes().toString() : time.minutes().toString();
    const disSec = time.seconds() < 10 ? "0" + time.seconds().toString() : time.seconds().toString();

    const redReactorStarted = matchData.shared.reactor_cubes > 0 || matchData.redDetails.nuclearReactorPowerlineOn;
    const redReactorComplete = matchData.shared.reactor_cubes === 8 && matchData.redDetails.nuclearReactorPowerlineOn;
    const redCombustionStarted = matchData.redDetails.combustionPowerlineOn || matchData.redDetails.lowCombustionPoints > 0 || matchData.redDetails.highCombustionPoints > 0;
    const redCombustionComplete = matchData.redDetails.combustionPowerlineOn && (matchData.redDetails.lowCombustionPoints > 0 || matchData.redDetails.highCombustionPoints > 0);
    const redTurbineStarted = matchData.redDetails.windTurbineCranked || matchData.redDetails.windTurbinePowerlineOn;
    const redTurbineComplete = matchData.redDetails.windTurbineCranked && matchData.redDetails.windTurbinePowerlineOn;

    const blueReactorStarted = matchData.shared.reactor_cubes > 0 || matchData.blueDetails.nuclearReactorPowerlineOn;
    const blueReactorComplete = matchData.shared.reactor_cubes === 8 && matchData.blueDetails.nuclearReactorPowerlineOn;
    const blueCombustionStarted = matchData.blueDetails.combustionPowerlineOn || matchData.blueDetails.lowCombustionPoints > 0 || matchData.blueDetails.highCombustionPoints > 0;
    const blueCombustionComplete = matchData.blueDetails.combustionPowerlineOn && (matchData.blueDetails.lowCombustionPoints > 0 || matchData.blueDetails.highCombustionPoints > 0);
    const blueTurbineStarted = matchData.blueDetails.windTurbineCranked || matchData.blueDetails.windTurbinePowerlineOn;
    const blueTurbineComplete = matchData.blueDetails.windTurbineCranked && matchData.blueDetails.windTurbinePowerlineOn;
    
    return (
      <div>
        <div id="play-display-base">
          <div id="play-display-base-top">
            <div id="play-display-left-details">
              <div className="top-details">
                <ScoringComponent baseImg={REACTOR_BASE} startedImg={RED_REACTOR_STARTED} completedImg={RED_REACTOR_COMPLETE} started={redReactorStarted} completed={redReactorComplete}/>
                <ScoringComponent baseImg={COMBUSTION_BASE} startedImg={RED_COMBUSTION_STARTED} completedImg={RED_COMBUSTION_COMPLETE} started={redCombustionStarted} completed={redCombustionComplete}/>
                <ScoringComponent baseImg={TURBINE_BASE} startedImg={RED_TURBINE_STARTED} completedImg={RED_TURBINE_COMPLETE} started={redTurbineStarted} completed={redTurbineComplete}/>
              </div>
              <div className="bottom-details">
                <SolarCapsule allianceColor="red" solarPanelCount={panels[0]}/>
              </div>
            </div>
            <div id="play-display-left-score">
              <div className="teams red-bg left-score">
                <div className="team">
                  <TeamCardStatus cardStatus={matchData.cardStatuses[0]}/>
                  <div className="team-name-left">
                    <span>{teams[0].country}</span>
                  </div>
                  <div className="team-flag">
                    <span>{teams[0].countryCode}</span>
                  </div>
                </div>
                <div className="team">
                  <TeamCardStatus cardStatus={matchData.cardStatuses[1]}/>
                  <div className="team-name-left">
                    <span>{teams[1].country}</span>
                  </div>
                  <div className="team-flag">
                    <span>{teams[1].countryCode}</span>
                  </div>
                </div>
                <div className="team">
                  <TeamCardStatus cardStatus={matchData.cardStatuses[2]}/>
                  <div className="team-name-left">
                    <span>{teams[2].country}</span>
                  </div>
                  <div className="team-flag">
                    <span>{teams[2].countryCode}</span>
                  </div>
                </div>
              </div>
            </div>
            <div id="play-display-center">
              <div id="score-container-header">
                <img src={FGC_LOGO} className="fit"/>
              </div>
              <div id="score-container-timer">
                <span>{disMin}:{disSec}</span>
              </div>
              <div id="score-container-scores">
                <div id="score-container-red">
                  <div className="red-bg center-items">
                    <span>{matchData.redScore}</span>
                  </div>
                </div>
                <div id="score-container-blue">
                  <div className="blue-bg center-items">
                    <span>{matchData.blueScore}</span>
                  </div>
                </div>
              </div>
            </div>
            <div id="play-display-right-score">
              <div className="teams blue-bg right-score">
                <div className="team">
                  <div className="team-flag">
                    <span>{teams[3].countryCode}</span>
                  </div>
                  <div className="team-name-left">
                    <span>{teams[3].country}</span>
                  </div>
                  <TeamCardStatus cardStatus={matchData.cardStatuses[3]}/>
                </div>
                <div className="team">
                  <div className="team-flag">
                    <span>{teams[4].countryCode}</span>
                  </div>
                  <div className="team-name-left">
                    <span>{teams[4].country}</span>
                  </div>
                  <TeamCardStatus cardStatus={matchData.cardStatuses[4]}/>
                </div>
                <div className="team">
                  <div className="team-flag">
                    <span>{teams[5].countryCode}</span>
                  </div>
                  <div className="team-name-left">
                    <span>{teams[5].country}</span>
                  </div>
                  <TeamCardStatus cardStatus={matchData.cardStatuses[5]}/>
                </div>
              </div>
            </div>
            <div id="play-display-right-details">
              <div className="top-details">
                <ScoringComponent baseImg={REACTOR_BASE} startedImg={BLUE_REACTOR_STARTED} completedImg={BLUE_REACTOR_COMPLETE} started={blueReactorStarted} completed={blueReactorComplete}/>
                <ScoringComponent baseImg={COMBUSTION_BASE} startedImg={BLUE_COMBUSTION_STARTED} completedImg={BLUE_COMBUSTION_COMPLETE} started={blueCombustionStarted} completed={blueCombustionComplete}/>
                <ScoringComponent baseImg={TURBINE_BASE} startedImg={BLUE_TURBINE_STARTED} completedImg={BLUE_TURBINE_COMPLETE} started={blueTurbineStarted} completed={blueTurbineComplete}/>
              </div>
              <div className="bottom-details">
                <SolarCapsule allianceColor="blue" solarPanelCount={panels[1]}/>
              </div>
            </div>
          </div>
          <div id="play-display-base-bottom">
            <div className="info-col">
              <span className="info-field">MATCH: {match.matchName}</span>
              <span className="info-field">FIELD: {match.fieldNumber}</span>
            </div>
            <div className="info-col">
              <span className="info-field">FIRST Global 2018</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private startTimer() {
    const timerID = global.setInterval(() => {
      this.setState({
        time: moment.duration(this.state.time).subtract(1, "s")
      });
    }, 1000);
    this.setState({timerID: timerID});
  }

  private stopTimer() {
    if (this.state.timerID !== null) {
      global.clearInterval(this.state.timerID);
      this.setState({timerID: null});
    }
  }

  private getUpdatedMatchInfo(): Match {
    if (this.props.match.matchKey.length === 0) {
      const match: Match = new Match();
      match.matchName = "A MATCH TEST";
      match.fieldNumber = 1; // TODO - Change field number in EMS

      const participants: MatchParticipant[] = [];
      for (let i = 0; i < 6; i++) {
        participants.push(new MatchParticipant().fromJSON({team_key: (i + 1), country_code: "us", card_status: 0}));
      }

      match.participants = participants;
      return match;
    } else {
      return this.props.match;
    }
  }

  private getUpdatedTeamInfo(): Team[] {
    if (typeof this.props.match.participants === "undefined") {
      const teams: Team[] = [];
      for (let i = 0; i < 6; i++) {
        teams.push(new Team().fromJSON({
          team_key: i,
          team_name_short: "TEST TEAM #" + (i + 1),
          country: "TST",
          country_code: "us"
        }));
      }
      return teams;
    } else {
      const teams: Team[] = [];
      for (const participant of this.props.match.participants) {
        teams.push(participant.team);
      }
      return teams;
    }
  }
}

export default MatchPlayScreen;