import * as React from 'react';
import './RankingsScreen.css';
import Event from "../../../shared/models/Event";
import EMSProvider from "../../../shared/providers/EMSProvider";
import Team from "../../../shared/models/Team";
import {AxiosResponse} from "axios";
import RoverRuckusRank from "../../../shared/models/RoverRuckusRank";

import FIRST_LOGO from "../res/FIRST_logo_transparent.png";
import RR_LOGO from "../res/rr_logo_transparent.png";

interface IProps {
  event: Event
}

interface IState {
  rankings: RoverRuckusRank[],
  loading: boolean
}

class RankingsScreen extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      rankings: [],
      loading: true
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
        this.setState({rankings: rankings, loading: false});
      } else {
        this.setState({loading: false});
      }
    }).catch((error: any) => {
      console.error(error);
      this.setState({loading: false});
    });
  }

  public render() {
    const {event} = this.props;
    const {loading, rankings} = this.state;

    const rankingsView = rankings.map((ranking: RoverRuckusRank) => {
      return (
        <tr key={ranking.rankKey}>
          <td className="rr-rank">{ranking.rank}</td>
          <td className="rr-team">{ranking.teamKey}</td>
          <td className="rr-rp">{ranking.rankingPoints}</td>
          <td className="rr-tbp">{ranking.tiebreakerPoints}</td>
          <td className="rr-high">{ranking.highScore}</td>
          <td className="rr-play">{ranking.played}</td>
        </tr>
      );
    });

    return !loading ? (
      <div id="rr-body">
        <div id="rr-container">
          <div id="rr-rank-top" className="rr-border">
            <div className="col-left"><img src={FIRST_LOGO} className="fit-h"/></div>
            <div className="center-items rr-pre-match">{event.eventName}</div>
            <div className="col-right"><img src={RR_LOGO} className="fit-h"/></div>
          </div>
          <div id="rr-rank-mid" className="rr-border">
            <div id="rr-rank-table-container">
              <table>
                <thead>
                  <tr>
                    <th className="rr-rank">Rank</th>
                    <th className="rr-team">Team #</th>
                    <th className="rr-rp">Ranking Points</th>
                    <th className="rr-tbp">Tiebreaker Points</th>
                    <th className="rr-high">Highest Score</th>
                    <th className="rr-play">Matches Played</th>
                  </tr>
                </thead>
                <tbody>
                  {rankingsView}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    ) : <span/>;
  }
}

export default RankingsScreen;