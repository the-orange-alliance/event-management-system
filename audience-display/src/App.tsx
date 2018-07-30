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
      videoID: 1,
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
      SocketProvider.emit("identify", "audience-display", "event", "scoring");
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
    SocketProvider.on("prestart", (matchKey: string) => {
      EMSProvider.getMatch(matchKey).then((matchRes: AxiosResponse) => {
        EMSProvider.getMatchTeams(matchKey).then((partRes: AxiosResponse) => {
          if (matchRes.data && partRes.data) {
            const match: Match = new Match().fromJSON(matchRes.data.payload[0]);
            match.participants = partRes.data.payload.map((participant: any) => new MatchParticipant().fromJSON(participant));
            this.setState({
              activeMatch: match,
              videoID: 1 // Universal Match Preview Screen
            });
          }
        }).catch((partErr) => console.error(partErr));
      }).catch((matchRes: any) => console.error(matchRes));
    });
  }

  /**
   * We won't render anything besides a chroma-key background on the audience display until we get something from the
   * API. Once we grab the data, we will initialize game-specific views based upon the 'seasonKey' attribute of an
   * event.
   */
  public componentDidMount() {
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

  public render() {
    const {event, teams, loading, videoID, activeMatch} = this.state;

    let display: JSX.Element;
    switch (event.seasonKey) {
      case 2018:
        display = <EnergyImpact event={event} teams={teams} match={activeMatch} videoID={videoID}/>;
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
}

export default withCookies(App);
