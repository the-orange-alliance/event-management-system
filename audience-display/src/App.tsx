import * as React from 'react';
import './App.css';
import SocketProvider from "./shared/providers/SocketProvider";
import {Cookies, withCookies} from "react-cookie";
import Event from "./shared/models/Event";
import EMSProvider from "./shared/providers/EMSProvider";
import {AxiosResponse} from "axios";
import EnergyImpact from "./displays/fgc_2018/EnergyImpact";

interface IProps {
  cookies: Cookies
}

interface IState {
  connected: boolean,
  event: Event,
  loading: boolean,
  videoID: number
}

class App extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      connected: false,
      event: new Event(),
      loading: true,
      videoID: 3
    };
    if (typeof this.props.cookies.get("host") !== "undefined") {
      SocketProvider.initialize((this.props.cookies.get("host") as string));
      EMSProvider.initialize((this.props.cookies.get("host") as string));
    } else {
      SocketProvider.initialize("10.0.100.40"); // Debug/local IPv4
      EMSProvider.initialize("10.0.100.40"); // Debug/local IPv4
    }
    SocketProvider.on("connect", () => {
      SocketProvider.emit("identify", "audience-display", "event", "scoring");
    });
    SocketProvider.on("video-switch", (id: number) => {
      this.setState({
        videoID: id
      });
      this.forceUpdate();
    });
  }

  /**
   * We won't render anything besides a chroma-key background on the audience display until we get something from the
   * API. Once we grab the data, we will initialize game-specific views based upon the 'seasonKey' attribute of an
   * event.
   */
  public componentDidMount() {
    console.log("here");
    EMSProvider.getEvent().then((response: AxiosResponse) => {
      if (response.data.payload && response.data.payload[0] && response.data.payload[0].event_key) {
        this.setState({
          event: new Event().fromJSON(response.data.payload[0]),
          loading: false
        });
      }
    }).catch((error: any) => {
      this.setState({loading: false});
      console.error(error);
    });
  }

  public render() {
    const {event, loading, videoID} = this.state;

    let display: JSX.Element;
    switch (event.seasonKey) {
      case 2018:
        display = <EnergyImpact event={event} videoID={videoID}/>;
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
