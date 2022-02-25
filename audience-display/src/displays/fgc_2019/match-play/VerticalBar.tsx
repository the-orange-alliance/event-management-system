import * as React from "react";
import {AllianceColor} from "@the-orange-alliance/lib-ems";

interface IProps {
  alliance: AllianceColor,
  fillHeight: number
  label?: string
}

class VerticalBar extends React.Component<IProps> {

  public render() {
    const {alliance, fillHeight, label} = this.props;
    const allianceClass = alliance === "Red" ? "red-bg" : "blue-bg";
    let height = (1.0 - fillHeight) * 100;

    if (isNaN(height)) {
      height = 100;
    }

    return (
      <div className={"vertical-bar-container"}>
        <div className={"vertical-bar-label"}>
          <span>{label ? label : ""}</span>
        </div>
        <div className={"vertical-bar " + allianceClass}>
          <div className={"vertical-bar-fill"} style={{height: `${height}%`}}/>
        </div>
      </div>
    );
  }
}

export default VerticalBar;
