import * as React from 'react';
import MatchParticipant from "../shared/models/MatchParticipant";

interface IProps {
  participant: MatchParticipant,
  states: string[],
  selected: number,
  onSelect: (index: number) => void
}

class RobotStateSwitcher extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const {participant, states, selected, onSelect} = this.props;

    const statesView = states.map((state, index) => {
      const select = onSelect.bind(this, index);
      return (
        <div key={index} className={selected === index ? "selected" : ""} onClick={select}>
          {state}
        </div>
      );
    });

    return(
      <div className="state-switcher-container">
        <div className="state-switcher-team-container">
          Team {participant.teamKey}
        </div>
        <div className="state-switcher-state-container">
          {statesView}
        </div>
      </div>
    );
  }

}

export default RobotStateSwitcher;