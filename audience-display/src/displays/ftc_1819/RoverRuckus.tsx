import * as React from 'react';
import "./RoverRuckus.css";
import {Event, Team, Match} from "@the-orange-alliance/lib-ems";
import MatchPreviewScreen from "./match-preview/MatchPreviewScreen";
import MatchPlayScreen from "./match-play/MatchPlayScreen";
import MatchResultsScreen from "./match-results/MatchResultsScreen";
import RankingsScreen from "./rankings/RankingsScreen";
import AvailableTeamsScreen from "./available-teams/AvailableTeamsScreen";
import AllianceBracketScreen from "./alliance-bracket/AllianceBracketScreen";
import MatchTimerScreen from "./match-timer/MatchTimerScreen";

interface IProps {
  event: Event,
  teams: Team[],
  videoID: number,
  match: Match,
  displayMode: string
}

class RoverRuckus extends React.Component<IProps> {

  public render() {
    const {displayMode, event, match, videoID} = this.props;

    let view;

    switch (videoID) {
      case 0:
        view = <span/>; // Blank screen
        break;
      case 1:
        view = <MatchPreviewScreen match={match}/>;
        break;
      case 2:
        view = <MatchPlayScreen event={event} match={match}/>;
        break;
      case 3:
        view = <MatchResultsScreen match={match}/>;
        break;
      case 4:
        view = <span/>;
        break;
      case 5:
        view = <MatchTimerScreen match={match}/>;
        break;
      case 6:
        view = <RankingsScreen event={event}/>;
        break;
      case 7:
        view = <AvailableTeamsScreen event={event}/>;
        break;
      case 8:
        view = <AllianceBracketScreen event={event}/>;
        break;
      default:
        view = <span/>;
    }

    if (displayMode.indexOf("pit") > -1) {
      view = <RankingsScreen event={event}/>;
    } else if (displayMode.indexOf("field") > -1 && videoID === 2) {
      view = <MatchTimerScreen match={match}/>; // TODO - Make Match Timer!
    }

    return (view);
  }
}

export default RoverRuckus;
