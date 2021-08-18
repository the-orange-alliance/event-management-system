import * as React from 'react';
import {Cookies, withCookies} from 'react-cookie';
import './App.scss';
import BotMonitor from "./views/BotMonitor";
import MatchMonitor from "./views/MatchMonitor";
import {
  EMSProvider,
  Event,
  Match,
  MatchConfiguration,
  MatchMode,
  MatchTimer,
  SocketProvider
} from "@the-orange-alliance/lib-ems";
import {Container, Menu} from "semantic-ui-react";
import LoginContainer from "./views/LoginContainer";

interface IProps {
  cookies: Cookies
}

interface IState {
  event: Event,
  match: Match,
  connected: boolean,
  activeItem: number,
  loggedIn: boolean,
}

class App extends React.Component<IProps, IState> {

  private timer = new MatchTimer();

  constructor(props: IProps) {
    super(props);
    this.state = {
      event: new Event(),
      match: new Match(),
      connected: false,
      activeItem: 0,
      loggedIn: !!localStorage.getItem('auth'),
    };
    if (typeof this.props.cookies.get("host") !== "undefined") {
      EMSProvider.initialize((this.props.cookies.get("host") as string));
      SocketProvider.initialize((this.props.cookies.get("host") as string), EMSProvider);
    } else if (process.env.NODE_ENV === 'development') {
      EMSProvider.initialize('localhost', 8008);
      SocketProvider.initialize('localhost', EMSProvider);
    } else {
      EMSProvider.initialize("192.168.0.217");
      SocketProvider.initialize("192.168.0.217", EMSProvider);
    }

    const key = localStorage.getItem('auth');
    if(key) {
      EMSProvider.authOldKey(key).then((newKey) => {
        SocketProvider.reconnect();
        localStorage.setItem('auth', newKey);
        return EMSProvider.getEvent();
      }).then((events: Event[]) => {
        if (events.length > 0) {
          this.setState({event: events[0]});
        }
      });
    } else {
      // this probably won't work
      EMSProvider.getEvent().then((events: Event[]) => {
        if (events.length > 0) {
          this.setState({event: events[0]});
        }
      });
    }

    SocketProvider.on("connect", () => {
      console.log("Connected to SocketIO.");
      SocketProvider.emit('identify', 'field-monitor', ['scoring', 'event', 'fms', 'ref']);
      this.setState({connected: true});
    });
    SocketProvider.on("disconnect", () => {
      console.log("Disconnected from SocketIO.");
      this.setState({connected: false});
    });
    SocketProvider.on("enter-slave", (masterHost: string) => {
      console.log("Entered slave mode with master address " + masterHost);
      EMSProvider.initialize(masterHost);
    });
  }

  public componentDidMount() {
    if(window.location.pathname === '/monitor/fms') {
      this.setState({activeItem: 0})
    } else if(window.location.pathname === '/monitor/match') {
      this.setState({activeItem: 1})
    } else { // If this is an unrecognised URL, replace it with the correct one in history, rather than appending
      window.history.replaceState({activeItem: 0}, 'FMS Monitor | EMS', '/monitor/fms')
    }

    // This handler will be called when someone goes back in the history
    window.onpopstate = (event: PopStateEvent) => {
      if(event.state && event.state.activeItem !== undefined) {
        this.updateTab(event.state.activeItem, false);
      }
    };

    // Match Timer
    SocketProvider.on("match-start", (timerJSON: any) => {
      this.timer.matchConfig = new MatchConfiguration().fromJSON(timerJSON);
      this.timer.on("match-end", () => {
        this.timer.removeAllListeners("match-transition");
        this.timer.removeAllListeners("match-tele");
        this.timer.removeAllListeners("match-endgame");
        this.timer.removeAllListeners("match-end");
      });
      this.timer.start();
    });

    SocketProvider.on("match-abort", () => {
      this.timer.abort();
      this.timer.removeAllListeners("match-transition");
      this.timer.removeAllListeners("match-tele");
      this.timer.removeAllListeners("match-endgame");
      this.timer.removeAllListeners("match-end");
    });

    SocketProvider.emit('get-timer');
    SocketProvider.once('get-timer-response', (mode, timeLeft, modeTimeLeft, timerConfig) => {
      if(mode > MatchMode.PRESTART && mode < MatchMode.ENDED) {
        this.timer.matchConfig = new MatchConfiguration().fromJSON(timerConfig);
        this.timer.start();
        this.timer.timeLeft = timeLeft;
        this.timer.modeTimeLeft = modeTimeLeft;
        this.timer.mode = mode;
        this.timer.on("match-end", () => {
          this.timer.removeAllListeners("match-transition");
          this.timer.removeAllListeners("match-tele");
          this.timer.removeAllListeners("match-endgame");
          this.timer.removeAllListeners("match-end");
        });
      }
    })
  }

  public updateTab(tabNum: number, updateState: boolean = true) {
    switch (tabNum) {
      case 0:
        this.setState({activeItem: 0});
        if (updateState) window.history.pushState({activeItem: 0}, 'FMS Monitor | EMS', '/monitor/fms');
        break;
      case 1:
        this.setState({activeItem: 1});
        if (updateState) window.history.pushState({activeItem: 1}, 'Match Monitor | EMS', '/monitor/match');
        break;
    }
  }

  public render() {
    const {activeItem, connected} = this.state;
    return (
      <>
        <Menu stackable>
          <Menu.Item><h2>EMS Field Monitor</h2></Menu.Item>
          {this.state.loggedIn &&
            <>
                <Menu.Item name='fieldmon' active={activeItem === 0} onClick={() => this.updateTab(0)}>FMS Monitor</Menu.Item>
                <Menu.Item name='matchmon' active={activeItem === 1} onClick={() => this.updateTab(1)}>Match Monitor</Menu.Item>

                <Menu.Menu position='right'>
                    <Menu.Item>
                        Event:<span className={this.state.event.eventName ? "success" : "error"}>{this.state.event.eventName ? this.state.event.eventName : "None"}</span>
                    </Menu.Item>
                    <Menu.Item position='right'>
                        EMS Status:<span className={connected ? "success" : "error"}>{connected ? "Connected" : "Not Connected"}</span>
                    </Menu.Item>
                </Menu.Menu>
            </>
          }
        </Menu>
        <Container>
          { this.state.loggedIn &&
            <>
              { activeItem === 0 &&
              <BotMonitor event={this.state.event} match={this.state.match} connected={this.state.connected} timer={this.timer}/>
              }
              { activeItem === 1 &&
              <MatchMonitor event={this.state.event} match={this.state.match} connected={this.state.connected} />
              }
            </>
          }
          { !this.state.loggedIn &&
            <LoginContainer callback={() => {this.setState({loggedIn: true});}} />
          }
        </Container>
      </>
    );
  }
}

export default withCookies(App);
