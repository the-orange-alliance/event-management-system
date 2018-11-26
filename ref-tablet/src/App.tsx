import * as React from 'react';
import {Cookies, withCookies} from 'react-cookie';
import './App.css';
import Event from "./shared/models/Event";
import {Redirect, Route, RouteComponentProps} from "react-router";
import LoginView from "./views/LoginView";
import MainView from "./views/MainView";
import RedView from "./views/RedView";
import BlueView from "./views/BlueView";
import HeadRefereeView from "./views/HeadRefereeView";
import EMSProvider from "./shared/providers/EMSProvider";
import SocketProvider from "./shared/providers/SocketProvider";
import {AxiosResponse} from "axios";
import Match from "./shared/models/Match";
import MatchParticipant from "./shared/models/MatchParticipant";
import RoverRuckusMatchDetails from "./shared/models/RoverRuckusMatchDetails";

interface IProps {
  cookies: Cookies
}

interface IState {
  event: Event,
  match: Match,
  connected: boolean
}

class App extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      event: new Event(),
      match: new Match(),
      connected: false
    };
    this.renderLoginView = this.renderLoginView.bind(this);
    this.renderRedView = this.renderRedView.bind(this);
    this.renderBlueView = this.renderBlueView.bind(this);
    this.renderHeadRefereeView = this.renderHeadRefereeView.bind(this);
    this.renderMainView = this.renderMainView.bind(this);
  }

  public componentDidMount() {
    EMSProvider.initialize("127.0.0.1");
    SocketProvider.initialize("127.0.0.1");
    SocketProvider.on("connect", () => {
      console.log("Connected to SocketIO.");
      SocketProvider.emit("identify","ref-tablet", "event", "scoring", "referee");
      this.setState({connected: true});
    });
    SocketProvider.on("disconnect", () => {
      console.log("Disconnected from SocketIO.");
      this.setState({connected: false});
    });
    SocketProvider.on("score-update", (matchJSON: any) => {
      const match: Match = new Match().fromJSON(matchJSON);
      if (typeof matchJSON.details !== "undefined") {
        const seasonKey: number = parseInt(match.matchKey.split("-")[0], 10);
        match.matchDetails = Match.getDetailsFromSeasonKey(seasonKey).fromJSON(matchJSON.details);
      }
      if (typeof matchJSON.participants !== "undefined") {
        match.participants = matchJSON.participants.map((p: any) => new MatchParticipant().fromJSON(p));
      }
      this.setState({match: match});
    });
    EMSProvider.getEvent().then((response: AxiosResponse) => {
      if (response.data.payload && response.data.payload.length > 0) {
        this.setState({event: new Event().fromJSON(response.data.payload[0])});
      }
    });
    // TODO - Remove after testing.
    this.state.match.matchDetails = new RoverRuckusMatchDetails();
  }

  public render() {
    return (
      <div id="app-container">
        <Route exact={true} path="/" render={this.renderLoginView}/>
        <Route path="/main" render={this.renderMainView}/>
        <Route path="/red-view" render={this.renderRedView}/>
        <Route path="/blue-view" render={this.renderBlueView}/>
        <Route path="/ref-view" render={this.renderHeadRefereeView}/>
      </div>
    );
  }

  private navigateToMain(props: RouteComponentProps<any>) {
    props.history.push("/main");
  }

  private navigateToLogin(props: RouteComponentProps<any>) {
    props.history.push("/");
  }

  private navigateToRedView(props: RouteComponentProps<any>) {
    props.history.push("/red-view");
  }

  private navigateToBlueView(props: RouteComponentProps<any>) {
    props.history.push("/blue-view");
  }

  private navigateToHeadRefView(props: RouteComponentProps<any>) {
    props.history.push("/ref-view");
  }

  private renderLoginView(props: RouteComponentProps<any>) {
    const navigateToMain = this.navigateToMain.bind(this, props);
    if (typeof this.props.cookies.get("login") !== "undefined" &&
      this.props.cookies.get("login")) {
      return <Redirect to={"/main"}/>
    } else {
      return <LoginView cookies={this.props.cookies} onSuccessfulLogin={navigateToMain}/>;
    }
  }

  private renderRedView(props: RouteComponentProps<any>) {
    if (typeof this.props.cookies.get("login") === "undefined" ||
      !this.props.cookies.get("login")) {
      return <Redirect to={"/"}/>
    } else {
      return <RedView event={this.state.event} match={this.state.match} connected={this.state.connected}/>;
    }
  }

  private renderBlueView(props: RouteComponentProps<any>) {
    if (typeof this.props.cookies.get("login") === "undefined" ||
      !this.props.cookies.get("login")) {
      return <Redirect to={"/"}/>
    } else {
      return <BlueView event={this.state.event} match={this.state.match} connected={this.state.connected}/>;
    }
  }

  private renderHeadRefereeView(props: RouteComponentProps<any>) {
    if (typeof this.props.cookies.get("login") === "undefined" ||
      !this.props.cookies.get("login")) {
      return <Redirect to={"/"}/>
    } else {
      return <HeadRefereeView/>;
    }
  }

  private renderMainView(props: RouteComponentProps<any>) {
    const navigateToLogin = this.navigateToLogin.bind(this, props);
    const navigateToRed = this.navigateToRedView.bind(this, props);
    const navigateToBlue = this.navigateToBlueView.bind(this, props);
    const navigateToHeadRef = this.navigateToHeadRefView.bind(this, props);
    return <MainView
      cookies={this.props.cookies}
      onLoginFailure={navigateToLogin}
      connected={this.state.connected}
      onRedAllianceLogin={navigateToRed}
      onBlueAllianceLogin={navigateToBlue}
      onHeadRefereeLogin={navigateToHeadRef}
      event={this.state.event}
    />;
  }
}

export default withCookies(App);