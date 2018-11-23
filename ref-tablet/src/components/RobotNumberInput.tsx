import * as React from 'react';
import {Button, Input} from "reactstrap";

interface IProps {
  image: any
  min: number,
  max: number
}

interface IState {
  value: number
}

class RobotNumberInput extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      value: 0
    };

    this.incrementValue = this.incrementValue.bind(this);
    this.decrementValue = this.decrementValue.bind(this);
  }

  public render() {
    const {image} = this.props;
    const {value} = this.state;
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
    if (this.state.value < this.props.max) {
      this.setState({value: this.state.value + 1});
    }
  }

  private decrementValue() {
    if (this.state.value > this.props.min) {
      this.setState({value: this.state.value -  1});
    }
  }
}

export default RobotNumberInput;