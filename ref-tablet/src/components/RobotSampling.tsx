import * as React from 'react';
import GOLD_MINERAL from '../resources/ftc_1819/Gold_Mineral.png';
import SILVER_MINERAL from '../resources/ftc_1819/Silver_Mineral.png';

interface IProps {
  onSuccess?: () => void
}

interface IState {
  successful: boolean,
  silverOneStatus: boolean,
  silverTwoStatus: boolean,
  goldStatus: boolean
}

class RobotSampling extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      successful: false,
      silverOneStatus: false,
      silverTwoStatus: false,
      goldStatus: false
    };

    this.toggleSilverOne = this.toggleSilverOne.bind(this);
    this.toggleSilverTwo = this.toggleSilverTwo.bind(this);
    this.toggleGold = this.toggleGold.bind(this);
  }

  public render() {
    const {silverOneStatus, silverTwoStatus, goldStatus} = this.state;
    return (
      <div className="robot-sample-container">
        <div className={"robot-sample-item " + (silverOneStatus ? "selected" : "")} onClick={this.toggleSilverOne}>
          <img src={SILVER_MINERAL}/>
        </div>
        <div className={"robot-sample-item " + (silverTwoStatus ? "selected" : "")} onClick={this.toggleSilverTwo}>
          <img src={SILVER_MINERAL}/>
        </div>
        <div className={"robot-sample-item " + (goldStatus? "selected" : "")} onClick={this.toggleGold}>
          <img src={GOLD_MINERAL}/>
        </div>
      </div>
    );
  }

  private toggleSilverOne() {
    const newSilverOneStatus = !this.state.silverOneStatus;
    const successful = newSilverOneStatus && this.state.silverTwoStatus && !this.state.goldStatus;
    this.setState({silverOneStatus: newSilverOneStatus, successful});
  }

  private toggleSilverTwo() {
    const newSilverTwoStatus = !this.state.silverTwoStatus;
    const successful = this.state.silverOneStatus && newSilverTwoStatus && !this.state.goldStatus;
    this.setState({silverTwoStatus: newSilverTwoStatus, successful});
  }

  private toggleGold() {
    const newGoldStatus = !this.state.goldStatus;
    const successful = this.state.silverOneStatus && this.state.silverTwoStatus && !newGoldStatus;
    this.setState({goldStatus: newGoldStatus, successful});
  }
}

export default RobotSampling;