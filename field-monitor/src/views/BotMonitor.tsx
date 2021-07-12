import * as React from 'react';
import {Event, Match, SocketProvider} from "@the-orange-alliance/lib-ems";

interface IProps {
  event: Event,
  match: Match,
  connected: boolean
}

interface IState {
  mode: string,
  waitingForMatch: boolean
}

class BotMonitor extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      mode: "UNDEFINED",
      waitingForMatch: true
    };
  }

  public componentDidMount() {
    SocketProvider.emit("get-mode");
    SocketProvider.on("mode-update", (mode: string) => {
      this.setState({mode});
    });
    SocketProvider.on("match-start", () => {
      this.setState({mode: "MATCH STARTED"});
    });
    SocketProvider.on("match-auto", () => {
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
    SocketProvider.on("match-abort", () => {
      this.setState({mode: "MATCH ABORTED", waitingForMatch: true});
    });
    SocketProvider.on("commit-scores-response", () => {
      this.setState({waitingForMatch: true});
    });

    if (this.state.waitingForMatch && this.props.match.matchKey.length > 0) {
      this.setState({waitingForMatch: false});
    }
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (!this.state.waitingForMatch && this.props.match.matchKey.length <= 0) {
      this.setState({waitingForMatch: true});
    }
    if (this.state.waitingForMatch && this.props.match.matchKey.length > 0) {
      this.setState({waitingForMatch: false});
    }
  }

  public componentWillUnmount() {
    SocketProvider.off("mode-update");
    SocketProvider.off("match-start");
    SocketProvider.off("match-auto");
    SocketProvider.off("match-tele");
    SocketProvider.off("match-endgame");
    SocketProvider.off("match-end");
    SocketProvider.off("match-abort");
    SocketProvider.off("commit-scores-response");
  }

  public render() {
    return <>FieldMon Coming Soon!</>
  }
}

export default BotMonitor;