import * as React from 'react';
import "./AvailableTeamsScreen.css";
import Event from "../../../shared/models/Event";

import FIRST_LOGO from "../res/FIRST_logo_transparent.png";
import RR_LOGO from "../res/rr_logo_transparent.png";
import Team from "../../../shared/models/Team";
import EMSProvider from "../../../shared/providers/EMSProvider";
import RoverRuckusRank from "../../../shared/models/RoverRuckusRank";
import {AxiosResponse} from "axios";

interface IProps {
  event: Event
}

interface IState {
  rankings: RoverRuckusRank[]
}

class AvailableTeamsScreen extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      rankings: []
    };
  }

  public componentDidMount() {
    EMSProvider.getRankingTeams().then((response: AxiosResponse) => {
      if (response.data && response.data.payload && response.data.payload.length > 0) {
        const rankings: RoverRuckusRank[] = [];
        for (const rankJSON of response.data.payload) {
          const ranking: RoverRuckusRank = new RoverRuckusRank().fromJSON(rankJSON);
          ranking.team = new Team().fromJSON(rankJSON);
          rankings.push(ranking);
        }
        this.setState({rankings: rankings});
      }
    }).catch((error: any) => {
      console.error(error);
    });
  }

  public render() {
    const {event} = this.props;
    const {rankings} = this.state;

    const rankingsView = rankings.map((ranking: RoverRuckusRank) => {
      return (
        <td key={ranking.rankKey}>{ranking.rank} - {ranking.teamKey}</td>
      );
    });

    const rows: any[] = [];
    let columns: any[] = [];
    for (let i = 0; i < rankingsView.length; i++) {
      columns.push(rankingsView[i]);
      if (i % 8 === 7) {
        // New row
        rows.push(<tr>{columns}</tr>);
        columns = [];
      }
    }

    if (columns.length > 0) {
      rows.push(<tr>{columns}</tr>);
    }

    return (
      <div id="rr-body">
        <div id="rr-container">
          <div id="rr-at-top" className="rr-border">
            <div className="col-left"><img src={FIRST_LOGO} className="fit-h"/></div>
            <div className="center-items rr-pre-match">{event.eventName}</div>
            <div className="col-right"><img src={RR_LOGO} className="fit-h"/></div>
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