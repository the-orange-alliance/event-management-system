import * as React from 'react';

interface IProps {
  modes: string[],
  selected: number,
  className?: string,
  onSelect: (index: number) => void
}

class ModeSwitcher extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    const {modes, selected, className, onSelect} = this.props;

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
      <div className={"mode-bar-container " + (className ? className : "")}>
        {modesView}
      </div>
    );
  }
}

export default ModeSwitcher;