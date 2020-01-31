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

class RedAllianceView extends React.Component<IProps, IState> {
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
        <div className={"alliance-header red-bg"}>Red Alliance</div>
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
    const redParticipants: MatchParticipant[] = match.participants.length > 0 ? match.participants.filter((p: MatchParticipant) => p.station < 20) : [];
    const robotAutoLineViews = redParticipants.map((p: MatchParticipant, index: number) => {
      let crossed: boolean;
      let action: (state: number) => void;
      switch (index) {
        case 0:
          crossed = details.redAutoRobotOneCrossed;
          action = this.changeRobotOneAuto;
          break;
        case 1:
          crossed = details.redAutoRobotTwoCrossed;
          action = this.changeRobotTwoAuto;
          break;
        case 2:
          crossed = details.redAutoRobotThreeCrossed;
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
                <RobotNumberInput value={details.redAutoInnerCells} min={0} max={20} verticalButtons={false} verticalLabel={true} label={"Inner Power Cells (6 pts)"} onChange={this.changeAutoInnerCells}/>
              </Col>
              <Col sm={12}>
                <RobotNumberInput value={details.redAutoOuterCells} min={0} max={20} verticalButtons={false} verticalLabel={true} label={"Outer Power Cells (4 pts)"} onChange={this.changeAutoOuterCells}/>
              </Col>
              <Col sm={12}>
                <RobotNumberInput value={details.redAutoBottomCells} min={0} max={20} verticalButtons={false} verticalLabel={true} label={"Bottom Power Cells (2 pts)"} onChange={this.changeAutoBottomCells}/>
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
            Red Stage: {details.redStage}
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
                <RobotNumberInput value={details.redTeleInnerCells} min={0} max={100} verticalButtons={false} verticalLabel={true} label={"Inner Power Cells (3 pts)"} onChange={this.changeTeleInnerCells}/>
              </Col>
              <Col sm={12}>
                <RobotNumberInput value={details.redTeleOuterCells} min={0} max={100} verticalButtons={false} verticalLabel={true} label={"Outer Power Cells (2 pts)"} onChange={this.changeTeleOuterCells}/>
              </Col>
              <Col sm={12}>
                <RobotNumberInput value={details.redTeleBottomCells} min={0} max={100} verticalButtons={false} verticalLabel={true} label={"Bottom Power Cells (1 pts)"} onChange={this.changeTeleBottomCells}/>
              </Col>
            </Row>
          </Col>
          <Col sm={6}>
            <Row>
              <Col sm={12}>
                <RobotButtonGroup value={details.redRotationControl ? 1 : 0} label={"Rotation Control"} states={["Not Done", "Completed"]} onChange={this.updateRotationControl}/>
              </Col>
              <Col sm={12}>
                <RobotButtonGroup value={details.redPositionControl ? 1 : 0} label={"Position Control"} states={["Not Done", "Completed"]} onChange={this.updatePositionControl}/>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col sm={12} className={"center-items"}>
            Red Stage: {details.redStage}
          </Col>
        </Row>
      </div>
    );
  }

  private renderEndView(): JSX.Element {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    const redParticipants: MatchParticipant[] = match.participants.length > 0 ? match.participants.filter((p: MatchParticipant) => p.station < 20) : [];
    const robotAutoLineViews = redParticipants.map((p: MatchParticipant, index: number) => {
      let hangValue: number;
      let action: (state: number) => void;
      switch (index) {
        case 0:
          hangValue = details.redEndRobotOneStatus;
          action = this.changeRobotOneEnd;
          break;
        case 1:
          hangValue = details.redEndRobotTwoStatus;
          action = this.changeRobotTwoEnd;
          break;
        case 2:
          hangValue = details.redEndRobotThreeStatus;
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
                <RobotButtonGroup value={details.redEndEqualized ? 1 : 0} label={"Equalized"} states={["Un-Equalized", "Equalized"]} onChange={this.changeEqualized}/>
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
            Red Stage: {details.redStage}
          </Col>
        </Row>
      </div>
    );
  }

  private renderPenaltyView(): JSX.Element {
    const {match} = this.props;
    const minorPenalties = match.redMinPen || 0;
    const majorPenalties = match.redMajPen || 0;
    const redParticipants: MatchParticipant[] = match.participants.length > 0 ? match.participants.filter((p: MatchParticipant) => p.station < 20) : [];

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
    details.redAutoInnerCells += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeAutoOuterCells(n: number) {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    details.redAutoOuterCells += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeAutoBottomCells(n: number) {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    details.redAutoBottomCells += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeRobotOneAuto(state: number) {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    details.redAutoRobotOneCrossed = state === 1;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeRobotTwoAuto(state: number) {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    details.redAutoRobotTwoCrossed = state === 1;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeRobotThreeAuto(state: number) {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    details.redAutoRobotThreeCrossed = state === 1;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeTeleInnerCells(n: number) {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    details.redTeleInnerCells += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeTeleOuterCells(n: number) {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    details.redTeleOuterCells += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeTeleBottomCells(n: number) {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    details.redTeleBottomCells += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private updateRotationControl(state: number) {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    details.redRotationControl = state === 1;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private updatePositionControl(state: number) {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    details.redPositionControl = state === 1;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeRobotOneEnd(state: number) {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    details.redEndRobotOneStatus = state;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeRobotTwoEnd(state: number) {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    details.redEndRobotTwoStatus = state;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeRobotThreeEnd(state: number) {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    details.redEndRobotThreeStatus = state;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeEqualized(state: number) {
    const {match} = this.props;
    const details: InfiniteRechargeMatchDetails = match.matchDetails as InfiniteRechargeMatchDetails;
    details.redEndEqualized = state === 1;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeMinorPenalties(n: number) {
    this.props.match.redMinPen += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeMajorPenalties(n: number) {
    this.props.match.redMajPen += n;
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

export default RedAllianceView;