import * as React from "react";
import {EMSProvider, Ranking, OceanOpportunitiesRank} from "@the-orange-alliance/lib-ems";

import FGC_LEFT_LOGO from "../res/Logo-V.png";
import FGC_RIGHT_LOGO from "../res/Powered by.png";

import "./PlayoffsBracketScreen.css";

interface IState {
  updating: boolean;
  allianceRanks: Map<number, Ranking[]>;
}

class PlayoffsBracketScreen extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      updating: true,
      allianceRanks: new Map()
    };
  }

  public componentDidMount() {
    EMSProvider.getRankingTeams("fgc_2019").then((rankings: Ranking[]) => {
      const rankedAlliances: Map<number, Ranking[]> = new Map<number, Ranking[]>();
      for (const ranking of rankings) {
        // 2019-FGC-DUB-A01-M1
        const alliance: string = (ranking as any).allianceKey.split("-")[3];
        const allianceNumber: number = parseInt(alliance.substring(2, alliance.length), 10);
        console.log(alliance, allianceNumber);
        if (typeof rankedAlliances.get(allianceNumber) === "undefined") {
          rankedAlliances.set(allianceNumber, []);
        }
        (rankedAlliances.get(allianceNumber) as Ranking[]).push(ranking);
      }
      console.log(rankedAlliances);
      this.setState({allianceRanks: rankedAlliances, updating: false});
    });
  }

  public render() {
    const {allianceRanks, updating} = this.state;
    const cutoff = allianceRanks.size > 4 ? 4 : 2;
    const ranksView: any[] = [];
    for (let i = 1; i < allianceRanks.size + 1; i++) {
      console.log(allianceRanks.get(i));
      const ranks: OceanOpportunitiesRank[] = allianceRanks.get(i) as OceanOpportunitiesRank[];
      const ooRank: OceanOpportunitiesRank = ranks[0] as OceanOpportunitiesRank;
      const alliance: string = (ranks[0] as any).allianceKey.split("-")[3];
      const allianceNumber: number = parseInt(alliance.substring(1, alliance.length), 10);
      const teams = ranks.map((r: Ranking) => `${r.team.country}-`).toString();
      const teamsView = teams.substr(0, teams.length - 1).replace(/,/gi, "");
      ranksView.push(
        <tr key={i} className={i === cutoff ? "playoffs-cutoff" : ""}>
          <td className={'playoffs-d-rank'}>{ranks[0].rank === 0 ? allianceNumber : ranks[0].rank}</td>
          <td className={'playoffs-d-teans'}>{teamsView}</td>
          <td className={'playoffs-d-record'}>{`${ranks[0].wins}-${ranks[0].losses}-${ranks[0].ties}`}</td>
          <td className={'playoffs-d-rp'}>{ooRank.rankingPoints || 0}</td>
          <th className={'playoffs-d-tp'}>{ooRank.totalPoints || 0}</th>
          <th className={'playoffs-d-cp'}>{ooRank.coopertitionPoints * 75}</th>
        </tr>
      );
    }
    return (
      <div id={"fgc-body"}>

        {
          !updating &&
          <div id={"playoffs-container"}>
            <div id={"playoffs-table"}>
              <table>
                <thead>
                <tr>
                  <th className={'playoffs-d-rank'}>Rank</th>
                  <th className={'playoffs-d-teams'}>Alliance Members</th>
                  <th className={'playoffs-d-record'}>Record</th>
                  <th className={'playoffs-d-rp'}>Ranking Points</th>
                  <th className={'playoffs-d-tp'}>Total Points</th>
                  <th className={'playoffs-d-cp'}>Coopertition Points</th>
                </tr>
                </thead>
                <tbody>
                {ranksView}
                </tbody>
              </table>
            </div>
          </div>
        }

        <div id={"playoffs-left-side-logo"} className={"center-items"}>
          <img src={FGC_LEFT_LOGO} className={"fit-w"}/>
        </div>

        <div id={"playoffs-right-side-logo"} className={"center-items"}>
          <img src={FGC_RIGHT_LOGO} className={"fit-w"}/>
        </div>

      </div>
    );
  }
}

export default PlayoffsBracketScreen;