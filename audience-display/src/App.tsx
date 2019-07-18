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
      SocketProvider.initialize((this.props.cookies.get("host") as string));
      EMSProvider.initialize((this.props.cookies.get("host") as string));
    } else {
      SocketProvider.initialize("192.168.1.103"); // Debug/local IPv4
      EMSProvider.initialize("192.168.1.103"); // Debug/local IPv4
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
    SocketProvider.on("prestart-response", (err: any, matchJSON: any) => {
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
        this.setState({activeMatch: match, videoID: 1});
      });
    });
    SocketProvider.on("commit-scores", (matchKey: string) => {
      // TODO - Fix this.
      console.log(matchKey);
    });

    this.renderAudienceDisplay = this.renderAudienceDisplay.bind(this);
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
    return <Route path="/" render={this.renderAudienceDisplay}/>
  }

  private renderAudienceDisplay(props: RouteComponentProps<any>) {
    const {event, teams, loading, videoID, activeMatch} = this.state;
    let display: JSX.Element;
    switch (event.eventType) {
      case "fgc_2018":
        display = <EnergyImpact event={event} teams={teams} match={activeMatch} videoID={videoID}/>;
        break;
      case "fgc_2019":
        display = <OceanOpportunities event={event} teams={teams} match={activeMatch} videoID={videoID}/>;
        break;
      case "ftc_1819":
        display = <RoverRuckus displayMode={props.location.pathname} event={event} teams={teams} match={activeMatch} videoID={videoID}/>;
        break;
      default:
        display = <div id="app-error">NO EVENT HAS BEEN CREATED</div>;
    }

    if (!loading) {
      return (display);
    } else {
      return (<span/>);
    }
  }

  private getParticipantInformation(match: Match): Promise<MatchParticipant[]> {
    return new Promise<MatchParticipant[]>((resolve, reject) => {
      EMSProvider.getMatchTeams(match.matchKey).then((matchTeams: MatchParticipant[]) => {
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
            if (typeof participant.team === "undefined") {
              const team: Team = new Team();
              team.teamKey = i;
              team.teamNameShort = "Test Team #" + (i + 1);
              team.country = "TST";
              team.countryCode = "us";
              participant.team = team;
            }
            if (typeof participant.teamRank === "undefined") {
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
