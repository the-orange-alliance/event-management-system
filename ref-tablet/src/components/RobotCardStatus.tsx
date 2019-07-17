import * as React from 'react';
import {MatchParticipant} from "@the-orange-alliance/lib-ems";

interface IProps {
  participant: MatchParticipant,
  onUpdate?: (participant: MatchParticipant, status: number) => void
}

class RobotCardStatus extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const {participant} = this.props;
    const selected: number = participant.cardStatus || 0;
    /* TODO - Load identifier from EMS-CORE */
    return (
      <div className="robot-card-container">
        <div className="robot-card-team">
          {participant.team.teamNameShort}
        </div>
        <div className="robot-card-cards">
          <div className={"robot-card-none " + (selected === 0 ? "selected" : "")} onClick={this.updateSelected.bind(this, 0)}>None</div>
          <div className={"robot-card-yellow " + (selected === 1 ? "selected" : "")} onClick={this.updateSelected.bind(this, 1)}/>
          <div className={"robot-card-red " + (selected === 2 ? "selected" : "")} onClick={this.updateSelected.bind(this, 2)}/>
        </div>
      </div>
    );
  }

  private updateSelected(index: number) {
    if (typeof this.props.onUpdate !== "undefined") {
      this.props.onUpdate(this.props.participant, index);
    }
  }
}

export default RobotCardStatus;