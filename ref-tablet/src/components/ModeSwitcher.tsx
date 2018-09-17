import * as React from 'react';

interface IProps {
  modes: string[],
  selected: number,
  onSelect: (index: number) => void
}

class ModeSwitcher extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const {modes, selected, onSelect} = this.props;

    const modesView = modes.map((mode, index) => {
      const select = onSelect.bind(this, index);
      return (
        <div
          key={mode}
          className={selected === index ? "selected" : ""}
          onClick={select}
        >
          {mode.toUpperCase()}
        </div>
      );
    });

    return (
      <div className="mode-bar-container">
        {modesView}
      </div>
    );
  }
}

export default ModeSwitcher;