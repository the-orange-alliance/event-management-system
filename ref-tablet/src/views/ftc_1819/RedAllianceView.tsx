import * as React from 'react';
import StatusBar from "../../components/StatusBar";
import Event from "../../shared/models/Event";
import Match from "../../shared/models/Match";
import RobotButtonGroup from "../../components/RobotButtonGroup";
import MatchParticipant from "../../shared/models/MatchParticipant";
import {Col, Nav, NavItem, NavLink, Row} from "reactstrap";
import RobotClaimToggle from "../../components/RobotClaimToggle";
import RobotSampling from "../../components/RobotSampling";
import RobotNumberInput from "../../components/RobotNumberInput";

import GOLD_MINERAL from '../../resources/ftc_1819/Gold_Mineral.png';
import SILVER_MINERAL from '../../resources/ftc_1819/Silver_Mineral.png';
import DEPOT_MINERALS from '../../resources/ftc_1819/Depot_Minerals.png';
import RobotCardStatus from "../../components/RobotCardStatus";
import RobotPenaltyInput from "../../components/RobotPenaltyInput";

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
      case 3:
        modeView = this.renderPenaltyView();
        break;
      default:
        modeView = this.renderAutoView();
    }

    return (
      <div className="alliance-view">
        <StatusBar match={match} mode={mode} connected={connected}/>
        <Nav tabs={true}>
          <NavItem>
            <NavLink active={currentMode === 0} href="#" onClick={this.changeModeTab.bind(this, 0)}>AUTO</NavLink>
          </NavItem>
          <NavItem>
            <NavLink active={currentMode === 1} href="#" onClick={this.changeModeTab.bind(this, 1)}>TELEOP</NavLink>
          </NavItem>
          <NavItem>
            <NavLink active={currentMode === 2} href="#" onClick={this.changeModeTab.bind(this, 2)}>ENDGAME</NavLink>
          </NavItem>
          <NavItem>
            <NavLink active={currentMode === 3} href="#" onClick={this.changeModeTab.bind(this, 3)}>CARDS/PENALTIES</NavLink>
          </NavItem>
        </Nav>
        {modeView}
      </div>
    );
  }

  private renderAutoView(): JSX.Element {
    return (
      <div>
        <Row>
          <Col md={6}>
            <RobotButtonGroup value={0} participant={new MatchParticipant()} states={["Not Present", "Not Latched", "Latched", "Landed"]} onChange={this.changeRobotOneEndgameState}/>
          </Col>
          <Col md={6}>
            <RobotButtonGroup value={0} participant={new MatchParticipant()} states={["Not Present", "Not Latched", "Latched", "Landed"]} onChange={this.changeRobotOneEndgameState}/>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <RobotClaimToggle value={false} participant={new MatchParticipant()}/>
          </Col>
          <Col md={6}>
            <RobotClaimToggle value={false} participant={new MatchParticipant()}/>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <RobotSampling goldStatus={false} silverOneStatus={false} silverTwoStatus={false}/>
          </Col>
          <Col md={6}>
            <RobotSampling goldStatus={false} silverOneStatus={false} silverTwoStatus={false}/>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <RobotNumberInput value={0} image={SILVER_MINERAL} min={0} max={50}/>
          </Col>
          <Col md={4}>
            <RobotNumberInput value={0} image={GOLD_MINERAL} min={0} max={50}/>
          </Col>
          <Col md={4}>
            <RobotNumberInput value={0} image={DEPOT_MINERALS} min={0} max={50}/>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <RobotButtonGroup value={0} participant={new MatchParticipant()} states={["Not Parked", "Parked"]} onChange={this.changeRobotOneEndgameState}/>
          </Col>
          <Col md={6}>
            <RobotButtonGroup value={0} participant={new MatchParticipant()} states={["Not Parked", "Parked"]} onChange={this.changeRobotOneEndgameState}/>
          </Col>
        </Row>
      </div>
    );
  }

  private renderTeleView(): JSX.Element {
    return (
      <div>
        <Row>
          <Col md={4}>
            <RobotNumberInput value={0} image={SILVER_MINERAL} min={0} max={50}/>
          </Col>
          <Col md={4}>
            <RobotNumberInput value={0} image={GOLD_MINERAL} min={0} max={50}/>
          </Col>
          <Col md={4}>
            <RobotNumberInput value={0} image={DEPOT_MINERALS} min={0} max={50}/>
          </Col>
        </Row>
      </div>
    );
  }

  private renderEndView(): JSX.Element {
    return (
      <div>
        <RobotButtonGroup value={0} participant={new MatchParticipant()} states={["Nothing", "Latched", "Partially Parked", "Fully Parked"]} onChange={this.changeRobotOneEndgameState}/>
        <RobotButtonGroup value={0} participant={new MatchParticipant()} states={["Nothing", "Latched", "Partially Parked", "Fully Parked"]} onChange={this.changeRobotTwoEndgameState}/>
      </div>
    );
  }

  private renderPenaltyView(): JSX.Element {
    return (
      <div>
        <Row>
          <Col md={6}>
            <RobotCardStatus participant={new MatchParticipant()}/>
          </Col>
          <Col md={6}>
            <RobotCardStatus participant={new MatchParticipant()}/>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <RobotPenaltyInput value={0} label={"Minor Penalties"} min={0} max={255}/>
          </Col>
          <Col md={6}>
            <RobotPenaltyInput value={0} label={"Major Penalties"} min={0} max={255}/>
          </Col>
        </Row>
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