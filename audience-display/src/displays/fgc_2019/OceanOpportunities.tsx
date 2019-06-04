import * as React from "react";
import {Event, Match, Team} from "@the-orange-alliance/lib-ems";
import MatchPreviewScreen from "./match-preview/MatchPreviewScreen";
import MatchPlayScreen from "./match-play/MatchPlayScreen";

import "./OceanOpportunities.css";

interface IProps {
  event: Event,
  teams: Team[],
  videoID: number,
  match: Match
}

class OceanOpportunities extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const {match, videoID} = this.props;
    let view;
    switch (videoID) {
      case 0:
        view = <MatchPlayScreen match={match}/>;
        break;
      case 1:
        view = <MatchPreviewScreen match={match}/>;
        break;
      case 2:
        view = <MatchPlayScreen match={match}/>;
        break;
      default:
        view = <span>default</span>;
    }
    return (view);
  }
}

export default OceanOpportunities;