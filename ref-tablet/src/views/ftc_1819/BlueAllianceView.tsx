import * as React from 'react';
import StatusBar from "../../components/StatusBar";
import RobotButtonGroup from "../../components/RobotButtonGroup";
import {Col, Nav, NavItem, NavLink, Row} from "reactstrap";
import RobotClaimToggle from "../../components/RobotClaimToggle";
import RobotSampling from "../../components/RobotSampling";
import RobotNumberInput from "../../components/RobotNumberInput";

import GOLD_MINERAL from '../../resources/ftc_1819/Gold_Mineral.png';
import SILVER_MINERAL from '../../resources/ftc_1819/Silver_Mineral.png';
import DEPOT_MINERALS from '../../resources/ftc_1819/Depot_Minerals.png';
import RobotCardStatus from "../../components/RobotCardStatus";
import RobotPenaltyInput from "../../components/RobotPenaltyInput";

import {Event, Match, MatchParticipant, RoverRuckusMatchDetails, RoverRuckusRefereeData, SocketProvider} from "@the-orange-alliance/lib-ems";

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
    const preOneStatus = matchDetails.bluePreRobotOneStatus;
    const preTwoStatus = matchDetails.bluePreRobotTwoStatus;
    const silverMinerals = matchDetails.blueTeleCargoSilverMinerals || 0;
    const goldMinerals = matchDetails.blueTeleCargoGoldMinerals || 0;
    const depotMinerals = matchDetails.blueTeleDepotMinerals || 0;
    const redOneClaimed = matchDetails.blueAutoRobotOneClaimed;
    const redTwoClaimed = matchDetails.blueAutoRobotTwoClaimed;
    const autoOneStatus = matchDetails.blueAutoRobotOneStatus;
    const autoTwoStatus = matchDetails.blueAutoRobotTwoStatus;
    const sampleOneSilverOne = refereeMetadata.blueSampleOneSilverOneStatus;
    const sampleOneSilverTwo = refereeMetadata.blueSampleOneSilverTwoStatus;
    const sampleOneGold = refereeMetadata.blueSampleOneGoldStatus;
    const sampleTwoSilverOne = refereeMetadata.blueSampleTwoSilverOneStatus;
    const sampleTwoSilverTwo = refereeMetadata.blueSampleTwoSilverTwoStatus;
    const sampleTwoGold = refereeMetadata.blueSampleTwoGoldStatus;
    // Match Participants
    const index = match.participants.length / 2;
    const participantOne = match.participants.length > 0 ? match.participants[index] : new MatchParticipant();
    const participantTwo = match.participants.length > 0 ? match.participants[index + 1] : new MatchParticipant();
    return (
      <div>
        <Row>
          <Col sm={12}>
            <RobotButtonGroup value={preOneStatus} participant={participantOne} states={["Not Present", "Not Latched", "Latched", "Landed"]} onChange={this.changeRobotOnePreState}/>
          </Col>
          <Col sm={12}>
            <RobotButtonGroup value={preTwoStatus} participant={participantTwo} states={["Not Present", "Not Latched", "Latched", "Landed"]} onChange={this.changeRobotTwoPreState}/>
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <RobotClaimToggle alliance={"Blue"} value={redOneClaimed} participant={participantOne} onToggle={this.toggleRobotOneClaim}/>
          </Col>
          <Col sm={6}>
            <RobotClaimToggle alliance={"Blue"} value={redTwoClaimed} participant={participantTwo} onToggle={this.toggleRobotTwoClaim}/>
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
    const silverMinerals = matchDetails.blueTeleCargoSilverMinerals || 0;
    const goldMinerals = matchDetails.blueTeleCargoGoldMinerals || 0;
    const depotMinerals = matchDetails.blueTeleDepotMinerals || 0;
    return (
      <div>
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
      </div>
    );
  }

  private renderEndView(): JSX.Element {
    const {match} = this.props;
    const {activeMatch} = this.state;
    const matchDetails = activeMatch.matchDetails as RoverRuckusMatchDetails;
    const endOneStatus = matchDetails.blueEndRobotOneStatus;
    const endTwoStatus = matchDetails.blueEndRobotTwoStatus;
    // Match Participants
    const index = match.participants.length / 2;
    const participantOne = match.participants.length > 0 ? match.participants[index] : new MatchParticipant();
    const participantTwo = match.participants.length > 0 ? match.participants[index + 1] : new MatchParticipant();
    return (
      <div>
        <RobotButtonGroup value={endOneStatus} participant={participantOne} states={["Nothing", "Latched", "Partially Parked", "Fully Parked"]} onChange={this.changeRobotOneEndgameState}/>
        <RobotButtonGroup value={endTwoStatus} participant={participantTwo} states={["Nothing", "Latched", "Partially Parked", "Fully Parked"]} onChange={this.changeRobotTwoEndgameState}/>
      </div>
    );
  }

  private renderPenaltyView(): JSX.Element {
    const {match} = this.props;
    const {activeMatch} = this.state;
    const minorPenalties = activeMatch.blueMinPen || 0;
    const majorPenalties = activeMatch.blueMajPen || 0;
    // Match Participants
    const index = match.participants.length / 2;
    const participantOne = match.participants.length > 0 ? match.participants[index] : new MatchParticipant();
    const participantTwo = match.participants.length > 0 ? match.participants[index + 1] : new MatchParticipant();
    return (
      <div>
        <Row>
          <Col sm={6}>
            <RobotCardStatus participant={participantOne} onUpdate={this.updateRobotOneCard}/>
          </Col>
          <Col sm={6}>
            <RobotCardStatus participant={participantTwo} onUpdate={this.updateRobotTwoCard}/>
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <RobotPenaltyInput value={minorPenalties} label={"Minor Penalties"} min={0} max={255} onChange={this.changeMinorPenalties}/>
          </Col>
          <Col sm={6}>
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
    details.bluePreRobotOneStatus = index;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeRobotTwoPreState(index: number) {
    const details: RoverRuckusMatchDetails = this.state.activeMatch.matchDetails as RoverRuckusMatchDetails;
    details.bluePreRobotTwoStatus = index;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeRobotOneAutoState(index: number) {
    const details: RoverRuckusMatchDetails = this.state.activeMatch.matchDetails as RoverRuckusMatchDetails;
    details.blueAutoRobotOneStatus = index;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeRobotTwoAutoState(index: number) {
    const details: RoverRuckusMatchDetails = this.state.activeMatch.matchDetails as RoverRuckusMatchDetails;
    details.blueAutoRobotTwoStatus = index;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private toggleRobotOneClaim() {
    const details: RoverRuckusMatchDetails = this.state.activeMatch.matchDetails as RoverRuckusMatchDetails;
    details.blueAutoRobotOneClaimed = !details.blueAutoRobotOneClaimed;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private toggleRobotTwoClaim() {
    const details: RoverRuckusMatchDetails = this.state.activeMatch.matchDetails as RoverRuckusMatchDetails;
    details.blueAutoRobotTwoClaimed = !details.blueAutoRobotTwoClaimed;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeSampleOne(index: number, successful: boolean) {
    const details: RoverRuckusMatchDetails = this.state.activeMatch.matchDetails as RoverRuckusMatchDetails;
    const lastSample: boolean = !this.state.refereeMetadata.blueSampleOneSilverOneStatus && !this.state.refereeMetadata.blueSampleOneSilverTwoStatus && this.state.refereeMetadata.blueSampleOneGoldStatus;
    if (index === 0) {
      this.state.refereeMetadata.blueSampleOneSilverOneStatus = !this.state.refereeMetadata.blueSampleOneSilverOneStatus;
    }
    if (index === 1) {
      this.state.refereeMetadata.blueSampleOneSilverTwoStatus = !this.state.refereeMetadata.blueSampleOneSilverTwoStatus;
    }
    if (index === 2) {
      this.state.refereeMetadata.blueSampleOneGoldStatus = !this.state.refereeMetadata.blueSampleOneGoldStatus;
    }
    if (typeof details.blueAutoSuccessfulSamples === "undefined") {
      details.blueAutoSuccessfulSamples = 0;
    }
    if (!lastSample && successful) {
      details.blueAutoSuccessfulSamples += 1;
    } else if (lastSample && !successful) {
      details.blueAutoSuccessfulSamples -= 1;
    }
    this.forceUpdate();
    this.sendUpdatedScore();
    this.sendRefereeData();
  }

  private changeSampleTwo(index: number, successful: boolean) {
    const details: RoverRuckusMatchDetails = this.state.activeMatch.matchDetails as RoverRuckusMatchDetails;
    const lastSample: boolean = !this.state.refereeMetadata.blueSampleTwoSilverOneStatus && !this.state.refereeMetadata.blueSampleTwoSilverTwoStatus && this.state.refereeMetadata.blueSampleTwoGoldStatus;
    if (index === 0) {
      this.state.refereeMetadata.blueSampleTwoSilverOneStatus = !this.state.refereeMetadata.blueSampleTwoSilverOneStatus;
    }
    if (index === 1) {
      this.state.refereeMetadata.blueSampleTwoSilverTwoStatus = !this.state.refereeMetadata.blueSampleTwoSilverTwoStatus;
    }
    if (index === 2) {
      this.state.refereeMetadata.blueSampleTwoGoldStatus = !this.state.refereeMetadata.blueSampleTwoGoldStatus;
    }
    if (typeof details.blueAutoSuccessfulSamples === "undefined") {
      details.blueAutoSuccessfulSamples = 0;
    }
    if (!lastSample && successful) {
      details.blueAutoSuccessfulSamples += 1;
    } else if (lastSample && !successful) {
      details.blueAutoSuccessfulSamples -= 1;
    }
    this.forceUpdate();
    this.sendUpdatedScore();
    this.sendRefereeData();
  }

  private changeAutoSilver(n: number) {
    const details: RoverRuckusMatchDetails = this.state.activeMatch.matchDetails as RoverRuckusMatchDetails;
    if (typeof details.blueAutoCargoSilverMinerals === "undefined") {
      details.blueAutoCargoSilverMinerals = 0;
    }
    details.blueAutoCargoSilverMinerals += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeAutoGold(n: number) {
    const details: RoverRuckusMatchDetails = this.state.activeMatch.matchDetails as RoverRuckusMatchDetails;
    if (typeof details.blueAutoCargoGoldMinerals === "undefined") {
      details.blueAutoCargoGoldMinerals = 0;
    }
    details.blueAutoCargoGoldMinerals += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeAutoDepot(n: number) {
    const details: RoverRuckusMatchDetails = this.state.activeMatch.matchDetails as RoverRuckusMatchDetails;
    if (typeof details.blueAutoDepotMinerals === "undefined") {
      details.blueAutoDepotMinerals = 0;
    }
    details.blueAutoDepotMinerals += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeTeleSilver(n: number) {
    const details: RoverRuckusMatchDetails = this.state.activeMatch.matchDetails as RoverRuckusMatchDetails;
    if (typeof details.blueTeleCargoSilverMinerals === "undefined") {
      details.blueTeleCargoSilverMinerals = 0;
    }
    details.blueTeleCargoSilverMinerals += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeTeleGold(n: number) {
    const details: RoverRuckusMatchDetails = this.state.activeMatch.matchDetails as RoverRuckusMatchDetails;
    if (typeof details.blueTeleCargoGoldMinerals === "undefined") {
      details.blueTeleCargoGoldMinerals = 0;
    }
    details.blueTeleCargoGoldMinerals += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeTeleDepot(n: number) {
    const details: RoverRuckusMatchDetails = this.state.activeMatch.matchDetails as RoverRuckusMatchDetails;
    if (typeof details.blueTeleDepotMinerals === "undefined") {
      details.blueTeleDepotMinerals = 0;
    }
    details.blueTeleDepotMinerals += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeRobotOneEndgameState(index: number) {
    const details: RoverRuckusMatchDetails = this.state.activeMatch.matchDetails as RoverRuckusMatchDetails;
    details.blueEndRobotOneStatus = index;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeRobotTwoEndgameState(index: number) {
    const details: RoverRuckusMatchDetails = this.state.activeMatch.matchDetails as RoverRuckusMatchDetails;
    details.blueEndRobotTwoStatus = index;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private updateRobotOneCard(cardStatus: number) {
    const index = this.props.match.participants.length / 2;
    this.props.match.participants[index].cardStatus = cardStatus;
    if (this.state.activeMatch.participants.length <= 0) {
      if (this.props.match.participants.length > 0) {
        this.state.activeMatch.participants = this.props.match.participants;
      } else {
        this.state.activeMatch.participants = [new MatchParticipant(), new MatchParticipant(), new MatchParticipant(), new MatchParticipant()];
      }
    }
    this.state.activeMatch.participants[index].cardStatus = cardStatus;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private updateRobotTwoCard(cardStatus: number) {
    const index = this.props.match.participants.length / 2;
    this.props.match.participants[index + 1].cardStatus = cardStatus;
    if (this.state.activeMatch.participants.length <= 0) {
      if (this.props.match.participants.length > 0) {
        this.state.activeMatch.participants = this.props.match.participants;
      } else {
        this.state.activeMatch.participants = [new MatchParticipant(), new MatchParticipant(), new MatchParticipant(), new MatchParticipant()];
      }
    }
    this.state.activeMatch.participants[index + 1].cardStatus = cardStatus;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeMinorPenalties(n: number) {
    if (typeof this.state.activeMatch.blueMinPen === "undefined") {
      this.state.activeMatch.blueMinPen = 0;
    }
    this.state.activeMatch.blueMinPen += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeMajorPenalties(n: number) {
    if (typeof this.state.activeMatch.blueMajPen === "undefined") {
      this.state.activeMatch.blueMajPen = 0;
    }
    this.state.activeMatch.blueMajPen += n;
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