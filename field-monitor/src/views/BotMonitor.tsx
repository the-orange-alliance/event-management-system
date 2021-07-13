import * as React from 'react';
import {
  EMSProvider,
  Event,
  Match, MatchMode,
  MatchParticipant,
  MatchTimer,
  Ranking,
  SocketProvider,
  Team
} from "@the-orange-alliance/lib-ems";
import {Grid, Icon, SemanticCOLORS} from "semantic-ui-react";

interface IProps {
  event: Event,
  match: Match,
  connected: boolean,
  timer: MatchTimer
}

interface IState {
  mode: string,
  waitingForMatch: boolean,
  modeColor: SemanticCOLORS | undefined,
  currentMatch: Match,
  currentTime: number,
  driverStations: any[],
  dsReady: boolean,
  apReady: boolean,
  switchReady: boolean
}

class BotMonitor extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      mode: "Unknown",
      waitingForMatch: true,
      modeColor: "red",
      currentMatch: new Match(),
      currentTime: -1,
      driverStations: [],
      dsReady: false,
      apReady: false,
      switchReady: false
    };
  }

  public componentDidMount() {
    SocketProvider.emit("get-mode");
    SocketProvider.on("mode-update", (mode: string) => {
      this.modeUpdate(mode);
    });
    SocketProvider.on("match-start", () => {
      this.setState({mode: "Match Started", modeColor: "green"});
      this.registerTimerInterval();
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
    SocketProvider.on("ds-update", (dsData) => {
      this.setState({driverStations: dsData});
    });
    SocketProvider.on("prestart-response", (err: any, matchJSON: any) => {
      if (!err) {
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
          this.setState({mode: "Prestarting", modeColor: "grey", currentMatch: match, dsReady: false, apReady: false, switchReady: false});
        });
      } else {
        const m = new Match();
        m.matchName = 'Unknown'
        this.setState({mode: "Prestarting", modeColor: "grey", currentMatch: m});
      }
    });

    SocketProvider.on("score-update", (matchJSON: any) => {
      const oldMatch = this.state.currentMatch;
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
      this.setState({currentMatch: match});
    });

    SocketProvider.on("prestart-cancel", () => {
      this.setState({mode: "Prestart Canceled", modeColor: "red", currentMatch: new Match()});
    });

    SocketProvider.on("fms-ds-ready", () => {
      this.setState({dsReady: true});
    });

    SocketProvider.on("fms-ap-ready", () => {
      this.setState({apReady: true});
    });

    SocketProvider.on("fms-switch-ready", () => {
      this.setState({switchReady: true});
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
    SocketProvider.off("ds-update");
    SocketProvider.off("prestart-response");
    SocketProvider.off("score-update");
    SocketProvider.off("prestart-cancel");
    SocketProvider.off("fms-ds-ready");
    SocketProvider.off("fms-ap-ready");
    SocketProvider.off("fms-switch-ready");
  }

  private modeUpdate(mode: string) {
    // if match is running, register timer interval
    const matchRunningModes = ['AUTONOMOUS', 'TELEOP', 'ENDGAME'];
    if(matchRunningModes.includes(mode)) this.registerTimerInterval();
    if(mode === 'UNDEFINED') this.setState({mode: 'Unknown', modeColor: "red", currentMatch: new Match()})
    else if(mode === 'PRESTART') this.setState({mode: 'Prestarting', modeColor: "grey"})
    else if(mode === 'AUTONOMOUS') this.setState({mode: 'Autonomous', modeColor: "green"})
    else if(mode === 'TELEOP') this.setState({mode: 'Teleop', modeColor: "green"})
    else if(mode === 'ENDGAME') this.setState({mode: 'Endgame', modeColor: "yellow"})
    else if(mode === 'MATCH ABORTED') this.setState({mode: 'Match Aborted', modeColor: "brown"})
    else if(mode === 'MATCH END') this.setState({mode: 'Match Over', modeColor: "red"})
    else this.setState({mode: mode, modeColor: 'yellow'});
  }

  private registerTimerInterval() {
    const timer = this.props.timer;
    const timerID = global.setInterval(() => {
      let displayTime: number = timer.timeLeft;
      if (timer.mode === MatchMode.TRANSITION) {
        displayTime = timer.modeTimeLeft;
      }
      if (timer.mode === MatchMode.AUTONOMOUS && timer.matchConfig.transitionTime > 0) {
        displayTime = timer.timeLeft - timer.matchConfig.transitionTime;
      }
      this.setState({currentTime: displayTime})
      if (this.props.timer.timeLeft <= 0) {
        global.clearInterval(timerID);
      }
    }, 1000);
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

  private friendlyMatchNum(m: Match) {
    const split = m?.matchKey.split('-');
    const number = split[split?.length-1].substr(1);
    if (m.tournamentLevel === Match.FINALS_LEVEL) {
      return `F-${parseInt(number)}`
    } else if (m.tournamentLevel === Match.SEMIFINALS_level) {
      return `SF-${number.charAt(1)}-${number.charAt(2)}`
    } else if (m.tournamentLevel === Match.QUARTERFINALS_LEVEL) {
      return `QF-${number.charAt(1)}-${number.charAt(2)}`
    } else if (m.tournamentLevel === Match.OCTOFINALS_LEVEL) {
      return `OF-${number.charAt(1)}-${number.charAt(2)}`
    } else if (m.tournamentLevel === Match.QUALIFICATION_LEVEL) {
      return `Q-${parseInt(number)}`
    } else if (m.tournamentLevel === Match.PRACTICE_LEVEL) {
      return `P-${parseInt(number)}`
    } else if (m.tournamentLevel === -1) {
      return `Test`
    } else {
      return '???'
    }
  }

  private checkOrEx(boolVal: boolean) {
    return boolVal ? <Icon name={'check'} /> : <Icon name={'x'} />
  }

  private renderHeaderFooter(mode: string, apReady: boolean, dsReady: boolean, switchReady: boolean, currentMatch: Match, modeColor: SemanticCOLORS | undefined, currentTime: number) {
    let m;
    if (this.state.mode === 'Prestarting' && (!apReady || !dsReady || !switchReady)) {
      console.log(dsReady)
      m = <>
        <h1>
          {`Prestarting:`}
          {` EMS: `}{this.checkOrEx(true)}
          {` AP: `}{this.checkOrEx(apReady)}
          {` DS: `}{this.checkOrEx(dsReady)}
          {` Field Switch: `}{this.checkOrEx(switchReady)}
        </h1>
      </>
    } else if (mode === 'Prestarting' && apReady && dsReady && switchReady) {
      m = <h1>{`Prestart Complete`}</h1>
    } else {
      m = <h1>{`${mode}${currentTime > 0 ? ` (${currentTime}s)` : ''}`}</h1>
    }
    return (
      <Grid columns={2}>
        <Grid.Column className={'grid-border'} color={"grey"} width={3}>
          <h1>{`M: ${this.friendlyMatchNum(currentMatch)}`}</h1>
        </Grid.Column>
        <Grid.Column className={'grid-border text-center'} color={modeColor} floated={'right'} width={"13"}>
          {m}
        </Grid.Column>
      </Grid>
    )
  }

  public render() {
    const match = this.state.currentMatch;
    const mode = this.state.mode;
    const apReady = this.state.apReady;
    const dsReady = this.state.dsReady;
    const switchReady = this.state.switchReady;
    const modeColor = this.state.modeColor;
    const currentTime = this.state.currentTime;
    return (
    <>
      {this.renderHeaderFooter(mode, apReady, dsReady, switchReady, match, modeColor, currentTime)}
      <Grid className={'text-center'} columns={10}>
        <Grid.Column className={'grid-border notop noleft'} color={"black"}>
          <h4>Station</h4>
        </Grid.Column>
        <Grid.Column className={'grid-border notop noleft'} color={"black"}>
          <h4>Team</h4>
        </Grid.Column>
        <Grid.Column className={'grid-border notop noleft'} color={"black"}>
          <h4>DS</h4>
        </Grid.Column>
        <Grid.Column className={'grid-border notop noleft'} color={"black"}>
          <h4>Bandwidth Usage</h4>
        </Grid.Column>
        <Grid.Column className={'grid-border notop noleft'} color={"black"}>
          <h4>Radio</h4>
        </Grid.Column>
        <Grid.Column className={'grid-border notop noleft'} color={"black"}>
          <h4>Rio</h4>
        </Grid.Column>
        <Grid.Column className={'grid-border notop noleft'} color={"black"}>
          <h4>Battery</h4>
        </Grid.Column>
        <Grid.Column className={'grid-border notop noleft'} color={"black"}>
          <h4>Status</h4>
        </Grid.Column>
        <Grid.Column className={'grid-border notop noleft'} color={"black"}>
          <h4>Trip Time (ms)</h4>
        </Grid.Column>
        <Grid.Column className={'grid-border notop noleft'} color={"black"}>
          <h4>Missed Packets</h4>
        </Grid.Column>
      </Grid>
      {
        match?.participants?.map((p) => {
          const ds = this.state.driverStations.find(v => v.team_id === p.teamKey)
          const problem = ds?.estop || !ds?.radio_linked || !ds?.robot_linked;
          return (
            <Grid className={'text-center'} columns={10} key={p.teamKey}>
              <Grid.Column className={'d-flex justify-content-center grid-border notop'} color={p.station < 20 ? 'red' : 'blue'}>
                <h3 className={'align-self-center'}>{p.station.toString().charAt(1)}</h3>
              </Grid.Column>
              <Grid.Column className={'d-flex justify-content-center grid-border notop noleft'} color={p.station < 20 ? 'red' : 'blue'}>
                <h1 className={'align-self-center'}>{p.teamKey}</h1>
              </Grid.Column>
              <Grid.Column className={'grid-border notop noleft p-1'} color={problem ? 'yellow' : undefined}>
                {ds?.ds_linked ? <div className={'conn-good'} /> : <div className={'conn-bad'} />}
              </Grid.Column>
              <Grid.Column className={'d-flex justify-content-center grid-border notop noleft p-1'} color={problem ? 'yellow' : undefined}>
                <h1 className={'text-black align-self-center'}>{' ?'}</h1>
              </Grid.Column>
              <Grid.Column className={'grid-border notop noleft p-1'} color={problem ? 'yellow' : undefined}>
                {ds?.radio_linked ? <div className={'conn-good'} /> : <div className={'conn-bad'} />}
              </Grid.Column>
              <Grid.Column className={'grid-border notop noleft p-1'} color={problem ? 'yellow' : undefined}>
                {ds?.robot_linked ? <div className={'conn-good'} /> : <div className={'conn-bad'} />}
              </Grid.Column>
              <Grid.Column className={'d-flex justify-content-center grid-border notop noleft p-1'} color={problem ? 'yellow' : undefined}>
                <h1 className={'text-black align-self-center'}>{((ds?.batt_voltage as number) || 0).toPrecision(4) + ' v'}</h1>
              </Grid.Column>
              <Grid.Column className={'grid-border notop noleft p-1'} color={problem ? 'yellow' : undefined}>
                {
                  (ds?.estop) ? <div className={'estop-diamond'} >E</div> :
                  (ds?.auto && !problem && ds.enabled) ?  <div className={'conn-good'}>A</div> : // no problems, auto, enabled
                  (!ds?.auto && !problem && ds.enabled) ?  <div className={'conn-good'}>T</div> : // no problems, tele, enabled
                  (ds?.auto && !problem && !ds.enabled) ?  <div className={'conn-bad'}>A</div> :  // no problems, auto, disabled
                  (!ds?.auto && !problem && !ds.enabled) ?  <div className={'conn-bad'}>T</div> : // no problems, tele, disabled
                  (ds?.auto && problem && this.state.currentTime > 0) ?  <div className={'conn-bad'}>A</div> : // problems, auto, match in progress
                  (!ds?.auto && problem && this.state.currentTime > 0) ?  <div className={'conn-bad'}>T</div> : // problems, tele, match in progress
                  (problem && this.state.currentTime < 1) ?  <div className={'conn-bad'}/> :                    // problems, postmatch
                  (!ds?.auto && problem && this.state.currentTime < 1) ?  <div className={'conn-bad'}>A</div> : // This is intentionally left at "A"
                  <div className={'conn-bad'}>?</div>
                }
              </Grid.Column>
              <Grid.Column className={'d-flex justify-content-center grid-border notop noleft p-1'} color={problem ? 'yellow' : undefined}>
                <h1 className={'text-black align-self-center'}>{ds?.robot_trip_time_ms}</h1>
              </Grid.Column>
              <Grid.Column className={'d-flex justify-content-center grid-border notop noleft p-1'} color={problem ? 'yellow' : undefined}>
                <h1 className={'text-black align-self-center'}>{ds?.missed_packet_count}</h1>
              </Grid.Column>
            </Grid>
          )
        })
      }
      {this.renderHeaderFooter(mode, apReady, dsReady, switchReady, match, modeColor, currentTime)}
    </>
    )
  }
}


export default BotMonitor;
