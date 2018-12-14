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
import SocketProvider from "../../shared/providers/SocketProvider";

interface IProps {
  event: Event,
  match: Match,
  mode: string,
  connected: boolean
}

interface IState {
  activeMatch: Match,
  currentMode: number,
  refereeMetadata: RoverRuckusRefereeData
}

class RedAllianceView extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      activeMatch: new Match(),
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
    this.updateRobotOneCard = this.updateRobotOneCard.bind(this);
    this.updateRobotTwoCard = this.updateRobotTwoCard.bind(this);
    this.changeMinorPenalties = this.changeMinorPenalties.bind(this);
    this.changeMajorPenalties = this.changeMajorPenalties.bind(this);

    SocketProvider.on("score-update", (matchJSON: any) => {
      const match: Match = new Match().fromJSON(matchJSON);
      if (typeof matchJSON.details !== "undefined") {
        const seasonKey: number = parseInt(match.matchKey.split("-")[0], 10);
        match.matchDetails = Match.getDetailsFromSeasonKey(seasonKey).fromJSON(matchJSON.details);
      }
      if (typeof matchJSON.participants !== "undefined") {
        match.participants = matchJSON.participants.map((p: any) => new MatchParticipant().fromJSON(p));
      }
      this.setState({activeMatch: match});
    });
    SocketProvider.on("data-update", (dataJSON: any) => {
      this.setState({refereeMetadata: new RoverRuckusRefereeData().fromJSON(dataJSON)});
    });
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (prevProps.match.matchKey.length !== this.props.match.matchKey.length) {
      this.state.activeMatch.matchKey = this.props.match.matchKey;
      this.state.activeMatch.matchDetails.matchKey = this.props.match.matchKey;
      this.state.activeMatch.matchDetails.matchDetailKey = this.props.match.matchKey + "D";
    }
    if (prevProps.match.participants.length !== this.props.match.participants.length) {
      this.state.activeMatch.participants = this.props.match.participants;
    }
  }

  public componentWillUnmount() {
    SocketProvider.off("score-update");
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
    const {activeMatch, refereeMetadata} = this.state;
    const matchDetails = activeMatch.matchDetails as RoverRuckusMatchDetails;
    const preOneStatus = matchDetails.redPreRobotOneStatus;
    const preTwoStatus = matchDetails.redPreRobotTwoStatus;
    const silverMinerals = matchDetails.redTeleCargoSilverMinerals || 0;
    const goldMinerals = matchDetails.redTeleCargoGoldMinerals || 0;
    const depotMinerals = matchDetails.redTeleDepotMinerals || 0;
    const redOneClaimed = matchDetails.redAutoRobotOneClaimed;
    const redTwoClaimed = matchDetails.redAutoRobotTwoClaimed;
    const autoOneStatus = matchDetails.redAutoRobotOneStatus;
    const autoTwoStatus = matchDetails.redAutoRobotTwoStatus;
    const sampleOneSilverOne = refereeMetadata.redSampleOneSilverOneStatus;
    const sampleOneSilverTwo = refereeMetadata.redSampleOneSilverTwoStatus;
    const sampleOneGold = refereeMetadata.redSampleOneGoldStatus;
    const sampleTwoSilverOne = refereeMetadata.redSampleTwoSilverOneStatus;
    const sampleTwoSilverTwo = refereeMetadata.redSampleTwoSilverTwoStatus;
    const sampleTwoGold = refereeMetadata.redSampleTwoGoldStatus;
    // Match Participants
    const participantOne = match.participants.length > 0 ? match.participants[0] : new MatchParticipant();
    const participantTwo = match.participants.length > 0 ? match.participants[1] : new MatchParticipant();
    return (
      <div>
        <Row>
          <Col sm={6}>
            <RobotButtonGroup value={preOneStatus} participant={participantOne} states={["Not Present", "Not Latched", "Latched", "Landed"]} onChange={this.changeRobotOnePreState}/>
          </Col>
          <Col sm={6}>
            <RobotButtonGroup value={preTwoStatus} participant={participantTwo} states={["Not Present", "Not Latched", "Latched", "Landed"]} onChange={this.changeRobotTwoPreState}/>
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <RobotClaimToggle alliance={"red"} value={redOneClaimed} participant={participantOne} onToggle={this.toggleRobotOneClaim}/>
          </Col>
          <Col sm={6}>
            <RobotClaimToggle alliance={"red"} value={redTwoClaimed} participant={participantTwo} onToggle={this.toggleRobotTwoClaim}/>
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <RobotSampling goldStatus={sampleOneGold} silverOneStatus={sampleOneSilverOne} silverTwoStatus={sampleOneSilverTwo} onChange={this.changeSampleOne}/>
          </Col>
          <Col sm={6}>
            <RobotSampling goldStatus={sampleTwoGold} silverOneStatus={sampleTwoSilverOne} silverTwoStatus={sampleTwoSilverTwo} onChange={this.changeSampleTwo}/>
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <RobotNumberInput value={silverMinerals} image={SILVER_MINERAL} min={0} max={50} onChange={this.changeTeleSilver}/>
          </Col>
          <Col sm={4}>
            <RobotNumberInput value={goldMinerals} image={GOLD_MINERAL} min={0} max={50} onChange={this.changeTeleGold}/>
          </Col>
          <Col sm={4}>
            <RobotNumberInput value={depotMinerals} image={DEPOT_MINERALS} min={0} max={50} onChange={this.changeTeleDepot}/>
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <RobotButtonGroup value={autoOneStatus} participant={participantOne} states={["Not Parked", "Parked"]} onChange={this.changeRobotOneAutoState}/>
          </Col>
          <Col sm={6}>
            <RobotButtonGroup value={autoTwoStatus} participant={participantTwo} states={["Not Parked", "Parked"]} onChange={this.changeRobotTwoAutoState}/>
          </Col>
        </Row>
      </div>
    );
  }

  private renderTeleView(): JSX.Element {
    const {activeMatch} = this.state;
    const matchDetails = activeMatch.matchDetails as RoverRuckusMatchDetails;
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
    const {activeMatch} = this.state;
    const matchDetails = activeMatch.matchDetails as RoverRuckusMatchDetails;
    const endOneStatus = matchDetails.redEndRobotOneStatus;
    const endTwoStatus = matchDetails.redEndRobotTwoStatus;
    // Match Participants
    const participantOne = match.participants.length > 0 ? match.participants[0] : new MatchParticipant();
    const participantTwo = match.participants.length > 0 ? match.participants[1] : new MatchParticipant();
    return (
      <div>
        <RobotButtonGroup value={endOneStatus} participant={participantOne} states={["Nothing", "Latched", "Partially Parked", "Fully Parked"]} onChange={this.changeRobotOneEndgameState}/>
        <RobotButtonGroup value={endTwoStatus} participant={participantTwo} states={["Nothing", "Latched", "Partially Parked", "Fully Parked"]} onChange={this.changeRobotTwoEndgameState}/>
      </div>
    );
  }

  private renderPenaltyView(): JSX.Element {
    const {activeMatch} = this.state;
    const minorPenalties = activeMatch.redMinPen || 0;
    const majorPenalties = activeMatch.redMajPen || 0;
    // Match Participants
    const participantOne = activeMatch.participants.length > 0 ? activeMatch.participants[0] : new MatchParticipant();
    const participantTwo = activeMatch.participants.length > 0 ? activeMatch.participants[1] : new MatchParticipant();
    return (
      <div>
        <Row>
          <Col md={6}>
            <RobotCardStatus participant={participantOne} onUpdate={this.updateRobotOneCard}/>
          </Col>
          <Col md={6}>
            <RobotCardStatus participant={participantTwo} onUpdate={this.updateRobotTwoCard}/>
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
    const details: RoverRuckusMatchDetails = this.state.activeMatch.matchDetails as RoverRuckusMatchDetails;
    details.redPreRobotOneStatus = index;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeRobotTwoPreState(index: number) {
    const details: RoverRuckusMatchDetails = this.state.activeMatch.matchDetails as RoverRuckusMatchDetails;
    details.redPreRobotTwoStatus = index;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeRobotOneAutoState(index: number) {
    const details: RoverRuckusMatchDetails = this.state.activeMatch.matchDetails as RoverRuckusMatchDetails;
    details.redAutoRobotOneStatus = index;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeRobotTwoAutoState(index: number) {
    const details: RoverRuckusMatchDetails = this.state.activeMatch.matchDetails as RoverRuckusMatchDetails;
    details.redAutoRobotTwoStatus = index;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private toggleRobotOneClaim() {
    const details: RoverRuckusMatchDetails = this.state.activeMatch.matchDetails as RoverRuckusMatchDetails;
    details.redAutoRobotOneClaimed = !details.redAutoRobotOneClaimed;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private toggleRobotTwoClaim() {
    const details: RoverRuckusMatchDetails = this.state.activeMatch.matchDetails as RoverRuckusMatchDetails;
    details.redAutoRobotTwoClaimed = !details.redAutoRobotTwoClaimed;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeSampleOne(index: number, successful: boolean) {
    const details: RoverRuckusMatchDetails = this.state.activeMatch.matchDetails as RoverRuckusMatchDetails;
    const lastSample: boolean = !this.state.refereeMetadata.redSampleOneSilverOneStatus && !this.state.refereeMetadata.redSampleOneSilverTwoStatus && this.state.refereeMetadata.redSampleOneGoldStatus;
    if (index === 0) {
      this.state.refereeMetadata.redSampleOneSilverOneStatus = !this.state.refereeMetadata.redSampleOneSilverOneStatus;
    }
    if (index === 1) {
      this.state.refereeMetadata.redSampleOneSilverTwoStatus = !this.state.refereeMetadata.redSampleOneSilverTwoStatus;
    }
    if (index === 2) {
      this.state.refereeMetadata.redSampleOneGoldStatus = !this.state.refereeMetadata.redSampleOneGoldStatus;
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
    this.sendUpdatedScore();
    this.sendRefereeData();
  }

  private changeSampleTwo(index: number, successful: boolean) {
    const details: RoverRuckusMatchDetails = this.state.activeMatch.matchDetails as RoverRuckusMatchDetails;
    const lastSample: boolean = !this.state.refereeMetadata.redSampleTwoSilverOneStatus && !this.state.refereeMetadata.redSampleTwoSilverTwoStatus && this.state.refereeMetadata.redSampleTwoGoldStatus;
    if (index === 0) {
      this.state.refereeMetadata.redSampleTwoSilverOneStatus = !this.state.refereeMetadata.redSampleTwoSilverOneStatus;
    }
    if (index === 1) {
      this.state.refereeMetadata.redSampleTwoSilverTwoStatus = !this.state.refereeMetadata.redSampleTwoSilverTwoStatus;
    }
    if (index === 2) {
      this.state.refereeMetadata.redSampleTwoGoldStatus = !this.state.refereeMetadata.redSampleTwoGoldStatus;
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
    this.sendUpdatedScore();
    this.sendRefereeData();
  }

  private changeAutoSilver(n: number) {
    const details: RoverRuckusMatchDetails = this.state.activeMatch.matchDetails as RoverRuckusMatchDetails;
    if (typeof details.redAutoCargoSilverMinerals === "undefined") {
      details.redAutoCargoSilverMinerals = 0;
    }
    details.redAutoCargoSilverMinerals += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeAutoGold(n: number) {
    const details: RoverRuckusMatchDetails = this.state.activeMatch.matchDetails as RoverRuckusMatchDetails;
    if (typeof details.redAutoCargoGoldMinerals === "undefined") {
      details.redAutoCargoGoldMinerals = 0;
    }
    details.redAutoCargoGoldMinerals += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeAutoDepot(n: number) {
    const details: RoverRuckusMatchDetails = this.state.activeMatch.matchDetails as RoverRuckusMatchDetails;
    if (typeof details.redAutoDepotMinerals === "undefined") {
      details.redAutoDepotMinerals = 0;
    }
    details.redAutoDepotMinerals += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeTeleSilver(n: number) {
    const details: RoverRuckusMatchDetails = this.state.activeMatch.matchDetails as RoverRuckusMatchDetails;
    if (typeof details.redTeleCargoSilverMinerals === "undefined") {
      details.redTeleCargoSilverMinerals = 0;
    }
    details.redTeleCargoSilverMinerals += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeTeleGold(n: number) {
    const details: RoverRuckusMatchDetails = this.state.activeMatch.matchDetails as RoverRuckusMatchDetails;
    if (typeof details.redTeleCargoGoldMinerals === "undefined") {
      details.redTeleCargoGoldMinerals = 0;
    }
    details.redTeleCargoGoldMinerals += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeTeleDepot(n: number) {
    const details: RoverRuckusMatchDetails = this.state.activeMatch.matchDetails as RoverRuckusMatchDetails;
    if (typeof details.redTeleDepotMinerals === "undefined") {
      details.redTeleDepotMinerals = 0;
    }
    details.redTeleDepotMinerals += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeRobotOneEndgameState(index: number) {
    const details: RoverRuckusMatchDetails = this.state.activeMatch.matchDetails as RoverRuckusMatchDetails;
    details.redEndRobotOneStatus = index;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeRobotTwoEndgameState(index: number) {
    const details: RoverRuckusMatchDetails = this.state.activeMatch.matchDetails as RoverRuckusMatchDetails;
    details.redEndRobotTwoStatus = index;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private updateRobotOneCard(cardStatus: number) {
    this.props.match.participants[0].cardStatus = cardStatus;
    if (this.state.activeMatch.participants.length <= 0) {
      if (this.props.match.participants.length > 0) {
        this.state.activeMatch.participants = this.props.match.participants;
      } else {
        this.state.activeMatch.participants = [new MatchParticipant(), new MatchParticipant(), new MatchParticipant(), new MatchParticipant()];
      }
    }
    this.state.activeMatch.participants[0].cardStatus = cardStatus;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private updateRobotTwoCard(cardStatus: number) {
    this.props.match.participants[1].cardStatus = cardStatus;
    if (this.state.activeMatch.participants.length <= 0) {
      if (this.props.match.participants.length > 0) {
        this.state.activeMatch.participants = this.props.match.participants;
      } else {
        this.state.activeMatch.participants = [new MatchParticipant(), new MatchParticipant(), new MatchParticipant(), new MatchParticipant()];
      }
    }
    this.state.activeMatch.participants[1].cardStatus = cardStatus;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeMinorPenalties(n: number) {
    if (typeof this.state.activeMatch.redMinPen === "undefined") {
      this.state.activeMatch.redMinPen = 0;
    }
    this.state.activeMatch.redMinPen += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeMajorPenalties(n: number) {
    if (typeof this.state.activeMatch.redMajPen === "undefined") {
      this.state.activeMatch.redMajPen = 0;
    }
    this.state.activeMatch.redMajPen += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private sendUpdatedScore() {
    if (this.state.activeMatch.participants.length <= 0) {
      if (this.props.match.participants.length > 0) {
        this.state.activeMatch.participants = this.props.match.participants;
      } else {
        this.state.activeMatch.participants = [new MatchParticipant(), new MatchParticipant(), new MatchParticipant(), new MatchParticipant()];
      }
    }
    SocketProvider.emit("score-update", this.state.activeMatch.toJSON());
  }

  private sendRefereeData() {
    SocketProvider.emit("data-update", this.state.refereeMetadata.toJSON());
  }
}

export default RedAllianceView;