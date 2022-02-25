import * as React from "react";
import Event from "@the-orange-alliance/lib-ems/dist/models/ems/Event";
import Team from "@the-orange-alliance/lib-ems/dist/models/ems/Team";
import Match from "@the-orange-alliance/lib-ems/dist/models/ems/Match";
import MatchPlayScreen from "./match-play/MatchPlayScreen";
import MatchPreviewScreen from "./match-preview/MatchPreviewScreen";
import RankingsScreen from "./rankings/RankingsScreen";

import "./RapidReact.css";
import MatchResultsScreen from "./match-results/MatchResultsScreen";

interface IProps {
  event: Event,
  teams: Team[],
  videoID: number,
  match: Match,
  displayMode: string
}

class RapidReact extends React.Component<IProps> {

  public render() {
    // const {displayMode, event, match, videoID} = this.props;
    const {videoID, event, match} = this.props;
    let view;

    switch (videoID) {
      case 0:
        view = <span/>; // Blank screen
        break;
      case 1:
        view = <MatchPreviewScreen event={event} match={match}/>;
        break;
      case 2:
        view = <MatchPlayScreen event={event} match={match}/>;
        break;
      case 3:
        view = <MatchResultsScreen event={event} match={match}/>;
        break;
      case 6:
        view = <RankingsScreen event={event}/>;
        break;
      default:
        view = <MatchPlayScreen event={event} match={match}/>;
    }

    return (view);
  }
}

export default RapidReact;
