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

interface IProps {
  match: Match
}

interface IState {
  match: Match,
  teams: Team[],
  time: moment.Duration,
  timerID: any
}

class MatchPlayScreen extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      match: this.getUpdatedMatchInfo(),
      teams: this.getUpdatedTeamInfo(),
      time: moment.duration(0, "seconds"),
      timerID: null
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
    })
  }

  public componentWillUnmount() {
    SocketProvider.off("match-start");
    SocketProvider.off("match-abort");
  }

  public componentDidUpdate(prevProps: IProps) {
    if (prevProps.match.matchKey !== this.props.match.matchKey) {
      this.setState({match: this.getUpdatedMatchInfo(), teams: this.getUpdatedTeamInfo()});
    }
  }

  public render() {
    const {match, teams, time} = this.state;
    const disMin = time.minutes() < 10 ? "0" + time.minutes().toString() : time.minutes().toString();
    const disSec = time.seconds() < 10 ? "0" + time.seconds().toString() : time.seconds().toString();
    return (
      <div>
        <div id="play-display-base">
          <div id="play-display-base-top">
            <div id="play-display-left-details">
              <div className="top-details">
                <ScoringComponent baseImg={REACTOR_BASE} startedImg={RED_REACTOR_STARTED} completedImg={RED_REACTOR_COMPLETE} started={false} completed={false}/>
                <ScoringComponent baseImg={COMBUSTION_BASE} startedImg={RED_COMBUSTION_STARTED} completedImg={RED_COMBUSTION_COMPLETE} started={false} completed={false}/>
                <ScoringComponent baseImg={TURBINE_BASE} startedImg={RED_TURBINE_STARTED} completedImg={RED_TURBINE_COMPLETE} started={false} completed={false}/>
              </div>
              <div className="bottom-details">
                <SolarCapsule allianceColor="red" solarPanelCount={0}/>
              </div>
            </div>
            <div id="play-display-left-score">
              <div className="teams red-bg left-score">
                <div className="team">
                  <TeamCardStatus cardStatus={0}/>
                  <div className="team-name-left">
                    <span>{teams[0].country}</span>
                  </div>
                  <div className="team-flag">
                    <span>{teams[0].countryCode}</span>
                  </div>
                </div>
                <div className="team">
                  <TeamCardStatus cardStatus={2}/>
                  <div className="team-name-left">
                    <span>{teams[1].country}</span>
                  </div>
                  <div className="team-flag">
                    <span>{teams[1].countryCode}</span>
                  </div>
                </div>
                <div className="team">
                  <TeamCardStatus cardStatus={1}/>
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
                    <span>100</span>
                  </div>
                </div>
                <div id="score-container-blue">
                  <div className="blue-bg center-items">
                    <span>200</span>
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
                  <TeamCardStatus cardStatus={0}/>
                </div>
                <div className="team">
                  <div className="team-flag">
                    <span>{teams[4].countryCode}</span>
                  </div>
                  <div className="team-name-left">
                    <span>{teams[4].country}</span>
                  </div>
                  <TeamCardStatus cardStatus={0}/>
                </div>
                <div className="team">
                  <div className="team-flag">
                    <span>{teams[5].countryCode}</span>
                  </div>
                  <div className="team-name-left">
                    <span>{teams[5].country}</span>
                  </div>
                  <TeamCardStatus cardStatus={0}/>
                </div>
              </div>
            </div>
            <div id="play-display-right-details">
              <div className="top-details">
                <ScoringComponent baseImg={REACTOR_BASE} startedImg={BLUE_REACTOR_STARTED} completedImg={BLUE_REACTOR_COMPLETE} started={false} completed={false}/>
                <ScoringComponent baseImg={COMBUSTION_BASE} startedImg={BLUE_COMBUSTION_STARTED} completedImg={BLUE_COMBUSTION_COMPLETE} started={false} completed={false}/>
                <ScoringComponent baseImg={TURBINE_BASE} startedImg={BLUE_TURBINE_STARTED} completedImg={BLUE_TURBINE_COMPLETE} started={false} completed={false}/>
              </div>
              <div className="bottom-details">
                <SolarCapsule allianceColor="blue" solarPanelCount={1}/>
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