import * as React from "react";
import {AllianceColor, EventType} from "@the-orange-alliance/lib-ems";
import EnergyImpactRedScorecard from "./game-specifics/EnergyImpactRedScorecard";
import EnergyImpactBlueScorecard from "./game-specifics/EnergyImpactBlueScorecard";
import RoverRuckusRedScorecard from "./game-specifics/RoverRuckusRedScorecard";
import RoverRuckusBlueScorecard from "./game-specifics/RoverRuckusBlueScorecard";

interface IProps {
  type: EventType,
  alliance: AllianceColor
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
        if (alliance === "Red") {
          display = <EnergyImpactRedScorecard/>;
        } else {
          display = <EnergyImpactBlueScorecard/>
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