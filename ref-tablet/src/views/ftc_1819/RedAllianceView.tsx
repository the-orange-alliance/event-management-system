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
import RoverRuckusMatchDetails from "../../shared/models/RoverRuckusMatchDetails";
import RoverRuckusRefereeData from "../../shared/models/RoverRuckusRefereeData";

interface IProps {
  event: Event,
  match: Match,
  mode: string,
  connected: boolean
}

interface IState {
  currentMode: number,
  refereeMetadata: RoverRuckusRefereeData
}

class RedAllianceView extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      currentMode: 0,
      refereeMetadata: new RoverRuckusRefereeData()
    };
    this.changeModeTab = this.changeModeTab.bind(this);
    this.changeRobotOnePreState = this.changeRobotOnePreState.bind(this);
    this.changeRobotTwoPreState = this.changeRobotTwoPreState.bind(this);
    this.changeRobotOneAutoState = this.changeRobotOneAutoState.bind(this);
    this.changeRobotTwoAutoState = this.changeRobotTwoAutoState.bind(this);
    this.changeSampleOne = this.changeSampleOne.bind(this);
    this.changeSampleTwo = this.changeSampleTwo.bind(this);
    this.changeAutoSilver = this.changeAutoSilver.bind(this);
    this.changeAutoGold = this.changeAutoGold.bind(this);
    this.changeAutoDepot = this.changeAutoDepot.bind(this);
    this.toggleRobotOneClaim = this.toggleRobotOneClaim.bind(this);
    this.toggleRobotTwoClaim = this.toggleRobotTwoClaim.bind(this);
    this.changeTeleSilver = this.changeTeleSilver.bind(this);
    this.changeTeleGold = this.changeTeleGold.bind(this);
    this.changeTeleDepot = this.changeTeleDepot.bind(this);
    this.changeRobotOneEndgameState = this.changeRobotOneEndgameState.bind(this);
    this.changeRobotTwoEndgameState = this.changeRobotTwoEndgameState.bind(this);
    this.changeMinorPenalties = this.changeMinorPenalties.bind(this);
    this.changeMajorPenalties = this.changeMajorPenalties.bind(this);
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
    const {match} = this.props;
    const {refereeMetadata} = this.state;
    const matchDetails = match.matchDetails as RoverRuckusMatchDetails;
    const preOneStatus = matchDetails.redPreRobotOneStatus;
    const preTwoStatus = matchDetails.redPreRobotTwoStatus;
    const silverMinerals = matchDetails.redAutoCargoSilverMinerals || 0;
    const goldMinerals = matchDetails.redAutoCargoGoldMinerals || 0;
    const depotMinerals = matchDetails.redAutoDepotMinerals || 0;
    const redOneClaimed = matchDetails.redAutoRobotOneClaimed;
    const redTwoClaimed = matchDetails.redAutoRobotTwoClaimed;
    const autoOneStatus = matchDetails.redAutoRobotOneStatus;
    const autoTwoStatus = matchDetails.redAutoRobotTwoStatus;
    const sampleOneSilverOne = refereeMetadata.sampleOneSilverOneStatus;
    const sampleOneSilverTwo = refereeMetadata.sampleOneSilverTwoStatus;
    const sampleOneGold = refereeMetadata.sampleOneGoldStatus;
    const sampleTwoSilverOne = refereeMetadata.sampleTwoSilverOneStatus;
    const sampleTwoSilverTwo = refereeMetadata.sampleTwoSilverTwoStatus;
    const sampleTwoGold = refereeMetadata.sampleTwoGoldStatus;
    return (
      <div>
        <Row>
          <Col md={6}>
            <RobotButtonGroup value={preOneStatus} participant={new MatchParticipant()} states={["Not Present", "Not Latched", "Latched", "Landed"]} onChange={this.changeRobotOnePreState}/>
          </Col>
          <Col md={6}>
            <RobotButtonGroup value={preTwoStatus} participant={new MatchParticipant()} states={["Not Present", "Not Latched", "Latched", "Landed"]} onChange={this.changeRobotTwoPreState}/>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <RobotClaimToggle value={redOneClaimed} participant={new MatchParticipant()} onToggle={this.toggleRobotOneClaim}/>
          </Col>
          <Col md={6}>
            <RobotClaimToggle value={redTwoClaimed} participant={new MatchParticipant()} onToggle={this.toggleRobotTwoClaim}/>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <RobotSampling goldStatus={sampleOneGold} silverOneStatus={sampleOneSilverOne} silverTwoStatus={sampleOneSilverTwo} onChange={this.changeSampleOne}/>
          </Col>
          <Col md={6}>
            <RobotSampling goldStatus={sampleTwoGold} silverOneStatus={sampleTwoSilverOne} silverTwoStatus={sampleTwoSilverTwo} onChange={this.changeSampleTwo}/>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <RobotNumberInput value={silverMinerals} image={SILVER_MINERAL} min={0} max={50} onChange={this.changeAutoSilver}/>
          </Col>
          <Col md={4}>
            <RobotNumberInput value={goldMinerals} image={GOLD_MINERAL} min={0} max={50} onChange={this.changeAutoGold}/>
          </Col>
          <Col md={4}>
            <RobotNumberInput value={depotMinerals} image={DEPOT_MINERALS} min={0} max={50} onChange={this.changeAutoDepot}/>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <RobotButtonGroup value={autoOneStatus} participant={new MatchParticipant()} states={["Not Parked", "Parked"]} onChange={this.changeRobotOneAutoState}/>
          </Col>
          <Col md={6}>
            <RobotButtonGroup value={autoTwoStatus} participant={new MatchParticipant()} states={["Not Parked", "Parked"]} onChange={this.changeRobotTwoAutoState}/>
          </Col>
        </Row>
      </div>
    );
  }

  private renderTeleView(): JSX.Element {
    const {match} = this.props;
    const matchDetails = match.matchDetails as RoverRuckusMatchDetails;
    const silverMinerals = matchDetails.redTeleCargoSilverMinerals || 0;
    const goldMinerals = matchDetails.redTeleCargoGoldMinerals || 0;
    const depotMinerals = matchDetails.redTeleDepotMinerals || 0;
    return (
      <div>
        <Row>
          <Col md={4}>
            <RobotNumberInput value={silverMinerals} image={SILVER_MINERAL} min={0} max={50} onChange={this.changeTeleSilver}/>
          </Col>
          <Col md={4}>
            <RobotNumberInput value={goldMinerals} image={GOLD_MINERAL} min={0} max={50} onChange={this.changeTeleGold}/>
          </Col>
          <Col md={4}>
            <RobotNumberInput value={depotMinerals} image={DEPOT_MINERALS} min={0} max={50} onChange={this.changeTeleDepot}/>
          </Col>
        </Row>
      </div>
    );
  }

  private renderEndView(): JSX.Element {
    const {match} = this.props;
    const matchDetails = match.matchDetails as RoverRuckusMatchDetails;
    const endOneStatus = matchDetails.redEndRobotOneStatus;
    const endTwoStatus = matchDetails.redEndRobotTwoStatus;
    return (
      <div>
        <RobotButtonGroup value={endOneStatus} participant={new MatchParticipant()} states={["Nothing", "Latched", "Partially Parked", "Fully Parked"]} onChange={this.changeRobotOneEndgameState}/>
        <RobotButtonGroup value={endTwoStatus} participant={new MatchParticipant()} states={["Nothing", "Latched", "Partially Parked", "Fully Parked"]} onChange={this.changeRobotTwoEndgameState}/>
      </div>
    );
  }

  private renderPenaltyView(): JSX.Element {
    const {match} = this.props;
    const minorPenalties = match.redMinPen || 0;
    const majorPenalties = match.redMajPen || 0;
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
            <RobotPenaltyInput value={minorPenalties} label={"Minor Penalties"} min={0} max={255} onChange={this.changeMinorPenalties}/>
          </Col>
          <Col md={6}>
            <RobotPenaltyInput value={majorPenalties} label={"Major Penalties"} min={0} max={255} onChange={this.changeMajorPenalties}/>
          </Col>
        </Row>
      </div>
    );
  }

  private changeModeTab(index: number) {
    this.setState({currentMode: index});
  }

  private changeRobotOnePreState(index: number) {
    const details: RoverRuckusMatchDetails = this.props.match.matchDetails as RoverRuckusMatchDetails;
    details.redPreRobotOneStatus = index;
    this.forceUpdate();
  }

  private changeRobotTwoPreState(index: number) {
    const details: RoverRuckusMatchDetails = this.props.match.matchDetails as RoverRuckusMatchDetails;
    details.redPreRobotTwoStatus = index;
    this.forceUpdate();
  }

  private changeRobotOneAutoState(index: number) {
    const details: RoverRuckusMatchDetails = this.props.match.matchDetails as RoverRuckusMatchDetails;
    details.redAutoRobotOneStatus = index;
    this.forceUpdate();
  }

  private changeRobotTwoAutoState(index: number) {
    const details: RoverRuckusMatchDetails = this.props.match.matchDetails as RoverRuckusMatchDetails;
    details.redAutoRobotTwoStatus = index;
    this.forceUpdate();
  }

  private toggleRobotOneClaim() {
    const details: RoverRuckusMatchDetails = this.props.match.matchDetails as RoverRuckusMatchDetails;
    details.redAutoRobotOneClaimed = !details.redAutoRobotOneClaimed;
    this.forceUpdate();
  }

  private toggleRobotTwoClaim() {
    const details: RoverRuckusMatchDetails = this.props.match.matchDetails as RoverRuckusMatchDetails;
    details.redAutoRobotTwoClaimed = !details.redAutoRobotTwoClaimed;
    this.forceUpdate();
  }

  private changeSampleOne(index: number, successful: boolean) {
    const details: RoverRuckusMatchDetails = this.props.match.matchDetails as RoverRuckusMatchDetails;
    const lastSample: boolean = !this.state.refereeMetadata.sampleOneSilverOneStatus && !this.state.refereeMetadata.sampleOneSilverTwoStatus && this.state.refereeMetadata.sampleOneGoldStatus;
    if (index === 0) {
      this.state.refereeMetadata.sampleOneSilverOneStatus = !this.state.refereeMetadata.sampleOneSilverOneStatus;
    }
    if (index === 1) {
      this.state.refereeMetadata.sampleOneSilverTwoStatus = !this.state.refereeMetadata.sampleOneSilverTwoStatus;
    }
    if (index === 2) {
      this.state.refereeMetadata.sampleOneGoldStatus = !this.state.refereeMetadata.sampleOneGoldStatus;
    }
    if (typeof details.redAutoSuccessfulSamples === "undefined") {
      details.redAutoSuccessfulSamples = 0;
    }
    if (!lastSample && successful) {
      details.redAutoSuccessfulSamples += 1;
    } else if (lastSample && !successful) {
      details.redAutoSuccessfulSamples -= 1;
    }
    this.forceUpdate();
  }

  private changeSampleTwo(index: number, successful: boolean) {
    const details: RoverRuckusMatchDetails = this.props.match.matchDetails as RoverRuckusMatchDetails;
    const lastSample: boolean = !this.state.refereeMetadata.sampleTwoSilverOneStatus && !this.state.refereeMetadata.sampleTwoSilverTwoStatus && this.state.refereeMetadata.sampleTwoGoldStatus;
    if (index === 0) {
      this.state.refereeMetadata.sampleTwoSilverOneStatus = !this.state.refereeMetadata.sampleTwoSilverOneStatus;
    }
    if (index === 1) {
      this.state.refereeMetadata.sampleTwoSilverTwoStatus = !this.state.refereeMetadata.sampleTwoSilverTwoStatus;
    }
    if (index === 2) {
      this.state.refereeMetadata.sampleTwoGoldStatus = !this.state.refereeMetadata.sampleTwoGoldStatus;
    }
    if (typeof details.redAutoSuccessfulSamples === "undefined") {
      details.redAutoSuccessfulSamples = 0;
    }
    if (!lastSample && successful) {
      details.redAutoSuccessfulSamples += 1;
    } else if (lastSample && !successful) {
      details.redAutoSuccessfulSamples -= 1;
    }
    this.forceUpdate();
  }

  private changeAutoSilver(n: number) {
    const details: RoverRuckusMatchDetails = this.props.match.matchDetails as RoverRuckusMatchDetails;
    if (typeof details.redAutoCargoSilverMinerals === "undefined") {
      details.redAutoCargoSilverMinerals = 0;
    }
    details.redAutoCargoSilverMinerals += n;
    this.forceUpdate();
  }

  private changeAutoGold(n: number) {
    const details: RoverRuckusMatchDetails = this.props.match.matchDetails as RoverRuckusMatchDetails;
    if (typeof details.redAutoCargoGoldMinerals === "undefined") {
      details.redAutoCargoGoldMinerals = 0;
    }
    details.redAutoCargoGoldMinerals += n;
    this.forceUpdate();
  }

  private changeAutoDepot(n: number) {
    const details: RoverRuckusMatchDetails = this.props.match.matchDetails as RoverRuckusMatchDetails;
    if (typeof details.redAutoDepotMinerals === "undefined") {
      details.redAutoDepotMinerals = 0;
    }
    details.redAutoDepotMinerals += n;
    this.forceUpdate();
  }

  private changeTeleSilver(n: number) {
    const details: RoverRuckusMatchDetails = this.props.match.matchDetails as RoverRuckusMatchDetails;
    if (typeof details.redTeleCargoSilverMinerals === "undefined") {
      details.redTeleCargoSilverMinerals = 0;
    }
    details.redTeleCargoSilverMinerals += n;
    this.forceUpdate();
  }

  private changeTeleGold(n: number) {
    const details: RoverRuckusMatchDetails = this.props.match.matchDetails as RoverRuckusMatchDetails;
    if (typeof details.redTeleCargoGoldMinerals === "undefined") {
      details.redTeleCargoGoldMinerals = 0;
    }
    details.redTeleCargoGoldMinerals += n;
    this.forceUpdate();
  }

  private changeTeleDepot(n: number) {
    const details: RoverRuckusMatchDetails = this.props.match.matchDetails as RoverRuckusMatchDetails;
    if (typeof details.redTeleDepotMinerals === "undefined") {
      details.redTeleDepotMinerals = 0;
    }
    details.redTeleDepotMinerals += n;
    this.forceUpdate();
  }

  private changeRobotOneEndgameState(index: number) {
    const details: RoverRuckusMatchDetails = this.props.match.matchDetails as RoverRuckusMatchDetails;
    details.redEndRobotOneStatus = index;
    this.forceUpdate();
  }

  private changeRobotTwoEndgameState(index: number) {
    const details: RoverRuckusMatchDetails = this.props.match.matchDetails as RoverRuckusMatchDetails;
    details.redEndRobotTwoStatus = index;
    this.forceUpdate();
  }

  private changeMinorPenalties(n: number) {
    this.props.match.redMinPen += n;
    if (typeof this.props.match.redMinPen === "undefined") {
      this.props.match.redMinPen = 0;
    }
    this.forceUpdate();
  }

  private changeMajorPenalties(n: number) {
    this.props.match.redMajPen += n;
    if (typeof this.props.match.redMajPen === "undefined") {
      this.props.match.redMajPen = 0;
    }
    this.forceUpdate();
  }
}

export default RedAllianceView;