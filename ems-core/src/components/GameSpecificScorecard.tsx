import * as React from "react";
import {AllianceColor, EventType} from "@the-orange-alliance/lib-ems";
import EnergyImpactRedScorecard from "./game-specifics/energy-impact/EnergyImpactRedScorecard";
import EnergyImpactBlueScorecard from "./game-specifics/energy-impact/EnergyImpactBlueScorecard";
import RoverRuckusRedScorecard from "./game-specifics/rover-ruckus/RoverRuckusRedScorecard";
import RoverRuckusBlueScorecard from "./game-specifics/rover-ruckus/RoverRuckusBlueScorecard";
import OceanOpportunitiesRedScorecard from "./game-specifics/ocean-opportunities/OceanOpportunitiesRedScorecard";
import OceanOpportunitiesBlueScorecard from "./game-specifics/ocean-opportunities/OceanOpportunitiesBlueScorecard";

interface IProps {
  type: EventType,
  alliance: AllianceColor,
  loading: boolean
}

class GameSpecificScorecard extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const {type, alliance, loading} = this.props;
    let display;
    switch (type) {
      case "fgc_2018":
        if (alliance === "Red") {
          display = <EnergyImpactRedScorecard/>;
        } else {
          display = <EnergyImpactBlueScorecard/>
        }
        break;
      case "fgc_2019":
        if (alliance === "Red") {
          display = <OceanOpportunitiesRedScorecard loading={loading}/>;
        } else {
          display = <OceanOpportunitiesBlueScorecard loading={loading}/>;
        }
        break;
      case "ftc_1819":
        if (alliance === "Red") {
          display = <RoverRuckusRedScorecard/>;
        } else {
          display = <RoverRuckusBlueScorecard/>
        }
        break;
      default:
        display = <span>Some default scorecard eventually.</span>;
    }
    return (display);
  }
}

export default GameSpecificScorecard;