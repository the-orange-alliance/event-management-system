import * as React from 'react';
import {Button, Input} from "reactstrap";

interface IProps {
  value: number,
  verticalLabel?: boolean,
  verticalButtons?: boolean,
  min: number,
  max: number,
  image?: any,
  label?: string,
  onChange?: (n: number) => void
}

class RobotNumberInput extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.incrementValue = this.incrementValue.bind(this);
    this.decrementValue = this.decrementValue.bind(this);
  }

  public render() {
    const {image, label, value, verticalButtons, verticalLabel} = this.props;

    return (
      <div className={`robot-number-container ${verticalLabel ? `vertical` : `horizontal`}`}>
        <div className="robot-number-left">
          {label && <span>{label}</span>}
          {!label && <img src={image}/>}
        </div>
        <div className={`robot-number-right ${verticalButtons ? `vertical` : `horizontal`}`}>
          <Button className="robot-number-item green-txt" onClick={this.incrementValue}>+</Button>
          <Input value={value} readOnly={true} className="robot-number-item" type="number"/>
          <Button className="robot-number-item red-txt" onClick={this.decrementValue}>-</Button>
        </div>
      </div>
    );
  }

  private incrementValue() {
    if (typeof this.props.onChange !== "undefined" && this.props.value < this.props.max) {
      this.props.onChange(1);
    }
  }

  private decrementValue() {
    if (typeof this.props.onChange !== "undefined" && this.props.value > this.props.min) {
      this.props.onChange(-1);
    }
  }
}

export default RobotNumberInput;