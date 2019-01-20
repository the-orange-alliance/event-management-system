import * as React from 'react';
import RedAllianceView from "./ftc_1819/RedAllianceView";
import {Event, Match, SocketProvider} from "@the-orange-alliance/lib-ems";

interface IProps {
  event: Event,
  match: Match,
  connected: boolean
}

interface IState {
  mode: string
}

class RedView extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      mode: "UNDEFINED"
    };
  }

  public componentDidMount() {
    SocketProvider.emit("get-mode");
    SocketProvider.on("mode-update", (mode: string) => {
      console.log(mode);
      this.setState({mode});
    });
    SocketProvider.on("match-start", () => {
      this.setState({mode: "AUTONOMOUS"});
    });
    SocketProvider.on("match-tele", () => {
      this.setState({mode: "TELEOP"});
    });
    SocketProvider.on("match-endgame", () => {
      this.setState({mode: "ENDGAME"});
    });
    SocketProvider.on("match-end", () => {
      this.setState({mode: "MATCH END"});
    });
    SocketProvider.on("match-aborg", () => {
      this.setState({mode: "MATCH ABORTED"});
    });
  }

  public componentWillUnmount() {
    SocketProvider.off("mode-update");
    SocketProvider.off("match-auto");
    SocketProvider.off("match-tele");
    SocketProvider.off("match-endgame");
    SocketProvider.off("match-end");
    SocketProvider.off("match-abort");
  }

  public render() {
    const {event, match, connected} = this.props;
    const {mode} = this.state;
    let display;

    switch (event.season.seasonKey) {
      case 1819:
        display = <RedAllianceView event={event} match={match} mode={mode} connected={connected}/>;
        break;
      default:
        display = <span>No ref tablet application has been made for {event.season.seasonKey}</span>;
    }

    return (display);
  }
}

export default RedView;