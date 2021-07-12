import * as React from 'react';
import {Cookies, withCookies} from 'react-cookie';
import './App.css';
import BotMonitor from "./views/BotMonitor";
import MatchMonitor from "./views/MatchMonitor";
import {EMSProvider, Event, Team, Match, MatchParticipant, Ranking, SocketProvider} from "@the-orange-alliance/lib-ems";
import {Container, Menu} from "semantic-ui-react";

interface IProps {
  cookies: Cookies
}

interface IState {
  event: Event,
  match: Match,
  connected: boolean,
  activeItem: number
}

class App extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      event: new Event(),
      match: new Match(),
      connected: false,
      activeItem: 0
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
  }

  public updateTab(tabNum: number, updateState: boolean = true) {
    switch (tabNum) {
      case 0:
        this.setState({activeItem: 0})
        if (updateState) window.history.pushState({activeItem: 0}, 'FMS Monitor | EMS', '/monitor/fms')
        break;
      case 1:
        this.setState({activeItem: 1})
        if (updateState) window.history.pushState({activeItem: 1}, 'Match Monitor | EMS', '/monitor/match')
        break;
    }
  }

  public render() {
    const {activeItem, connected} = this.state;
    return (
      <>
        <Menu stackable>
          <Menu.Item><h2>EMS Field Monitor</h2></Menu.Item>
          <Menu.Item name='fieldmon' active={activeItem === 0} onClick={() => this.updateTab(0)}>FMS Monitor</Menu.Item>
          <Menu.Item name='matchmon' active={activeItem === 1} onClick={() => this.updateTab(1)}>Match Monitor</Menu.Item>
          <Menu.Item position='right'>
            EMS Status:<span className={connected ? "success" : "error"}>{connected ? "CONNECTED" : "NOT CONNECTED"}</span>
          </Menu.Item>
        </Menu>
        <Container>
          { activeItem === 0 &&
          <BotMonitor event={this.state.event} match={this.state.match} connected={this.state.connected} />
          }
          { activeItem === 1 &&
          <MatchMonitor event={this.state.event} match={this.state.match} connected={this.state.connected} />
          }
        </Container>
      </>
    );
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