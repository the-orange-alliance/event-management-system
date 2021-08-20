import * as React from "react";

import RED_EMPTY from "../res/Red_Solar_Capsule_Empty.png";
import RED_ONE from "../res/Red_Solar_Capsule_One.png";
import RED_TWO from "../res/Red_Solar_Capsule_Two.png";
import RED_THREE from "../res/Red_Solar_Capsule_Three.png";
import RED_FOUR from "../res/Red_Solar_Capsule_Four.png";
import RED_FIVE from "../res/Red_Solar_Capsule_Five.png";

import BLUE_EMPTY from "../res/Blue_Solar_Capsule_Empty.png";
import BLUE_ONE from "../res/Blue_Solar_Capsule_One.png";
import BLUE_TWO from "../res/Blue_Solar_Capsule_Two.png";
import BLUE_THREE from "../res/Blue_Solar_Capsule_Three.png";
import BLUE_FOUR from "../res/Blue_Solar_Capsule_Four.png";
import BLUE_FIVE from "../res/Blue_Solar_Capsule_Five.png";

interface IProps {
  allianceColor: string,
  solarPanelCount: number
}

class SolarCapsule extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  private getCapsuleImage(allianceColor: string, solarPanelCount: number) {
    if (allianceColor === "red") {
      switch (solarPanelCount) {
        case 0:
          return RED_EMPTY;
        case 1:
          return RED_ONE;
        case 2:
          return RED_TWO;
        case 3:
          return RED_THREE;
        case 4:
          return RED_FOUR;
        case 5:
          return RED_FIVE;
        default:
          return RED_EMPTY;
      }
    } else {
      switch (solarPanelCount) {
        case 0:
          return BLUE_EMPTY;
        case 1:
          return BLUE_ONE;
        case 2:
          return BLUE_TWO;
        case 3:
          return BLUE_THREE;
        case 4:
          return BLUE_FOUR;
        case 5:
          return BLUE_FIVE;
        default:
          return BLUE_EMPTY;
      }
    }
  }

  public render() {
    return (
      <div className="scoring-capsule-container">
        <img alt={'capsule image'} src={this.getCapsuleImage(this.props.allianceColor, this.props.solarPanelCount)} className="fit-w"/>
      </div>
    );
  }
}

export default SolarCapsule;
