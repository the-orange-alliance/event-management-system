import * as React from 'react';
import {Button, Input} from "reactstrap";

interface IProps {
  value: number,
  label: string,
  min: number,
  max: number,
  onIncrement?: () => void,
  onDecrement?: () => void
}

class RobotPenaltyInput extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      value: 0
    };

    this.incrementValue = this.incrementValue.bind(this);
    this.decrementValue = this.decrementValue.bind(this);
  }

  public render() {
    const {label, value} = this.props;
    return (
      <div className="robot-penalty-container">
        <div className="robot-penalty-top">
          {label}
        </div>
        <div className="robot-penalty-bottom">
          <Button className="robot-penalty-item" onClick={this.decrementValue}>-</Button>
          <Input value={value} readOnly={true} className="robot-penalty-item" type="number"/>
          <Button className="robot-penalty-item" onClick={this.incrementValue}>+</Button>
        </div>
      </div>
    );
  }

  private incrementValue() {
    if (typeof this.props.onIncrement !== "undefined") {
      this.props.onIncrement();
    }
  }

  private decrementValue() {
    if (typeof this.props.onDecrement !== "undefined") {
      this.props.onDecrement();
    }
  }
}

export default RobotPenaltyInput;