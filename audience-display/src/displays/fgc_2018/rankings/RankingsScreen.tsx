import * as React from "react";
import EMSProvider from "../../../shared/providers/EMSProvider";
import {AxiosResponse} from "axios";
import EnergyImpactRanking from "../../../shared/models/EnergyImpactRanking";
import Team from "../../../shared/models/Team";
import * as ReactScroll from "react-scroll";

import "./RankingsScreen.css";

interface IState {
  rankings: EnergyImpactRanking[],
  loading: boolean
}

const ANIMATION_DELAY = 5000;

class RankingsScreen extends React.Component<{}, IState> {
  private _timerID: any;

  constructor(props: any) {
    super(props);
    this.state = {
      rankings: [],
      loading: true
    };
    this._timerID = null;
  }

  public componentDidMount() {
    EMSProvider.getRankingTeams().then((response: AxiosResponse) => {
      if (response.data && response.data.payload && response.data.payload.length > 0) {
        const rankings: EnergyImpactRanking[] = [];
        for (const rankJSON of response.data.payload) {
          const ranking: EnergyImpactRanking = new EnergyImpactRanking().fromJSON(rankJSON);
          ranking.team = new Team().fromJSON(rankJSON);
          rankings.push(ranking);
        }
        console.log(this.getTotalScrollTime(rankings.length));
        this.scrollAndLoop(this.getTotalScrollTime(rankings.length), this.getReturnScrollTime(rankings.length)); // TODO - Make these functions based upon window height and items in the list * 40px
        this.setState({rankings: rankings, loading: false});
      } else {
        this.setState({loading: false});
      }
    }).catch((error: any) => {
      console.error(error);
      this.setState({loading: false});
    });
  }

  public componentWillUnmount() {
    if (this._timerID !== null) {
      global.clearInterval(this._timerID);
    }
  }

  public render() {
    const {rankings} = this.state;
    const standings = rankings.map(ranking => {
      return (
        <tr key={ranking.rankKey} className="rank-table-data">
          <td className="rank-rank">{ranking.rank}</td>
          <td className="rank-team">{ranking.team.teamNameShort}</td>
          <td className="rank-rp">{ranking.rankingPoints}</td>
          <td className="rank-total">{ranking.totalPoints}</td>
          <td className="rank-coop">{ranking.coopertitionPoints}</td>
          <td className="rank-park">{ranking.parkingPoints}</td>
          <td className="rank-play">{ranking.played}</td>
        </tr>
      );
    });
    standings.push(
      <tr key={"rankings-bottom"}>
        <td><ReactScroll.Element name="rankings-bottom"/></td>
      </tr>
    );
    return (
      <div id="fgc-body">
        <div id="fgc-container-wide">
          <div id="rank-header">
            <span><i>FIRST</i> Global 2018 Standings</span>
          </div>
          <div id="rank-body">
            <div id="rank-container">
              <ReactScroll.Element name="rankings-top"/>
              <table id="rank-table">
                <thead>
                <tr className="rank-table-header">
                  <th className="rank-rank">Rank</th>
                  <th className="rank-team">Country</th>
                  <th className="rank-rp">Ranking Points</th>
                  <th className="rank-total">Total Points</th>
                  <th className="rank-coop">Coopertition Points</th>
                  <th className="rank-park">Parking Points</th>
                  <th className="rank-play">Played</th>
                </tr>
                </thead>
                <tbody id="rank-scrollview">
                {standings}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private getTotalScrollTime(rankingsLength: number): number {
    return (rankingsLength / window.innerHeight) * 500000;
  }

  private getReturnScrollTime(rankingsLength: number): number {
    return (rankingsLength / window.innerHeight) * 100000;
  }

  private scrollAndLoop(bottomScrollDuration: number, topScrollDuration: number): void {
    this._timerID = global.setInterval(() => {
      this.scrollThroughRankings(bottomScrollDuration, topScrollDuration);
      console.log("Starting ranking animation.");
    }, bottomScrollDuration + topScrollDuration + (ANIMATION_DELAY * 2) + 4000);
  }

  private scrollThroughRankings(bottomScrollDuration: number, topScrollDuration: number): void {
    const scrollToBottom = new Promise((resolve, reject) => {
      ReactScroll.Events.scrollEvent.register("end", () => {
        ReactScroll.Events.scrollEvent.remove("end");
        resolve();
      });
      this.scrollToBottom(bottomScrollDuration);
    });
    scrollToBottom.then(() => {
      this.scrollToTop(topScrollDuration);
    });
  }

  private scrollToBottom(duration: number): void {
    console.log(duration);
    ReactScroll.scroller.scrollTo("rankings-bottom", {
      duration: duration,
      delay: ANIMATION_DELAY,
      smooth: "linear",
      containerId: "rank-scrollview",
      ignoreCancelEvents: true
    });
  }

  private scrollToTop(duration: number): void {
    ReactScroll.animateScroll.scrollToTop({
      duration: duration,
      delay: ANIMATION_DELAY,
      smooth: true,
      containerId: "rank-scrollview",
      ignoreCancelEvents: true
    });
  }
}

export default RankingsScreen;