import * as React from 'react';
import MatchParticipant from "../shared/models/MatchParticipant";

interface IProps {
  participant: MatchParticipant,
  onToggle?: (toggled: boolean) => void
}

interface IState {
  selected: boolean
}

class RobotClaimToggle extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      selected: false
    };

    this.onSelect = this.onSelect.bind(this);
  }

  public render() {
    const {participant} = this.props;
    const {selected} = this.state;
    return (
      <div className="robot-claim-container">
        <div className="robot-claim-flag">
          <div className={"robot-claim-team " + (selected ? "selected" : "")} onClick={this.onSelect}>{participant.teamKey}</div>
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
      this.props.onToggle(!this.state.selected);
    }
    this.setState({selected: !this.state.selected});
  }
}

export default RobotClaimToggle;