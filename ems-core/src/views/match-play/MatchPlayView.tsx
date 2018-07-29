import * as React from "react";
import {Tab, TabProps} from "semantic-ui-react";
import {SyntheticEvent} from "react";
import {ApplicationActions, IApplicationState} from "../../stores";
import {connect} from "react-redux";
import MatchPlay from "./containers/MatchPlay";
import VideoSwitch from "./containers/VideoSwitch";
import * as moment from "moment";
import SocketProvider from "../../shared/providers/SocketProvider";
import {ISetMatchDuration} from "../../stores/scoring/types";
import {Dispatch} from "redux";
import {setMatchDuration} from "../../stores/scoring/actions";

interface IProps {
  matchDuration?: moment.Duration,
  setMatchDuration?: (duration: moment.Duration) => ISetMatchDuration
}

interface IState {
  activeIndex: number,
  timerID: any
}

class MatchPlayView extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      activeIndex: 0,
      timerID: null
    };
    this.onTabChange = this.onTabChange.bind(this);
  }

  public componentDidMount() {
    SocketProvider.on("match-start", (time: number) => {
      this.props.setMatchDuration(moment.duration(time, "seconds"));
      this.startTimer();
    });
    SocketProvider.on("match-end", () => {
      this.stopTimer();
    });
    SocketProvider.on("match-abort", () => {
      this.stopTimer();
    });
  }

  public componentWillUnmount() {
    SocketProvider.off("match-start");
    SocketProvider.off("match-end");
    SocketProvider.off("match-abort");
  }

  public render() {
    return (
      <div className="view">
        <Tab menu={{secondary: true}} activeIndex={this.state.activeIndex} onTabChange={this.onTabChange} panes={ [
          { menuItem: "Match Play", render: () => <MatchPlay/>},
          { menuItem: "Video Switch", render: () => <VideoSwitch/>},
        ]}/>
      </div>
    );
  }

  private onTabChange(event: SyntheticEvent, props: TabProps) {
    this.setState({activeIndex: parseInt(props.activeIndex as string, 10)});
  }

  private startTimer() {
    const timerID = global.setInterval(() => {
      const newDuration = moment.duration(this.props.matchDuration.subtract(1, "s"));
      this.props.setMatchDuration(newDuration);
    }, 1000);
    this.setState({timerID: timerID});
  }

  private stopTimer() {
    global.clearInterval(this.state.timerID);
    this.setState({timerID: null});
  }
}

export function mapStateToProps({scoringState}: IApplicationState) {
  return {
    matchDuration: scoringState.matchDuration
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setMatchDuration: (duration: moment.Duration) => dispatch(setMatchDuration(duration))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchPlayView);