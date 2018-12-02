import * as React from 'react';
import MatchParticipant from "../shared/models/MatchParticipant";
import {AllianceColors} from "../shared/AppTypes";

interface IProps {
  value: boolean,
  participant: MatchParticipant,
  alliance?: AllianceColors
  onToggle?: () => void
}

class RobotClaimToggle extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
  }

  public render() {
    const {alliance, participant, value} = this.props;
    return (
      <div className="robot-claim-container">
        <div className="robot-claim-flag">
          <div className={"robot-claim-team " + (value ? "selected " : " ") + (alliance ? (alliance + "-bg") : "")} onClick={this.onSelect}>{participant.teamKey}</div>
          <span className="robot-claim-top"/>
          <span className="robot-claim-middle"/>
          <span className="robot-claim-base-top"/>
          <span className="robot-claim-base-bottom"/>
        </div>
      </div>
    );
  }

  private onSelect() {
    if (typeof this.props.onToggle !== "undefined") {
      this.props.onToggle();
    }
  }
}

export default RobotClaimToggle;