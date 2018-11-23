import * as React from 'react';
import MatchParticipant from "../shared/models/MatchParticipant";

interface IProps {
  participant: MatchParticipant
}

interface IState {
  selected: number
}

class RobotCardStatus extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      selected: 0
    };
  }

  public render() {
    const {selected} = this.state;
    return (
      <div className="robot-card-container">
        <div className="robot-card-team">
          Team -1
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
    this.setState({selected: index});
  }
}

export default RobotCardStatus;