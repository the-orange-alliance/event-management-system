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
import MatchTimer from "../../shared/scoring/MatchTimer";
import {MatchMode} from "../../shared/scoring/MatchMode";

interface IProps {
  matchDuration?: moment.Duration,
  setMatchDuration?: (duration: moment.Duration) => ISetMatchDuration
}

interface IState {
  activeIndex: number,
  mode: string
}

class MatchPlayView extends React.Component<IProps, IState> {
  private _timer: MatchTimer;

  constructor(props: IProps) {
    super(props);
    this.state = {
      activeIndex: 0,
      mode: "???"
    };
    this._timer = new MatchTimer();
    this.onTabChange = this.onTabChange.bind(this);
  }

  public componentDidMount() {
    this._timer.on("match-start", () => {
      console.log('MATCH START');
      this.setState({mode: "AUTO"});
      this._timer.on("match-transition", () => this.setState({mode: "TRANSITION"}));
      this._timer.on("match-tele", () => this.setState({mode: "TELE"}));
      this._timer.on("match-endgame", () => this.setState({mode: "ENDGAME"}));
      SocketProvider.on("match-end", () => {
        this.setState({mode: "MATCH END"});
        this._timer.removeAllListeners("match-transition");
        this._timer.removeAllListeners("match-tele");
        this._timer.removeAllListeners("match-endgame");
        this._timer.removeAllListeners("match-abort");
        this._timer.stop();
      });
      SocketProvider.on("match-abort", () => {
        this._timer.removeAllListeners("match-transition");
        this._timer.removeAllListeners("match-tele");
        this._timer.removeAllListeners("match-endgame");
        this._timer.removeAllListeners("match-end");
        this.setState({mode: "ABORTED"});
        this._timer.abort();
      });
      this.updateTimer();
      const timerID = global.setInterval(() => {
        this.updateTimer();
        if (this._timer.timeLeft <= 0) {
          this.updateTimer();
          global.clearInterval(timerID);
        }
      }, 500);
    });
  }

  public componentWillUnmount() {
    SocketProvider.off("match-end");
    SocketProvider.off("match-abort");
    this._timer.stop();
  }

  public render() {
    const {mode} = this.state;
    return (
      <div className="view">
        <Tab menu={{secondary: true}} activeIndex={this.state.activeIndex} onTabChange={this.onTabChange} panes={ [
          { menuItem: "Match Play", render: () => <MatchPlay mode={mode} timer={this._timer}/>},
          { menuItem: "Video Switch", render: () => <VideoSwitch/>},
        ]}/>
      </div>
    );
  }

  private updateTimer() {
    let displayTime: number = this._timer.timeLeft;
    if (this._timer.mode === MatchMode.TRANSITION) {
      displayTime = this._timer.modeTimeLeft;
    }
    if (this._timer.mode === MatchMode.AUTONOMOUS && this._timer.matchConfig.transitionTime > 0) {
      displayTime = this._timer.timeLeft - this._timer.matchConfig.transitionTime;
    }
    this.props.setMatchDuration(moment.duration(displayTime, "seconds"));
  }

  private onTabChange(event: SyntheticEvent, props: TabProps) {
    this.setState({activeIndex: parseInt(props.activeIndex as string, 10)});
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