import * as React from "react";
import {Event, Match, Team} from "@the-orange-alliance/lib-ems";
import MatchPreviewScreen from "./match-preview/MatchPreviewScreen";
import MatchPlayScreen from "./match-play/MatchPlayScreen";
import MatchResultsScreen from "./match-results/MatchResultsScreen";
import MatchTimerScreen from "./match-timer/MatchTimerScreen";
import MiniMatchPlayScreen from "./match-play-mini/MiniMatchPlayScreen";
import PlayoffsBracketScreen from "./playoffs-bracket/PlayoffsBracketScreen";

import "./OceanOpportunities.css";

interface IProps {
  event: Event,
  teams: Team[],
  videoID: number,
  match: Match,
  displayMode: string
}

class OceanOpportunities extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const {displayMode, match, videoID} = this.props;
    let view;
    switch (videoID) {
      case 0:
        view = <MatchPlayScreen match={match}/>;
        break;
      case 1:
        view = <MatchPreviewScreen match={match}/>;
        break;
      case 2:
        if (displayMode.indexOf("timer") > -1) {
          view = <MatchTimerScreen match={match}/>;
        } else if (displayMode.indexOf("mini") > -1) {
          view = <MiniMatchPlayScreen position={displayMode.replace("mini", "")} match={match}/>;
        } else {
          view = <MatchPlayScreen match={match}/>;
        }
        break;
      case 3:
        view = <MatchResultsScreen match={match}/>;
        break;
      case 5:
        view = <MatchTimerScreen match={match}/>;
        break;
      case 8:
        view = <PlayoffsBracketScreen/>;
        break;
      default:
        view = <span>default</span>;
    }

    if (displayMode.indexOf("preview") > -1) {
      view = <MatchPreviewScreen match={match}/>;
    } else if (displayMode.indexOf("results") > -1) {
      view = <MatchResultsScreen match={match}/>;
    }

    return (view);
  }
}

export default OceanOpportunities;