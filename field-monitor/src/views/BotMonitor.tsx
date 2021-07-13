import * as React from 'react';
import {Event, Match, SocketProvider} from "@the-orange-alliance/lib-ems";
import {Grid} from "semantic-ui-react";

interface IProps {
  event: Event,
  match: Match,
  connected: boolean
}

interface IState {
  mode: string,
  waitingForMatch: boolean,
  modeColor: string
}

class BotMonitor extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      mode: "Unknown",
      waitingForMatch: true,
      modeColor: ""
    };
  }

  public componentDidMount() {
    SocketProvider.emit("get-mode");
    SocketProvider.on("mode-update", (mode: string) => {
      this.setState({mode});
    });
    SocketProvider.on("match-start", () => {
      this.setState({mode: "Match Started", modeColor: "green"});
    });
    SocketProvider.on("match-auto", () => {
      this.setState({mode: "Autonomous", modeColor: "green"});
    });
    SocketProvider.on("match-tele", () => {
      this.setState({mode: "Teleop", modeColor: "green"});
    });
    SocketProvider.on("match-endgame", () => {
      this.setState({mode: "Endgame", modeColor: "yellow"});
    });
    SocketProvider.on("match-end", () => {
      this.setState({mode: "Match Over", modeColor: "red"});
    });
    SocketProvider.on("match-abort", () => {
      this.setState({mode: "Match Aborted", waitingForMatch: true, modeColor: "brown"});
    });
    SocketProvider.on("commit-scores-response", () => {
      this.setState({mode: "Scores Committed", waitingForMatch: true, modeColor: "brown"});
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
    return (
    <>
      <Grid padded>
        <Grid.Column color={"red"}>
          Test
        </Grid.Column>
      </Grid>
    </>
    )
  }
}

export default BotMonitor;
