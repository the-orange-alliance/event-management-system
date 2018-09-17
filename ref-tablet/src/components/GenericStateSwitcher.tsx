import * as React from 'react';

interface IProps {
  title: string,
  states: string[],
  selected: number,
  onSelect: (index: number) => void
}

class GenericStateSwitcher extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const {title, states, selected, onSelect} = this.props;

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
          {title}
        </div>
        <div className="state-switcher-state-container">
          {statesView}
        </div>
      </div>
    );
  }

}

export default GenericStateSwitcher;