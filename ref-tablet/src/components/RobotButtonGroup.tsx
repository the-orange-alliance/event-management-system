import * as React from 'react';
import MatchParticipant from "../shared/models/MatchParticipant";
import {Button, ButtonGroup} from "reactstrap";

interface IProps {
  participant: MatchParticipant,
  states: string[],
  onChange: (selected: number) => void
}

interface IState {
  selected: number
}

class RobotButtonGroup extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      selected: 0
    };
  }

  public render() {
    const {participant, states} = this.props;
    const {selected} = this.state;
    const statesView = states.map((state, index) => {
      const isSelected = selected === index;
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
    this.setState({selected: index});
  }
}

export default RobotButtonGroup;