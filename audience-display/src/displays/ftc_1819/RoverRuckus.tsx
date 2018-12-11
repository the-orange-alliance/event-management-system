import * as React from 'react';
import "./RoverRuckus.css";
import Event from "../../shared/models/Event";
import Team from "../../shared/models/Team";
import Match from "../../shared/models/Match";
import MatchPreviewScreen from "./match-preview/MatchPreviewScreen";
import MatchPlayScreen from "./match-play/MatchPlayScreen";
import MatchResultsScreen from "./match-results/MatchResultsScreen";
import RankingsScreen from "./rankings/RankingsScreen";
import AvailableTeamsScreen from "./available-teams/AvailableTeamsScreen";
import AllianceBracketScreen from "./alliance-bracket/AllianceBracketScreen";

interface IProps {
  event: Event,
  teams: Team[],
  videoID: number,
  match: Match
}

class RoverRuckus extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const {event, match, videoID} = this.props;

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

    return (view);
  }
}

export default RoverRuckus;