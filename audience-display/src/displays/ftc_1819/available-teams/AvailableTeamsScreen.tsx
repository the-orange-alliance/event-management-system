import * as React from 'react';
import "./AvailableTeamsScreen.css";
import {EMSProvider, Event, RoverRuckusRank, SocketProvider} from "@the-orange-alliance/lib-ems";
import FIRST_LOGO from "../res/FIRST_logo_transparent.png";
import RR_LOGO from "../res/rr_logo_transparent.png";
import Ranking from "@the-orange-alliance/lib-ems/dist/models/ems/Ranking";

interface IProps {
  event: Event
}

interface IState {
  rankings: RoverRuckusRank[],
  teamsList: number[]
}

class AvailableTeamsScreen extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      rankings: [],
      teamsList: []
    };
  }

  public componentDidMount() {
    EMSProvider.getRankingTeams().then((rankings: Ranking[]) => {
      if (rankings.length > 0) {
        this.setState({rankings: rankings as RoverRuckusRank[]});
      }
    }).catch((error: any) => {
      console.error(error);
    });
    SocketProvider.on("alliance-update", (teamsList: number[]) => {
      this.setState({teamsList});
    });
  }

  public componentWillUnmount() {
    SocketProvider.off("alliance-update");
  }

  public render() {
    const {event} = this.props;
    const {rankings, teamsList} = this.state;

    const rankingsView = rankings.map((ranking: RoverRuckusRank) => {
      return (
        <td key={ranking.rankKey} className={teamsList.indexOf(ranking.teamKey) > -1 ? "selected" : ""}>{ranking.rank} - {ranking.teamKey}</td>
      );
    });

    const rows: any[] = [];
    let columns: any[] = [];
    for (let i = 0; i < rankingsView.length; i++) {
      columns.push(rankingsView[i]);
      if (i % 8 === 7) {
        // New row
        rows.push(<tr key={i}>{columns}</tr>);
        columns = [];
      }
    }

    if (columns.length > 0) {
      rows.push(<tr key={rows.length + 1}>{columns}</tr>);
    }

    return (
      <div id="rr-body">
        <div id="rr-container">
          <div id="rr-at-top" className="rr-border">
            <div className="col-left"><img alt={'FIRST logo'} src={FIRST_LOGO} className="fit-h"/></div>
            <div className="center-items rr-pre-match">{event.eventName}</div>
            <div className="col-right"><img alt={'Rover Ruckus logo'} src={RR_LOGO} className="fit-h"/></div>
          </div>
          <div id="rr-at-mid" className="rr-border">
            <table>
              <tbody>
              {rows}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default AvailableTeamsScreen;
