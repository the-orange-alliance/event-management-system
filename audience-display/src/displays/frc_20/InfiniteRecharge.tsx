import * as React from "react";
import Event from "@the-orange-alliance/lib-ems/dist/models/ems/Event";
import Team from "@the-orange-alliance/lib-ems/dist/models/ems/Team";
import Match from "@the-orange-alliance/lib-ems/dist/models/ems/Match";
import MatchPlayScreen from "./match-play/MatchPlayScreen";

interface IProps {
  event: Event,
  teams: Team[],
  videoID: number,
  match: Match,
  displayMode: string
}

class InfiniteRecharge extends React.Component<IProps> {
  public constructor(props: IProps) {
    super(props);
  }

  public render() {
    // const {displayMode, event, match, videoID} = this.props;
    const {videoID, event, match} = this.props;
    let view;

    switch (videoID) {
      case 0:
        view = <MatchPlayScreen event={event} match={match}/>;
        break;
      default:
        view = <MatchPlayScreen event={event} match={match}/>;
    }

    return (view);
  }
}

export default InfiniteRecharge;