import * as React from 'react';
import './App.css';
import SocketProvider from "./shared/providers/SocketProvider";
import {Cookies, withCookies} from "react-cookie";
import Event from "./shared/models/Event";
import EMSProvider from "./shared/providers/EMSProvider";
import {AxiosResponse} from "axios";
import EnergyImpact from "./displays/fgc_2018/EnergyImpact";
import Team from "./shared/models/Team";
import Match from "./shared/models/Match";
import MatchParticipant from "./shared/models/MatchParticipant";
import AllianceMember from "./shared/models/AllianceMember";

import MATCH_START from "./displays/fgc_2018/res/sounds/match_start.wav";
import RoverRuckus from "./displays/ftc_1819/RoverRuckus";

interface IProps {
  cookies: Cookies
}

interface IState {
  connected: boolean,
  event: Event,
  teams: Team[],
  loading: boolean,
  videoID: number,
  activeMatch: Match
}

class App extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      connected: false,
      event: new Event(),
      teams: [],
      loading: true,
      videoID: 2,
      activeMatch: new Match()
    };
    if (typeof this.props.cookies.get("host") !== "undefined") {
      SocketProvider.initialize((this.props.cookies.get("host") as string));
      EMSProvider.initialize((this.props.cookies.get("host") as string));
    } else {
      SocketProvider.initialize("127.0.0.1"); // Debug/local IPv4
      EMSProvider.initialize("127.0.0.1"); // Debug/local IPv4
    }
    SocketProvider.on("connect", () => {
      console.log("Connected to SocketIO.");
      SocketProvider.emit("identify", "audience-display", "event", "scoring", "referee");
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
    SocketProvider.on("prestart", (matchKey: string) => {
      EMSProvider.getMatch(matchKey).then((matchRes: AxiosResponse) => {
        if (matchRes.data) {
          const match: Match = new Match().fromJSON(matchRes.data.payload[0]);
          if (match.tournamentLevel > 0) {
            EMSProvider.getMatchTeamRanks(matchKey).then((partRes: AxiosResponse) => {
              match.participants = partRes.data.payload.map((participant: any) => new MatchParticipant().fromJSON(participant));
              if (match.participants[0].allianceKey !== null && match.participants[0].allianceKey.length > 0) {
                EMSProvider.getAlliances().then((allianceRes: AxiosResponse) => {
                  match.allianceMembers = allianceRes.data.payload.map((member: any) => new AllianceMember().fromJSON(member));
                  this.setState({
                    activeMatch: match,
                    videoID: 1 // Universal Match Preview Screen
                  });
                });
              } else {
                this.setState({
                  activeMatch: match,
                  videoID: 1 // Universal Match Preview Screen
                });
              }
            });
          } else {
            EMSProvider.getMatchTeams(matchKey).then((partRes: AxiosResponse) => {
              match.participants = partRes.data.payload.map((participant: any) => new MatchParticipant().fromJSON(participant));
              this.setState({
                activeMatch: match,
                videoID: 1 // Universal Match Preview Screen
              });
            });
          }
        }
      }).catch((matchRes: any) => console.error(matchRes));
    });
    SocketProvider.on("commit-scores", (matchKey: string) => {
      EMSProvider.getMatch(matchKey).then((matchRes: AxiosResponse) => {
        EMSProvider.getMatchDetails(matchKey).then((detailRes: AxiosResponse) => {
          if (matchRes.data && detailRes.data) {
            const match: Match = new Match().fromJSON(matchRes.data.payload[0]);
            if (match.tournamentLevel > 0) {
              EMSProvider.getMatchTeamRanks(matchKey).then((teamRes: AxiosResponse) => {
                if (teamRes.data) {
                  const seasonKey: number = parseInt(matchKey.split("-")[0], 10);
                  match.matchDetails = Match.getDetailsFromSeasonKey(seasonKey).fromJSON(detailRes.data.payload[0]);
                  match.participants = teamRes.data.payload.map((participant: any) => new MatchParticipant().fromJSON(participant));
                  this.setState({
                    activeMatch: match,
                    videoID: 3 // Universal Match Results Screen
                  });
                }
              }).catch((teamRes: any) => console.error(teamRes));
            } else {
              EMSProvider.getMatchTeams(matchKey).then((teamRes: AxiosResponse) => {
                if (teamRes.data) {
                  const seasonKey: number = parseInt(matchKey.split("-")[0], 10);
                  match.matchDetails = Match.getDetailsFromSeasonKey(seasonKey).fromJSON(detailRes.data.payload[0]);
                  match.participants = teamRes.data.payload.map((participant: any) => new MatchParticipant().fromJSON(participant));
                  this.setState({
                    activeMatch: match,
                    videoID: 3 // Universal Match Results Screen
                  });
                }
              }).catch((teamRes: any) => console.error(teamRes));
            }
          }
        }).catch((detailsRes: any) => console.error(detailsRes));
      }).catch((matchRes: any) => console.error(matchRes));
    });
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
    const {event, teams, loading, videoID, activeMatch} = this.state;

    let display: JSX.Element;
    switch (event.seasonKey) {
      case 2018:
        display = <EnergyImpact event={event} teams={teams} match={activeMatch} videoID={videoID}/>;
        break;
      case 1819:
        display = <RoverRuckus event={event} teams={teams} match={activeMatch} videoID={videoID}/>;
        break;
      default:
        display = <div id="app-error">REST API CONNECTION LOST</div>;
    }

    if (!loading) {
      return (display);
    } else {
      return (<span/>);
    }
  }

  private initState() {
    EMSProvider.getEvent().then((response: AxiosResponse) => {
      if (response.data.payload && response.data.payload[0] && response.data.payload[0].event_key) {
        EMSProvider.getAllTeams().then((teamsResponse: AxiosResponse) => {
          if (teamsResponse.data.payload && teamsResponse.data.payload.length > 0) {
            this.setState({
              event: new Event().fromJSON(response.data.payload[0]),
              teams: teamsResponse.data.payload.map((teamJSON: any) => new Team().fromJSON(teamJSON)),
              loading: false
            });
          } else {
            this.setState({loading: false});
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
