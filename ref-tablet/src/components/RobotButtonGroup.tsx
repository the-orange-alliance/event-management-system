import * as React from 'react';
import {Button, ButtonGroup} from "reactstrap";
import {MatchParticipant} from "@the-orange-alliance/lib-ems";

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

    // TODO - Get Team Indentifiers from EMS-CORE
    return(
      <div className="state-switcher-container">
        <div className="state-switcher-team-container">
          {participant.team && <span>{participant.team.teamNameShort}</span>}
          {!participant.team && <span>{participant.teamKey}</span>}
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