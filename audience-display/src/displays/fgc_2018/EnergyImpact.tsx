import * as React from "react";
import Event from "../../shared/models/Event";
import SponsorScreen from "./sponsor/SponsorScreen";

import "./EnergyImpact.css";
import MatchPreviewScreen from "./match-preview/MatchPreviewScreen";
import MatchResultsScreen from "./match-results/MatchResultsScreen";

interface IProps {
  event: Event,
  videoID: number
}

class EnergyImpact extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const {videoID} = this.props;

    let view;
    switch (videoID) {
      case 0:
        view = <SponsorScreen/>;
        break;
      case 1:
        view = <span/>; // Blank screen
        break;
      case 2:
        view = <MatchPreviewScreen/>;
        break;
      case 3:
        view = <MatchResultsScreen/>
        break;
      default:
        view = <SponsorScreen/>;
    }

    return (view);
  }
}

export default EnergyImpact;