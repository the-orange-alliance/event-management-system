import * as React from "react";
import {AllianceColors, EMSEventTypes} from "../shared/AppTypes";
import EnergyImpactScorecard from "./game-specifics/EnergyImpactScorecard";

interface IProps {
  type: EMSEventTypes,
  alliance: AllianceColors
}

class GameSpecificScorecard extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const {type, alliance} = this.props;
    let display;
    switch (type) {
      case "fgc_2018":
        display = <EnergyImpactScorecard alliance={alliance}/>;
        break;
      default:
        display = <span>Some default scorecard eventually.</span>;
    }
    return (display);
  }
}

export default GameSpecificScorecard;