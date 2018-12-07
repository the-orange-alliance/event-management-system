import * as React from 'react';
import "./RoverRuckus.css";
import Event from "../../shared/models/Event";
import Team from "../../shared/models/Team";
import Match from "../../shared/models/Match";
import MatchPreviewScreen from "./match-preview/MatchPreviewScreen";

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
    const {match, videoID} = this.props;

    let view;

    switch (videoID) {
      case 0:
        view = <span/>; // Blank screen
        break;
      case 1:
        view = <MatchPreviewScreen match={match}/>;
        break;
      default:
        view = <span/>;
    }

    return (view);
  }
}

export default RoverRuckus;