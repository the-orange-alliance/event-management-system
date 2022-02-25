import * as React from "react";
import {AllianceColor} from "@the-orange-alliance/lib-ems";

interface IProps {
  alliance: AllianceColor,
  fillWidth: number
}

class CoopertitionBar extends React.Component<IProps> {

  public render() {
    const {alliance, fillWidth} = this.props;
    const allianceClass = alliance === "Red" ? "left-bar" : "right-bar";
    const width = (alliance === "Red" ? fillWidth : 1.0 - fillWidth) * 100;
    return (
      <div className={"coopertition-bar-container " + allianceClass}>
        {
          alliance === "Red" &&
          <div className={"coopertition-bar"}>
            <div className={"coopertition-bar-fill"} style={{width: `${width}%`}}/>
          </div>
        }
        {
          alliance !== "Red" &&
          <div>
            <div className={"coopertition-bar"} style={{width: `${width}%`}}/>
            <div className={"coopertition-bar-fill"}/>
          </div>
        }
      </div>
    );
  }
}

export default CoopertitionBar;
