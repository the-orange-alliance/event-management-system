import * as React from 'react';
import {MatchParticipant} from "@the-orange-alliance/lib-ems";
import {Button, ButtonGroup} from "semantic-ui-react";

interface IProps {
  value: number;
  participant?: MatchParticipant;
  label?: string;
  states: string[],
  onChange: (selected: number) => void
}

class RobotButtonGroup extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const {participant, label, states, value} = this.props;
    const statesView = states.map((state, index) => {
      const isSelected = value === index;
      return (
        <Button key={index} color={isSelected ? "green" : "grey"} className={isSelected ? "selected" : ""} onClick={this.updateSelected.bind(this, index)}>
          {state}
        </Button>
      );
    });

    let labelView;

    if (typeof participant !== "undefined") {
      labelView = (<span>{participant.team ? participant.team.teamNameShort : participant.teamKey}</span>);
    } else if (typeof label !== "undefined") {
      labelView = (<span>{label}</span>);
    }

    // TODO - Get Team Indentifiers from EMS-CORE
    return(
      <div className="state-switcher-container">
        <div className="state-switcher-team-container">
          {labelView}
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
