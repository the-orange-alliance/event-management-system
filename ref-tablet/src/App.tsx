import * as React from 'react';
import {Cookies, withCookies} from 'react-cookie';
import './App.css';
import {Redirect, Route, RouteComponentProps} from "react-router";
import LoginView from "./views/LoginView";
import MainView from "./views/MainView";
import RedView from "./views/RedView";
import BlueView from "./views/BlueView";
import HeadRefereeView from "./views/HeadRefereeView";
import {EMSProvider, Event, Team, Match, MatchParticipant, Ranking, SocketProvider} from "@the-orange-alliance/lib-ems";

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
    if (typeof this.props.cookies.get("host") !== "undefined") {
      SocketProvider.initialize((this.props.cookies.get("host") as string));
      EMSProvider.initialize((this.props.cookies.get("host") as string));
    } else {
      EMSProvider.initialize("192.168.0.217");
      SocketProvider.initialize("192.168.0.217");
    }

    SocketProvider.on("connect", () => {
      console.log("Connected to SocketIO.");
      SocketProvider.emit("identify","ref-tablet", ["event", "scoring", "referee"]);
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
    SocketProvider.on("prestart-response", (err: any, matchJSON: any) => {
      const match: Match = new Match().fromJSON(matchJSON);
      const seasonKey: string = match.matchKey.split("-")[0];
      match.matchDetails = Match.getDetailsFromSeasonKey(seasonKey).fromJSON(matchJSON.details);
      if (typeof matchJSON.participants !== "undefined") {
        match.participants = matchJSON.participants.map((pJSON: any) => new MatchParticipant().fromJSON(pJSON));
      }
      this.getParticipantInformation(match).then((participants: MatchParticipant[]) => {
        if (participants.length > 0) {
          match.participants = participants;
        }
        this.setState({match: match});
      });
    });
    SocketProvider.on("score-update", (matchJSON: any) => {
      const oldMatch = this.state.match;
      const match: Match = new Match().fromJSON(matchJSON);
      const seasonKey: string = match.matchKey.split("-")[0];
      match.matchDetails = Match.getDetailsFromSeasonKey(seasonKey).fromJSON(matchJSON.details);
      match.participants = matchJSON.participants.map((pJSON: any) => new MatchParticipant().fromJSON(pJSON));
      match.participants.sort((a: MatchParticipant, b: MatchParticipant) => a.station - b.station);
      for (let i = 0; i < match.participants.length; i++) {
        if (typeof oldMatch.participants !== "undefined" && typeof oldMatch.participants[i].team !== "undefined") {
          match.participants[i].team = oldMatch.participants[i].team; // Both are sorted by station, so we can safely assume/do this.
        }
      }
      this.setState({match: match});
    });
    SocketProvider.on("prestart-cancel", () => {
      const match: Match = new Match();
      const seasonKey: string = this.state.event.season.seasonKey + "";
      match.participants = [];
      match.matchDetails = Match.getDetailsFromSeasonKey(seasonKey);
      this.setState({match: match});
    });
    EMSProvider.getEvent().then((events: Event[]) => {
      if (events.length > 0) {
        this.setState({event: events[0]});
      }
    });

    this.renderLoginView = this.renderLoginView.bind(this);
    this.renderRedView = this.renderRedView.bind(this);
    this.renderBlueView = this.renderBlueView.bind(this);
    this.renderHeadRefereeView = this.renderHeadRefereeView.bind(this);
    this.renderMainView = this.renderMainView.bind(this);
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
      return <LoginView cookies={this.props.cookies} event={this.state.event} onSuccessfulLogin={navigateToMain}/>;
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

  private getParticipantInformation(match: Match): Promise<MatchParticipant[]> {
    return new Promise<MatchParticipant[]>((resolve, reject) => {
      EMSProvider.getMatchTeams(match.matchKey).then((matchTeams: MatchParticipant[]) => {
        const participants: MatchParticipant[] = [];
        const matchTeamKeys = matchTeams.map((p: MatchParticipant) => p.teamKey);
        match.participants.sort((a: MatchParticipant, b: MatchParticipant) => a.station - b.station);
        for (let i = 0; i < match.participants.length; i++) {
          const participant: MatchParticipant = match.participants[i];
          if (matchTeamKeys.includes(participant.teamKey)) {
            const index = matchTeamKeys.indexOf(participant.teamKey);
            const newParticipant: MatchParticipant = matchTeams[index];
            newParticipant.cardStatus = participant.cardStatus;
            participants.push(newParticipant);
          } else {
            if (typeof participant.team === "undefined") {
              const team: Team = new Team();
              team.teamKey = i;
              team.teamNameShort = "Test Team #" + (i + 1);
              team.country = "TST";
              team.countryCode = "us";
              participant.team = team;
            }
            if (typeof participant.teamRank === "undefined") {
              const ranking: Ranking = new Ranking();
              ranking.rank = 0;
              participant.teamRank = ranking;
            }
            participants.push(participant);
          }
        }
        resolve(participants);
      });
    });
  }
}

export default withCookies(App);