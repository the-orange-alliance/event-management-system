import * as React from "react";
import StatusBar from "../../components/StatusBar";
import {Event, Match, MatchParticipant, OceanOpportunitiesMatchDetails, SocketProvider} from "@the-orange-alliance/lib-ems";
import {Col, Nav, NavItem, NavLink, Row, Spinner} from "reactstrap";
import RobotCardStatus from "../../components/RobotCardStatus";
import RobotPenaltyInput from "../../components/RobotPenaltyInput";
import RobotNumberInput from "../../components/RobotNumberInput";
import RobotButtonGroup from "../../components/RobotButtonGroup";

interface IProps {
  event: Event,
  match: Match,
  mode: string,
  connected: boolean,
  waitingForMatch: boolean
}

interface IState {
  currentMode: number
}

class BlueAllianceView extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      currentMode: 0
    };

    this.changeModeTab = this.changeModeTab.bind(this);
    this.changeRobotOneDocking = this.changeRobotOneDocking.bind(this);
    this.changeRobotTwoDocking = this.changeRobotTwoDocking.bind(this);
    this.changeRobotThreeDocking = this.changeRobotThreeDocking.bind(this);
    this.changeProcessingBargeRecovery = this.changeProcessingBargeRecovery.bind(this);
    this.changeProcessingBargeRecycle = this.changeProcessingBargeRecycle.bind(this);
    this.changeProcessingBargeReuse = this.changeProcessingBargeReuse.bind(this);
    this.changeReductionProcessing = this.changeReductionProcessing.bind(this);
    this.updateRobotCard = this.updateRobotCard.bind(this);
    this.changeMinorPenalties = this.changeMinorPenalties.bind(this);
  }

  public componentWillMount() {
    if (typeof this.props.match.matchDetails === "undefined") {
      this.props.match.matchDetails = new OceanOpportunitiesMatchDetails();
    }
    if (typeof this.props.match.participants === "undefined") {
      this.props.match.participants = [];
    }
  }

  public render() {
    const {match, mode, connected, waitingForMatch} = this.props;
    const {currentMode} = this.state;

    let modeView: JSX.Element;

    if (waitingForMatch) {
      modeView = (
        <div id={"spinner-container"}>
          <span>Waiting For a Match...</span>
          <Spinner
            color={"success"}
            style={{ width: '7rem', height: '7rem' }}
          />
        </div>
      );
    } else {
      switch (currentMode) {
        case 0:
          modeView = this.renderTeleView();
          break;
        case 1:
          modeView = this.renderEndView();
          break;
        case 2:
          modeView = this.renderPenaltyView();
          break;
        default:
          modeView = this.renderTeleView();
      }
    }

    return (
      <div className={"alliance-view"}>
        <StatusBar match={match} mode={mode} connected={connected}/>
        <Nav tabs={true}>
          <NavItem>
            <NavLink active={currentMode === 0} href="#" onClick={this.changeModeTab.bind(this, 0)}>TELEOP</NavLink>
          </NavItem>
          <NavItem>
            <NavLink active={currentMode === 1} href="#" onClick={this.changeModeTab.bind(this, 1)}>ENDGAME</NavLink>
          </NavItem>
          <NavItem>
            <NavLink active={currentMode === 2} href="#" onClick={this.changeModeTab.bind(this, 2)}>CARDS/PENALTIES</NavLink>
          </NavItem>
        </Nav>
        {modeView}
      </div>
    );
  }

  private renderTeleView(): JSX.Element {
    const {match} = this.props;
    const redReusePollutants = (match.matchDetails as OceanOpportunitiesMatchDetails).redProcessingBargeReuse;
    const redRecyclePollutants = (match.matchDetails as OceanOpportunitiesMatchDetails).redProcessingBargeRecycle;
    const redRecoveryPollutants = (match.matchDetails as OceanOpportunitiesMatchDetails).redProcessingBargeRecovery;
    const redReductionPollutants = (match.matchDetails as OceanOpportunitiesMatchDetails).redReductionProcessing;

    const blueReusePollutants = (match.matchDetails as OceanOpportunitiesMatchDetails).blueProcessingBargeReuse;
    const blueRecyclePollutants = (match.matchDetails as OceanOpportunitiesMatchDetails).blueProcessingBargeRecycle;
    const blueRecoveryPollutants = (match.matchDetails as OceanOpportunitiesMatchDetails).blueProcessingBargeRecovery;
    const blueReductionPollutants = (match.matchDetails as OceanOpportunitiesMatchDetails).blueReductionProcessing;

    const maxPollutants = match.tournamentLevel > 1 ? OceanOpportunitiesMatchDetails.MAX_POLLUTANTS_PLAYOFFS : OceanOpportunitiesMatchDetails.MAX_POLLUTANTS;
    const redPollutants = redReusePollutants + redRecyclePollutants + redRecoveryPollutants + redReductionPollutants;
    const bluePollutants = blueReusePollutants + blueRecyclePollutants + blueRecoveryPollutants + blueReductionPollutants;
    const totalPollutants = redPollutants + bluePollutants;
    const remainingPollutants = maxPollutants - totalPollutants;
    return (
      <div>
        <Row>
          <Col sm={6}>
            <RobotNumberInput value={blueReusePollutants} image={"https://via.placeholder.com/150"} min={0} max={maxPollutants} onChange={this.changeProcessingBargeReuse}/>
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <RobotNumberInput value={blueRecyclePollutants} image={"https://via.placeholder.com/150"} min={0} max={maxPollutants} onChange={this.changeProcessingBargeRecycle}/>
          </Col>
          <Col sm={6}>
            <div>
              TOTAL POLLUTANTS: {totalPollutants}
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <RobotNumberInput value={blueRecoveryPollutants} image={"https://via.placeholder.com/150"} min={0} max={maxPollutants} onChange={this.changeProcessingBargeRecovery}/>
          </Col>
          <Col sm={6}>
            <div>
              REMAINING POLLUTANTS: {remainingPollutants}
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <RobotNumberInput value={blueReductionPollutants} image={"https://via.placeholder.com/150"} min={0} max={maxPollutants} onChange={this.changeReductionProcessing}/>
          </Col>
        </Row>
      </div>
    );
  }

  private renderEndView(): JSX.Element {
    const {match} = this.props;
    const robotOneDocking = (match.matchDetails as OceanOpportunitiesMatchDetails).blueEndRobotOneDocking;
    const robotTwoDocking = (match.matchDetails as OceanOpportunitiesMatchDetails).blueEndRobotTwoDocking;
    const robotThreeDocking = (match.matchDetails as OceanOpportunitiesMatchDetails).blueEndRobotThreeDocking;
    const redParticipants: MatchParticipant[] = match.participants.length > 0 ? match.participants.filter((p: MatchParticipant) => p.station >= 20) : [];

    return (
      <div>
        <Row>
          <Col sm={6}>
            <RobotButtonGroup value={robotOneDocking} participant={redParticipants[0]} states={["None", "Partial", "Full", "Elevated"]} onChange={this.changeRobotOneDocking}/>
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <RobotButtonGroup value={robotTwoDocking} participant={redParticipants[1]} states={["None", "Partial", "Full", "Elevated"]} onChange={this.changeRobotTwoDocking}/>
          </Col>
        </Row>
        <Row>
          <Col sm={6}>
            <RobotButtonGroup value={robotThreeDocking} participant={redParticipants[2]} states={["None", "Partial", "Full", "Elevated"]} onChange={this.changeRobotThreeDocking}/>
          </Col>
        </Row>
      </div>
    );
  }

  private renderPenaltyView(): JSX.Element {
    const {match} = this.props;
    const minorPenalties = match.blueMinPen || 0;
    const redParticipants: MatchParticipant[] = match.participants.length > 0 ? match.participants.filter((p: MatchParticipant) => p.station >= 20) : [];

    const participantCards = redParticipants.map((p: MatchParticipant) => {
      return (
        <Col key={p.matchParticipantKey} sm={6}>
          <RobotCardStatus participant={p} onUpdate={this.updateRobotCard}/>
        </Col>
      );
    });
    return (
      <div>
        <Row>
          {participantCards}
        </Row>
        <Row>
          <Col sm={6}>
            <RobotPenaltyInput value={minorPenalties} label={"Minor Penalties"} min={0} max={255} onChange={this.changeMinorPenalties}/>
          </Col>
        </Row>
      </div>
    );
  }

  private changeModeTab(index: number) {
    this.setState({currentMode: index});
  }

  private changeProcessingBargeReuse(n: number) {
    const details: OceanOpportunitiesMatchDetails = this.props.match.matchDetails as OceanOpportunitiesMatchDetails;
    details.blueProcessingBargeReuse += n;
    this.checkForCoopertition();
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeProcessingBargeRecycle(n: number) {
    const details: OceanOpportunitiesMatchDetails = this.props.match.matchDetails as OceanOpportunitiesMatchDetails;
    details.blueProcessingBargeRecycle += n;
    this.checkForCoopertition();
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeProcessingBargeRecovery(n: number) {
    const details: OceanOpportunitiesMatchDetails = this.props.match.matchDetails as OceanOpportunitiesMatchDetails;
    details.blueProcessingBargeRecovery += n;
    this.checkForCoopertition();
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeReductionProcessing(n: number) {
    const details: OceanOpportunitiesMatchDetails = this.props.match.matchDetails as OceanOpportunitiesMatchDetails;
    details.blueReductionProcessing += n;
    this.checkForCoopertition();
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeRobotOneDocking(state: number) {
    const details: OceanOpportunitiesMatchDetails = this.props.match.matchDetails as OceanOpportunitiesMatchDetails;
    details.blueEndRobotOneDocking = state;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeRobotTwoDocking(state: number) {
    const details: OceanOpportunitiesMatchDetails = this.props.match.matchDetails as OceanOpportunitiesMatchDetails;
    details.blueEndRobotTwoDocking = state;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeRobotThreeDocking(state: number) {
    const details: OceanOpportunitiesMatchDetails = this.props.match.matchDetails as OceanOpportunitiesMatchDetails;
    details.blueEndRobotThreeDocking = state;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeMinorPenalties(n: number) {
    this.props.match.blueMinPen += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private checkForCoopertition() {
    const {match} = this.props;
    const redReusePollutants = (match.matchDetails as OceanOpportunitiesMatchDetails).redProcessingBargeReuse;
    const redRecyclePollutants = (match.matchDetails as OceanOpportunitiesMatchDetails).redProcessingBargeRecycle;
    const redRecoveryPollutants = (match.matchDetails as OceanOpportunitiesMatchDetails).redProcessingBargeRecovery;
    const redReductionPollutants = (match.matchDetails as OceanOpportunitiesMatchDetails).redReductionProcessing;

    const blueReusePollutants = (match.matchDetails as OceanOpportunitiesMatchDetails).blueProcessingBargeReuse;
    const blueRecyclePollutants = (match.matchDetails as OceanOpportunitiesMatchDetails).blueProcessingBargeRecycle;
    const blueRecoveryPollutants = (match.matchDetails as OceanOpportunitiesMatchDetails).blueProcessingBargeRecovery;
    const blueReductionPollutants = (match.matchDetails as OceanOpportunitiesMatchDetails).blueReductionProcessing;

    const maxPollutants = match.tournamentLevel > 1 ? OceanOpportunitiesMatchDetails.MAX_POLLUTANTS_PLAYOFFS : OceanOpportunitiesMatchDetails.MAX_POLLUTANTS;
    const redPollutants = redReusePollutants + redRecyclePollutants + redRecoveryPollutants + redReductionPollutants;
    const bluePollutants = blueReusePollutants + blueRecyclePollutants + blueRecoveryPollutants + blueReductionPollutants;
    const totalPollutants = redPollutants + bluePollutants;

    const remainingPollutants = maxPollutants - totalPollutants;

    (match.matchDetails as OceanOpportunitiesMatchDetails).coopertitionBonus = remainingPollutants === 0;
  }

  private updateRobotCard(participant: MatchParticipant, cardStatus: number) {
    const participants: MatchParticipant[] = this.props.match.participants.filter((p: MatchParticipant) => p.matchParticipantKey === participant.matchParticipantKey);
    let pIndex: number = 0;
    if (participants.length > 0) {
      pIndex = this.props.match.participants.indexOf(participants[0]);
      const prevState = this.props.match.participants[pIndex].cardStatus;
      this.props.match.participants[pIndex].cardStatus = cardStatus;
      if (cardStatus === 1) {
        this.changeMinorPenalties(1);
      } else if (cardStatus !== 1 && prevState === 1) {
        this.changeMinorPenalties(-1);
      } else {
        this.sendUpdatedScore();
      }
    } else {
      // Do Nothing
    }
  }

  private sendUpdatedScore() {
    const {match} = this.props;
    const matchJSON: any = match.toJSON();
    matchJSON.details = match.matchDetails.toJSON();
    matchJSON.participants = match.participants.map((p: MatchParticipant) => p.toJSON());
    SocketProvider.emit("score-update", matchJSON);
    this.forceUpdate();
  }
}

export default BlueAllianceView;