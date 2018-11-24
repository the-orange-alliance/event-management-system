import * as React from 'react';
import MatchParticipant from "../shared/models/MatchParticipant";
import {Button, ButtonGroup} from "reactstrap";

interface IProps {
  value: number,
  participant: MatchParticipant,
  states: string[],
  onChange: (selected: number) => void
}

class RobotButtonGroup extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const {participant, states, value} = this.props;
    const statesView = states.map((state, index) => {
      const isSelected = value === index;
      return (
        <Button key={index} color={isSelected ? "primary" : "secondary"} className={isSelected ? "selected" : ""} onClick={this.updateSelected.bind(this, index)}>
          {state}
        </Button>
      );
    });

    return(
      <div className="state-switcher-container">
        <div className="state-switcher-team-container">
          Team {participant.teamKey}
        </div>
        <ButtonGroup>
          {statesView}
        </ButtonGroup>
      </div>
    );
  }

  private updateSelected(index: number) {
    this.props.onChange(index);
  }
}

export default RobotButtonGroup;