import * as React from 'react';
import StatusBar from "../../components/StatusBar";
import Event from "../../shared/models/Event";
import Match from "../../shared/models/Match";
import ModeSwitcher from "../../components/ModeSwitcher";
import RobotStateSwitcher from "../../components/RobotStateSwitcher";
import MatchParticipant from "../../shared/models/MatchParticipant";
import GenericStateSwitcher from "../../components/GenericStateSwitcher";

interface IProps {
  event: Event,
  match: Match,
  mode: string,
  connected: boolean
}

interface IState {
  currentMode: number,
  testRobot1: number,
  testRobot2: number
}

class RedAllianceView extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      currentMode: 0,
      testRobot1: 0,
      testRobot2: 1
    };
    this.changeModeTab = this.changeModeTab.bind(this);
    this.changeRobotOneEndgameState = this.changeRobotOneEndgameState.bind(this);
    this.changeRobotTwoEndgameState = this.changeRobotTwoEndgameState.bind(this);
  }

  public render() {
    const {match, mode, connected} = this.props;
    const {currentMode} = this.state;

    let modeView;

    switch (currentMode) {
      case 0:
        modeView = this.renderAutoView();
        break;
      case 1:
        modeView = this.renderTeleView();
        break;
      case 2:
        modeView = this.renderEndView();
        break;
      default:
        modeView = this.renderAutoView();
    }

    return (
      <div className="alliance-view">
        <StatusBar match={match} mode={mode} connected={connected}/>
        <ModeSwitcher className={"red-bg"} modes={["auto", "teleop", "endgame", "cards"]} selected={currentMode} onSelect={this.changeModeTab}/>
        {modeView}
      </div>
    );
  }

  private renderAutoView(): JSX.Element {
    return (
      <div>
        <RobotStateSwitcher participant={new MatchParticipant()} states={["Not Present", "Not Latched", "Latched"]} selected={0} onSelect={this.changeRobotOneEndgameState}/>
        <RobotStateSwitcher participant={new MatchParticipant()} states={["Not Present", "Not Latched", "Latched"]} selected={0} onSelect={this.changeRobotOneEndgameState}/>
        <GenericStateSwitcher title={"Alliance Claims"} states={["0", "1", "2"]} selected={0} onSelect={this.changeRobotOneEndgameState}/>
        <GenericStateSwitcher title={"Alliance Sampling"} states={["Successful Sample", "Failed Sample"]} selected={0} onSelect={this.changeRobotOneEndgameState}/>
        <RobotStateSwitcher participant={new MatchParticipant()} states={["Not Parked", "Parked"]} selected={0} onSelect={this.changeRobotOneEndgameState}/>
        <RobotStateSwitcher participant={new MatchParticipant()} states={["Not Parked", "Parked"]} selected={0} onSelect={this.changeRobotOneEndgameState}/>
      </div>
    );
  }

  private renderTeleView(): JSX.Element {
    return (
      <span>Tele view</span>
    );
  }

  private renderEndView(): JSX.Element {
    const {testRobot1, testRobot2} = this.state;
    return (
      <div>
        <RobotStateSwitcher participant={new MatchParticipant()} states={["Latched", "Partially Parked", "Fully Parked", "Nothing"]} selected={testRobot1} onSelect={this.changeRobotOneEndgameState}/>
        <RobotStateSwitcher participant={new MatchParticipant()} states={["Latched", "Partially Parked", "Fully Parked", "Nothing"]} selected={testRobot2} onSelect={this.changeRobotTwoEndgameState}/>
      </div>
    );
  }

  private changeModeTab(index: number) {
    this.setState({currentMode: index});
  }

  private changeRobotOneEndgameState(index: number) {
    this.setState({testRobot1: index});
  }

  private changeRobotTwoEndgameState(index: number) {
    this.setState({testRobot2: index});
  }
}

export default RedAllianceView;