import * as React from 'react';
import './App.css';
import {
  Event, EMSProvider, SocketProvider, Team, Match, MatchParticipant
} from "@the-orange-alliance/lib-ems";
import {Cookies, withCookies} from "react-cookie";
import EnergyImpact from "./displays/fgc_2018/EnergyImpact";

import MATCH_START from "./displays/fgc_2018/res/sounds/match_start.wav";
import RoverRuckus from "./displays/ftc_1819/RoverRuckus";
import {Route, RouteComponentProps} from "react-router";
import OceanOpportunities from "./displays/fgc_2019/OceanOpportunities";
import Ranking from "@the-orange-alliance/lib-ems/dist/models/ems/Ranking";
import InfiniteRecharge from "./displays/frc_20/InfiniteRecharge";
import RapidReact from "./displays/frc_22/RapidReact";

interface IProps {
  cookies: Cookies
}

interface IState {
  connected: boolean,
  event: Event,
  teams: Team[],
  loading: boolean,
  videoID: number,
  activeMatch: Match,
}

class App extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      connected: false,
      event: new Event(),
      teams: [],
      loading: true,
      videoID: 0,
      activeMatch: new Match(),
    };

    if (typeof this.props.cookies.get("host") !== "undefined") {
      EMSProvider.initialize((this.props.cookies.get("host") as string));
      SocketProvider.initialize((this.props.cookies.get("host") as string), EMSProvider);
    } else {
      EMSProvider.initialize("localhost"); // Debug/local IPv4
      SocketProvider.initialize("localhost", EMSProvider); // Debug/local IPv4
    }
    SocketProvider.on("connect", () => {
      console.log("Connected to SocketIO.");
      SocketProvider.emit("identify", "audience-display", ["event", "scoring", "referee"]);
    });
    SocketProvider.on("disconnect", () => {
      console.log("Disconnected from SocketIO.");
    });
    SocketProvider.on("video-switch", (id: number) => {
      console.log("Switching to video ID " + id);
      this.setState({
        videoID: id
      });
      this.forceUpdate();
    });
    SocketProvider.on("enter-slave", (masterHost: string) => {
      console.log("Entered slave mode with master address " + masterHost);
      EMSProvider.initialize(masterHost);
      this.initState();
    });
    SocketProvider.on("test-audience", () => {
      this.playSound(MATCH_START).then(() => {
        SocketProvider.emit("test-audience-success");
      });
    });
    SocketProvider.on("prestart-response", (err: any, matchJSON: any, videoID?: number) => {
      const displayID: number = videoID ? videoID : 1;
      const match: Match = new Match().fromJSON(matchJSON);
      const seasonKey: string = match.matchKey.split("-")[0];
      match.matchDetails = Match.getDetailsFromSeasonKey(seasonKey).fromJSON(matchJSON.details);
      if (typeof matchJSON.participants !== "undefined") {
        match.participants = matchJSON.participants.map((pJSON: any) => new MatchParticipant().fromJSON(pJSON));
      }
      this.getParticipantInformation(match).then((participants: MatchParticipant[]) => {
        if (participants.length > 0) {
          match.participants = participants;
        }
        this.setState({activeMatch: match, videoID: displayID});
      });
    });
    SocketProvider.on("commit-scores-response", (err: any, matchJSON: any, updateDisplay: boolean) => {
      if (updateDisplay) {
        const match: Match = new Match().fromJSON(matchJSON);
        const seasonKey: string = match.matchKey.split("-")[0];
        match.matchDetails = Match.getDetailsFromSeasonKey(seasonKey).fromJSON(matchJSON.details);
        if (typeof matchJSON.participants !== "undefined") {
          match.participants = matchJSON.participants.map((pJSON: any) => new MatchParticipant().fromJSON(pJSON));
        }
        this.getParticipantInformation(match).then((participants: MatchParticipant[]) => {
          if (participants.length > 0) {
            match.participants = participants;
          }
          this.setState({activeMatch: match, videoID: 3});
        });
      }
    });

    this.renderAudienceDisplay = this.renderAudienceDisplay.bind(this);
    this.renderPitDisplay = this.renderPitDisplay.bind(this);
  }

  /**
   * We won't render anything besides a chroma-key background on the audience display until we get something from the
   * API. Once we grab the data, we will initialize game-specific views based upon the 'seasonKey' attribute of an
   * event.
   */
  public componentDidMount() {
    this.initState();
  }

  public render() {
    return (
      <>
        <Route path="/" exact={true} render={this.renderAudienceDisplay}/>
        <Route path="/pit" exact={true} render={this.renderPitDisplay}/>
      </>
    )
  }

  private renderAudienceDisplay(props: RouteComponentProps<any>) {
    const {event, teams, loading, videoID, activeMatch} = this.state;
    const display: JSX.Element = this.getYearDisplays(event, teams, activeMatch, videoID, props);

    if (!loading) {
      return (display);
    } else {
      return (<span/>);
    }
  }

  private renderPitDisplay(props: RouteComponentProps<any>) {
    const {event, teams, loading, activeMatch} = this.state;
    // Pit display is always videoID 6
    const display: JSX.Element = this.getYearDisplays(event, teams, activeMatch, 6, props);

    if (!loading) {
      return (display);
    } else {
      return (<span/>);
    }
  }

  private getYearDisplays(event: Event, teams: Team[], activeMatch: Match, videoID: number, props: RouteComponentProps<any>) {
    switch (event.eventType) {
      case "fgc_2018":
        return <EnergyImpact event={event} teams={teams} match={activeMatch} videoID={videoID}/>;
      case "fgc_2019":
        return <OceanOpportunities displayMode={props.location.pathname} event={event} teams={teams} match={activeMatch} videoID={videoID}/>;
      case "ftc_1819":
        return <RoverRuckus displayMode={props.location.pathname} event={event} teams={teams} match={activeMatch} videoID={videoID}/>;
      case "frc_20":
        return <InfiniteRecharge displayMode={props.location.pathname} event={event} teams={teams} match={activeMatch} videoID={videoID}/>;
      case "frc_22":
        return <RapidReact displayMode={props.location.pathname} event={event} teams={teams} match={activeMatch} videoID={videoID}/>;
      default:
        // display = <RapidReact displayMode={props.location.pathname} event={event} teams={teams} match={activeMatch} videoID={videoID}/>;
        return <div id="app-error">NO EVENT HAS BEEN CREATED</div>;
    }
  }

  private getParticipantInformation(match: Match): Promise<MatchParticipant[]> {
    return new Promise<MatchParticipant[]>((resolve, reject) => {
      const promise: Promise<MatchParticipant[]> = match.tournamentLevel !== 0 ? EMSProvider.getMatchTeamRanks(match.matchKey) : EMSProvider.getMatchTeams(match.matchKey);

      promise.then((matchTeams: MatchParticipant[]) => {
        const participants: MatchParticipant[] = [];
        const matchTeamKeys = matchTeams.map((p: MatchParticipant) => p.teamKey);
        match.participants.sort((a: MatchParticipant, b: MatchParticipant) => a.station - b.station);
        for (let i = 0; i < match.participants.length; i++) {
          let participant: MatchParticipant = match.participants[i];
          if (matchTeamKeys.includes(participant.teamKey)) {
            const index = matchTeamKeys.indexOf(participant.teamKey);
            participant = matchTeams[index];
            participants.push(participant);
          } else {
            if (typeof participant.team === "undefined" || participant.teamKey === -1) {
              const team: Team = new Team();
              team.teamKey = i;
              team.teamNameShort = "Test Team #" + (i + 1);
              team.country = "TST";
              team.countryCode = "us";
              participant.team = team;
            }
            if (typeof participant.teamRank === "undefined" || participant.teamKey === -1) {
              const ranking: Ranking = new Ranking();
              ranking.rank = 0;
              participant.teamRank = ranking;
            }
            participants.push(participant);
          }
        }
        resolve(participants);
      });
    });
  }

  private initState() {
    EMSProvider.getEvent().then((events: Event[]) => {
      if (events.length > 0) {
        EMSProvider.getTeams().then((teams: Team[]) => {
          if (teams.length > 0) {
            this.setState({
              event: events[0],
              teams: teams,
              loading: false
            });
          } else {
            this.setState({event: events[0], loading: false});
          }
        }).catch((err: any) => {
          this.setState({loading: false});
          console.error(err);
        });
      } else {
        this.setState({loading: false});
      }
    }).catch((error: any) => {
      this.setState({loading: false});
      console.error(error);
    });
  }

  private playSound(url: any): Promise<any> {
    const audio = new Audio(url);
    audio.volume = 0.5;
    return audio.play();
  }
}

export default withCookies(App);
