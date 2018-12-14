import * as React from 'react';
import './RankingsScreen.css';
import Event from "../../../shared/models/Event";
import EMSProvider from "../../../shared/providers/EMSProvider";
import Team from "../../../shared/models/Team";
import {AxiosResponse} from "axios";
import RoverRuckusRank from "../../../shared/models/RoverRuckusRank";
import * as ReactScroll from "react-scroll";
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
  private _timerID: any;

  constructor(props: IProps) {
    super(props);
    this._timerID = null;
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
        this.loop();
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
    rankingsView.push(
      <tr key={"rankings-bottom"} style={{height: 0}}>
        <td><ReactScroll.Element name="rankings-bottom"/></td>
      </tr>
    );
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
              <ReactScroll.Element name="rankings-top"/>
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
                <tbody id="rr-rank-scrollview">
                  {rankingsView}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    ) : <span/>;
  }

  private loop() {
    setTimeout(() => {
      this.scrollBottomThenTop().then(() => {
        this._timerID = global.setInterval(() => {
          this.scrollBottomThenTop();
        }, 52000);
      });
    }, 10000);
  }

  private scrollBottomThenTop(): Promise<any> {
    return new Promise<any>((funcResolve, funcReject) => {
      const scrollToBottom = new Promise((resolve, reject) => {
        ReactScroll.Events.scrollEvent.register("end", () => {
          ReactScroll.Events.scrollEvent.remove("end");
          resolve();
        });
        this.scrollToBottom(48000);
      });
      scrollToBottom.then(() => {
        this.scrollToTop(4000);
        setTimeout(() => {
          funcResolve();
        });
      });
    });
  }

  private scrollToBottom(duration: number): void {
    ReactScroll.scroller.scrollTo("rankings-bottom", {
      duration: duration,
      delay: 0,
      smooth: "linear",
      containerId: "rr-rank-scrollview",
      ignoreCancelEvents: true
    });
  }

  private scrollToTop(duration: number): void {
    ReactScroll.animateScroll.scrollToTop({
      duration: duration,
      delay: 0,
      smooth: true,
      containerId: "rr-rank-scrollview",
      ignoreCancelEvents: true
    });
  }
}

export default RankingsScreen;