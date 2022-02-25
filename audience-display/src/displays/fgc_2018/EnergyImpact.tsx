import * as React from "react";
import {Event, Match, Team} from "@the-orange-alliance/lib-ems";
import SponsorScreen from "./sponsor/SponsorScreen";
import MatchPreviewScreen from "./match-preview/MatchPreviewScreen";
import MatchResultsScreen from "./match-results/MatchResultsScreen";
import MatchPlayScreen from "./match-play/MatchPlayScreen";
import RankingsScreen from "./rankings/RankingsScreen";

import "./EnergyImpact.css";

interface IProps {
  event: Event,
  teams: Team[],
  videoID: number,
  match: Match
}

class EnergyImpact extends React.Component<IProps> {

  public render() {
    const {videoID, match} = this.props;
    let view;
    switch (videoID) {
      case 0:
        view = <SponsorScreen/>;
        break;
      case 1:
        view = <MatchPreviewScreen match={match}/>;
        break;
      case 2:
        view = <MatchPlayScreen match={match}/>;
        break;
      case 3:
        view = <MatchResultsScreen match={match}/>;
        break;
      case 4:
        view = <span/>; // Blank screen
        break;
      case 5:
        view = <RankingsScreen/>;
        break;
      case 6:
        view = <RankingsScreen/>;
        break;
      default:
        view = <SponsorScreen/>;
    }

    return (view);
  }
}

export default EnergyImpact;
