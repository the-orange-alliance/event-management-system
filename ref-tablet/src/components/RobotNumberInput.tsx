import * as React from 'react';
import {Button, Input} from "reactstrap";

interface IProps {
  value: number,
  image: any
  min: number,
  max: number,
  onChange?: (n: number) => void
}

class RobotNumberInput extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.incrementValue = this.incrementValue.bind(this);
    this.decrementValue = this.decrementValue.bind(this);
  }

  public render() {
    const {image, value} = this.props;
    return (
      <div className="robot-number-container">
        <div className="robot-number-left">
          <img src={image}/>
        </div>
        <div className="robot-number-right">
          <Button className="robot-number-item" onClick={this.incrementValue}>+</Button>
          <Input value={value} readOnly={true} className="robot-number-item" type="number"/>
          <Button className="robot-number-item" onClick={this.decrementValue}>-</Button>
        </div>
      </div>
    );
  }

  private incrementValue() {
    if (typeof this.props.onChange !== "undefined") {
      this.props.onChange(1);
    }
  }

  private decrementValue() {
    if (typeof this.props.onChange !== "undefined") {
      this.props.onChange(-1);
    }
  }
}

export default RobotNumberInput;