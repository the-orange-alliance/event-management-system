import * as React from "react";
import {Event, InfiniteRechargeMatchDetails, Match} from "@the-orange-alliance/lib-ems";
import {Col, Nav, NavItem, NavLink, Row, Spinner} from "reactstrap";
import StatusBar from "../../components/StatusBar";
import RobotNumberInput from "../../components/RobotNumberInput";
import RobotButtonGroup from "../../components/RobotButtonGroup";
import MatchParticipant from "@the-orange-alliance/lib-ems/dist/models/ems/MatchParticipant";
import RobotCardStatus from "../../components/RobotCardStatus";
import RobotPenaltyInput from "../../components/RobotPenaltyInput";
import SocketProvider from "@the-orange-alliance/lib-ems/dist/providers/SocketProvider";

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
  public constructor(props: IProps) {
    super(props);
    this.state = {
      currentMode: 0
    };
    this.changeModeTab = this.changeModeTab.bind(this);
    this.changeAutoInnerCells = this.changeAutoInnerCells.bind(this);
    this.changeAutoOuterCells = this.changeAutoOuterCells.bind(this);
    this.changeAutoBottomCells = this.changeAutoBottomCells.bind(this);
    this.changeRobotOneAuto = this.changeRobotOneAuto.bind(this);
    this.changeRobotTwoAuto = this.changeRobotTwoAuto.bind(this);
    this.changeRobotThreeAuto = this.changeRobotThreeAuto.bind(this);
    this.changeTeleInnerCells = this.changeTeleInnerCells.bind(this);
    this.changeTeleOuterCells = this.changeTeleOuterCells.bind(this);
    this.changeTeleBottomCells = this.changeTeleBottomCells.bind(this);
    this.updateRotationControl = this.updateRotationControl.bind(this);
    this.updatePositionControl = this.updatePositionControl.bind(this);
    this.changeRobotOneEnd = this.changeRobotOneEnd.bind(this);
    this.changeRobotTwoEnd = this.changeRobotTwoEnd.bind(this);
    this.changeRobotThreeEnd = this.changeRobotThreeEnd.bind(this);
    this.changeEqualized = this.changeEqualized.bind(this);
    this.changeMinorPenalties = this.changeMinorPenalties.bind(this);
    this.changeMajorPenalties = this.changeMajorPenalties.bind(this);
    this.updateRobotCard = this.updateRobotCard.bind(this);
  }

  public componentWillMount() {
    if (typeof this.props.match.matchDetails === "undefined") {
      this.props.match.matchDetails = new InfiniteRechargeMatchDetails();
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
    }

    return (
      <div className={"alliance-view"}>
        <div className={"alliance-header blue-bg"}>Blue Alliance</div>
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
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    const blueParticipants: MatchParticipant[] = match.participants.length > 0 ? match.participants.filter((p: MatchParticipant) => p.station >= 20) : [];
    const robotAutoLineViews = blueParticipants.map((p: MatchParticipant, index: number) => {
      let crossed: boolean;
      let action: (state: number) => void;
      switch (index) {
        case 0:
          crossed = details.blueAutoRobotOneCrossed;
          action = this.changeRobotOneAuto;
          break;
        case 1:
          crossed = details.blueAutoRobotTwoCrossed;
          action = this.changeRobotTwoAuto;
          break;
        case 2:
          crossed = details.blueAutoRobotThreeCrossed;
          action = this.changeRobotThreeAuto;
          break;
        default:
          crossed = false;
          action = () => {return;};
      }
      return (
        <RobotButtonGroup
          key={p.matchParticipantKey}
          value={crossed ? 1 : 0}
          participant={p}
          states={["Not Crossed", "Crossed"]}
          onChange={action}
        />
      );
    });
    return (
      <div>
        <Row>
          <Col sm={6}>
            <Row>
              <Col sm={12}>
                <RobotNumberInput value={details.blueAutoInnerCells} min={0} max={20} verticalButtons={false} verticalLabel={true} label={"Inner Power Cells (6 pts)"} onChange={this.changeAutoInnerCells}/>
              </Col>
              <Col sm={12}>
                <RobotNumberInput value={details.blueAutoOuterCells} min={0} max={20} verticalButtons={false} verticalLabel={true} label={"Outer Power Cells (4 pts)"} onChange={this.changeAutoOuterCells}/>
              </Col>
              <Col sm={12}>
                <RobotNumberInput value={details.blueAutoBottomCells} min={0} max={20} verticalButtons={false} verticalLabel={true} label={"Bottom Power Cells (2 pts)"} onChange={this.changeAutoBottomCells}/>
              </Col>
            </Row>
          </Col>
          <Col sm={6}>
            <Row>
              <Col sm={12}>
                {robotAutoLineViews}
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col sm={12} className={"center-items"}>
            Blue Stage: {details.blueStage}
          </Col>
        </Row>
      </div>
    );
  }

  private renderTeleView(): JSX.Element {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;

    return (
      <div>
        <Row>
          <Col sm={6}>
            <Row>
              <Col sm={12}>
                <RobotNumberInput value={details.blueTeleInnerCells} min={0} max={100} verticalButtons={false} verticalLabel={true} label={"Inner Power Cells (3 pts)"} onChange={this.changeTeleInnerCells}/>
              </Col>
              <Col sm={12}>
                <RobotNumberInput value={details.blueTeleOuterCells} min={0} max={100} verticalButtons={false} verticalLabel={true} label={"Outer Power Cells (2 pts)"} onChange={this.changeTeleOuterCells}/>
              </Col>
              <Col sm={12}>
                <RobotNumberInput value={details.blueTeleBottomCells} min={0} max={100} verticalButtons={false} verticalLabel={true} label={"Bottom Power Cells (1 pts)"} onChange={this.changeTeleBottomCells}/>
              </Col>
            </Row>
          </Col>
          <Col sm={6}>
            <Row>
              <Col sm={12}>
                <RobotButtonGroup value={details.blueRotationControl ? 1 : 0} label={"Rotation Control"} states={["Not Done", "Completed"]} onChange={this.updateRotationControl}/>
              </Col>
              <Col sm={12}>
                <RobotButtonGroup value={details.bluePositionControl ? 1 : 0} label={"Position Control"} states={["Not Done", "Completed"]} onChange={this.updatePositionControl}/>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col sm={12} className={"center-items"}>
            Blue Stage: {details.blueStage}
          </Col>
        </Row>
      </div>
    );
  }

  private renderEndView(): JSX.Element {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    const blueParticipants: MatchParticipant[] = match.participants.length > 0 ? match.participants.filter((p: MatchParticipant) => p.station >= 20) : [];
    const robotAutoLineViews = blueParticipants.map((p: MatchParticipant, index: number) => {
      let hangValue: number;
      let action: (state: number) => void;
      switch (index) {
        case 0:
          hangValue = details.blueEndRobotOneStatus;
          action = this.changeRobotOneEnd;
          break;
        case 1:
          hangValue = details.blueEndRobotTwoStatus;
          action = this.changeRobotTwoEnd;
          break;
        case 2:
          hangValue = details.blueEndRobotThreeStatus;
          action = this.changeRobotThreeEnd;
          break;
        default:
          hangValue = 0;
          action = () => {return;};
      }
      return (
        <RobotButtonGroup
          key={p.matchParticipantKey}
          value={hangValue}
          participant={p}
          states={["None", "Parked", "Hanging"]}
          onChange={action}
        />
      );
    });
    return (
      <div>
        <Row>
          <Col sm={6}>
            <Row>
              <Col sm={12}>
                <RobotButtonGroup value={details.blueEndEqualized ? 1 : 0} label={"Equalized"} states={["Un-Equalized", "Equalized"]} onChange={this.changeEqualized}/>
              </Col>
            </Row>
          </Col>
          <Col sm={6}>
            <Row>
              <Col sm={12}>
                {robotAutoLineViews}
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col sm={12} className={"center-items"}>
            Blue Stage: {details.blueStage}
          </Col>
        </Row>
      </div>
    );
  }

  private renderPenaltyView(): JSX.Element {
    const {match} = this.props;
    const minorPenalties = match.blueMinPen || 0;
    const majorPenalties = match.blueMajPen || 0;
    const blueParticipants: MatchParticipant[] = match.participants.length > 0 ? match.participants.filter((p: MatchParticipant) => p.station >= 20) : [];

    const participantCards = blueParticipants.map((p: MatchParticipant) => {
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
            <RobotPenaltyInput value={minorPenalties} label={"Fouls"} min={0} max={255} onChange={this.changeMinorPenalties}/>
          </Col>
          <Col sm={6}>
            <RobotPenaltyInput value={majorPenalties} label={"Tech Fouls"} min={0} max={255} onChange={this.changeMajorPenalties}/>
          </Col>
        </Row>
      </div>
    );
  }

  private changeModeTab(index: number) {
    this.setState({currentMode: index});
  }

  private changeAutoInnerCells(n: number) {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    details.blueAutoInnerCells += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeAutoOuterCells(n: number) {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    details.blueAutoOuterCells += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeAutoBottomCells(n: number) {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    details.blueAutoBottomCells += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeRobotOneAuto(state: number) {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    details.blueAutoRobotOneCrossed = state === 1;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeRobotTwoAuto(state: number) {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    details.blueAutoRobotTwoCrossed = state === 1;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeRobotThreeAuto(state: number) {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    details.blueAutoRobotThreeCrossed = state === 1;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeTeleInnerCells(n: number) {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    details.blueTeleInnerCells += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeTeleOuterCells(n: number) {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    details.blueTeleOuterCells += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeTeleBottomCells(n: number) {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    details.blueTeleBottomCells += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private updateRotationControl(state: number) {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    details.blueRotationControl = state === 1;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private updatePositionControl(state: number) {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    details.bluePositionControl = state === 1;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeRobotOneEnd(state: number) {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    details.blueEndRobotOneStatus = state;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeRobotTwoEnd(state: number) {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    details.blueEndRobotTwoStatus = state;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeRobotThreeEnd(state: number) {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    details.blueEndRobotThreeStatus = state;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeEqualized(state: number) {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    details.blueEndEqualized = state === 1;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeMinorPenalties(n: number) {
    this.props.match.blueMinPen += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeMajorPenalties(n: number) {
    this.props.match.blueMajPen += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private updateRobotCard(participant: MatchParticipant, cardStatus: number) {
    const participants: MatchParticipant[] = this.props.match.participants.filter((p: MatchParticipant) => p.matchParticipantKey === participant.matchParticipantKey);
    let pIndex: number = 0;
    if (participants.length > 0) {
      pIndex = this.props.match.participants.indexOf(participants[0]);
      this.props.match.participants[pIndex].cardStatus = cardStatus;
      this.sendUpdatedScore();
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