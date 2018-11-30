import * as React from 'react';
import GOLD_MINERAL from '../resources/ftc_1819/Gold_Mineral.png';
import SILVER_MINERAL from '../resources/ftc_1819/Silver_Mineral.png';

interface IProps {
  silverOneStatus: boolean,
  silverTwoStatus: boolean,
  goldStatus: boolean
  onChange?: (index: number, successful: boolean) => void
}

class RobotSampling extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.toggleSilverOne = this.toggleSilverOne.bind(this);
    this.toggleSilverTwo = this.toggleSilverTwo.bind(this);
    this.toggleGold = this.toggleGold.bind(this);
  }

  public render() {
    const {silverOneStatus, silverTwoStatus, goldStatus} = this.props;
    return (
      <div className="robot-sample-container">
        <div className={"robot-sample-item " + (silverOneStatus ? "selected" : "")} onClick={this.toggleSilverOne}>
          <img src={SILVER_MINERAL}/>
        </div>
        <div className={"robot-sample-item " + (silverTwoStatus ? "selected" : "")} onClick={this.toggleSilverTwo}>
          <img src={SILVER_MINERAL}/>
        </div>
        <div className={"robot-sample-item " + (goldStatus ? "selected" : "")} onClick={this.toggleGold}>
          <img src={GOLD_MINERAL}/>
        </div>
      </div>
    );
  }

  private toggleSilverOne() {
    const newSilverOneStatus = !this.props.silverOneStatus;
    const successful = !newSilverOneStatus && !this.props.silverTwoStatus && this.props.goldStatus;
    if (typeof this.props.onChange !== "undefined") {
      this.props.onChange(0, successful);
    }
  }

  private toggleSilverTwo() {
    const newSilverTwoStatus = !this.props.silverTwoStatus;
    const successful = !this.props.silverOneStatus && !newSilverTwoStatus && this.props.goldStatus;
    if (typeof this.props.onChange !== "undefined") {
      this.props.onChange(1, successful);
    }
  }

  private toggleGold() {
    const newGoldStatus = !this.props.goldStatus;
    const successful = !this.props.silverOneStatus && !this.props.silverTwoStatus && newGoldStatus;
    if (typeof this.props.onChange !== "undefined") {
      this.props.onChange(2, successful);
    }
  }
}

export default RobotSampling;