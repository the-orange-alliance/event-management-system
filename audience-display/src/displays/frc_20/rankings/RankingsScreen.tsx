import * as React from 'react';
import "./RankingsScreen.css";
import {EMSProvider, Ranking, Event, InfiniteRechargeRank} from "@the-orange-alliance/lib-ems";
import FACC_LOGO from "../res/facc-large-bg-dark.png";
import FACC_LOGO_TEXT from "../res/facc-large-text-underneath-bg-dark.png";
import TOA_LOGO from "../res/toa-generic-lol.png";

interface IProps {
  event: Event;
}

interface IState {
  rankings: InfiniteRechargeRank[],
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
    const {event} = this.props;
    EMSProvider.getRankingTeams(event.eventType).then((rankings: Ranking[]) => {
      if (rankings.length > 0) {
        this.setState({rankings: rankings as InfiniteRechargeRank[], loading: false});
      } else {
        this.setState({loading: false});
      }
    }).catch((error: any) => {
      this.setState({loading: false});
    });
  }

  public render() {
    const {event} = this.props;
    const {loading, rankings} = this.state;
    const rankingsView = rankings.map((ranking: InfiniteRechargeRank) => {
      const displayName = typeof ranking.team !== "undefined" ? ranking.team.teamNameShort : ranking.teamKey;
      return (
        <tr key={ranking.rankKey}>
          <td className="ir-rank">{ranking.rank}</td>
          <td className="ir-team">{displayName}</td>
          <td className="ir-record">{ranking.wins}-{ranking.losses}-{ranking.ties}</td>
          <td className="ir-rp">{ranking.rankingScore}</td>
          <td className="ir-rs">{ranking.rankingPoints}</td>
          <td className="ir-auto">{ranking.autoPoints}</td>
          <td className="ir-end">{ranking.endPoints}</td>
          <td className="ir-tele">{ranking.telePoints}</td>
        </tr>
      )
    });
    return !loading && (
      <div id="ir-body">
        <div id="ir-container">
          <div id="ir-rank-top" className="ir-border">
            <div className="col-left"><img src={TOA_LOGO} className="fit-h"/></div>
            <div className="center-items ir-rank-title">Event Rankings</div>
            <div className="col-right"><img src={FACC_LOGO} className="fit-h"/></div>
          </div>
          <div id="ir-rank-mid" className="ir-border">
            <div id="ir-rank-table-container">
              <table>
                <thead>
                <tr>
                  <th className="ir-rank">Rank</th>
                  <th className="ir-team">Team #</th>
                  <th className="ir-record">W-L-T</th>
                  <th className="ir-rp">RP</th>
                  <th className="ir-rs">RS</th>
                  <th className="ir-auto">Auto</th>
                  <th className="ir-end">End</th>
                  <th className="ir-tele">Tele</th>
                </tr>
                </thead>
                <tbody id="ir-rank-scrollview">
                {rankingsView}
                </tbody>
              </table>
            </div>
          </div>
          <div id="ir-rank-bot" className="ir-border">
            <div className="ir-bot-logo"><img src={FACC_LOGO_TEXT} className="fit-h"/></div>
            <div className="ir-bot-text">
              <span>{event.eventName}</span>
              <span>Watch live! https://twitch.tv/FirstUpdatesNow</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default RankingsScreen;