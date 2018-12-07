import * as React from 'react';
import Event from "../../shared/models/Event";
import Team from "../../shared/models/Team";
import Match from "../../shared/models/Match";

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
    const {videoID} = this.props;

    let view;

    switch (videoID) {
      case 0:
        view = <span/>; // Blank screen
        break;
      default:
        view = <span/>;
    }

    return (view);
  }
}

export default RoverRuckus;