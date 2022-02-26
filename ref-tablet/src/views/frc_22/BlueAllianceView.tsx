import * as React from "react";
import {Event, RapidReactMatchDetails, Match} from "@the-orange-alliance/lib-ems";
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

    this.changeAutoLowCargo = this.changeAutoLowCargo.bind(this);
    this.changeAutoHighCargo = this.changeAutoHighCargo.bind(this);
    this.changeRobotOneAuto = this.changeRobotOneAuto.bind(this);
    this.changeRobotTwoAuto = this.changeRobotTwoAuto.bind(this);
    this.changeRobotThreeAuto = this.changeRobotThreeAuto.bind(this);

    this.changeTeleLowCargo = this.changeTeleLowCargo.bind(this);
    this.changeTeleHighCargo = this.changeTeleHighCargo.bind(this);

    this.updateHangarBonus = this.updateHangarBonus.bind(this);
    this.updateCargoBonus = this.updateCargoBonus.bind(this);
    this.changeRobotOneEnd = this.changeRobotOneEnd.bind(this);
    this.changeRobotTwoEnd = this.changeRobotTwoEnd.bind(this);
    this.changeRobotThreeEnd = this.changeRobotThreeEnd.bind(this);
    
    this.changeMinorPenalties = this.changeMinorPenalties.bind(this);
    this.changeMajorPenalties = this.changeMajorPenalties.bind(this);
    this.updateRobotCard = this.updateRobotCard.bind(this);
  }

  public componentWillMount() {
    if (typeof this.props.match.matchDetails === "undefined") {
      this.props.match.matchDetails = new RapidReactMatchDetails();
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
    const details: RapidReactMatchDetails = match.matchDetails as RapidReactMatchDetails;
    const blueParticipants: MatchParticipant[] = match.participants.length > 0 ? match.participants.filter((p: MatchParticipant) => p.station >= 20) : [];
    const robotAutoLineViews = blueParticipants.map((p: MatchParticipant, index: number) => {
      let crossed: boolean;
      let action: (state: number) => void;
      switch (index) {
        case 0:
          crossed = details.blueAutoTaxiRobot1;
          action = this.changeRobotOneAuto;
          break;
        case 1:
          crossed = details.blueAutoTaxiRobot2;
          action = this.changeRobotTwoAuto;
          break;
        case 2:
          crossed = details.blueAutoTaxiRobot3;
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
          states={["Not Taxied", "Taxied"]}
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
                <RobotNumberInput value={details.blueAutoCargoLow} min={0} max={20} verticalButtons={false} verticalLabel={true} label={"Low Cargo (2 pts)"} onChange={this.changeAutoLowCargo}/>
              </Col>
              <Col sm={12}>
                <RobotNumberInput value={details.blueAutoCargoHigh} min={0} max={20} verticalButtons={false} verticalLabel={true} label={"High Cargo (4 pts)"} onChange={this.changeAutoHighCargo}/>
              </Col>
            </Row>
          </Col>
          <Col sm={6}>
            <Row>
              <Col sm={12}>
                <h1 className={'text-center mb-0 pb-0'}>Taxi Status</h1>
                <h6 className={'text-center'}>
                  each ROBOT whose BUMPERS have completely left the
                  TARMAC from which it started at any point during AUTO
                </h6>
                {robotAutoLineViews}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }

  private renderTeleView(): JSX.Element {
    const {match} = this.props;
    const details: RapidReactMatchDetails = match.matchDetails as RapidReactMatchDetails;

    return (
      <div>
        <Row>
          <Col sm={6}>
            <Row>
              <Col sm={12}>
                <RobotNumberInput value={details.blueTeleCargoLow} min={0} max={100} verticalButtons={false} verticalLabel={true} label={"Low Cargo (1 pts)"} onChange={this.changeTeleLowCargo}/>
              </Col>
              <Col sm={12}>
                <RobotNumberInput value={details.blueTeleCargoHigh} min={0} max={100} verticalButtons={false} verticalLabel={true} label={"High Cargo (2 pts)"} onChange={this.changeTeleHighCargo}/>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }

  private renderEndView(): JSX.Element {
    const {match} = this.props;
    const details: RapidReactMatchDetails = match.matchDetails as RapidReactMatchDetails;
    const blueParticipants: MatchParticipant[] = match.participants.length > 0 ? match.participants.filter((p: MatchParticipant) => p.station >= 20) : [];
    const robotAutoLineViews = blueParticipants.map((p: MatchParticipant, index: number) => {
      let hangValue: number;
      let action: (state: number) => void;
      switch (index) {
        case 0:
          hangValue = details.blueHangerRobot1;
          action = this.changeRobotOneEnd;
          break;
        case 1:
          hangValue = details.blueHangerRobot2;
          action = this.changeRobotTwoEnd;
          break;
        case 2:
          hangValue = details.blueHangerRobot3;
          action = this.changeRobotThreeEnd;
          break;
        default:
          hangValue = 0;
          action = () => {return;};
      }
      return (
        <RobotButtonGroup
          key={p.matchParticipantKey}
          value={this.endScoreToState(hangValue)}
          participant={p}
          states={["None", "Low Rung", "Mid Rung", "High Rung", "Traversal Rung"]}
          onChange={action}
        />
      );
    });
    return (
      <div>
        <Row>
          <Col lg={6} md={12}>
            <Row>
              <Col sm={12}>
                {robotAutoLineViews}
              </Col>
            </Row>
          </Col>
          <Col lg={6} md={12}>
            <Row>
              <Col sm={12}>
                <RobotButtonGroup value={details.blueHangarBonus ? 1 : 0} label={"Hangar Bonus"} states={["None", "Achieved"]} onChange={this.updateHangarBonus}/>
                <h6 className={'text-center'}>
                  ALLIANCE is credited with at least 16 HANGAR points
                </h6>
              </Col>
              <Col sm={12}>
                <RobotButtonGroup value={details.blueCargoBonus ? 1 : 0} label={"Cargo Bonus"} states={["None", "Achieved"]} onChange={this.updateCargoBonus}/>
                <h6 className={'text-center'}>
                  20 or more ALLIANCE colored CARGO scored in the HUB.
                  If at least 5 ALLIANCE colored CARGO are scored in
                  AUTO, called a QUINTET, this threshold drops to 18.
                </h6>
              </Col>
            </Row>
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

  private changeAutoLowCargo(n: number) {
    const {match} = this.props;
    const details: RapidReactMatchDetails = match.matchDetails as RapidReactMatchDetails;
    details.blueAutoCargoLow += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeAutoHighCargo(n: number) {
    const {match} = this.props;
    const details: RapidReactMatchDetails = match.matchDetails as RapidReactMatchDetails;
    details.blueAutoCargoHigh += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeRobotOneAuto(state: number) {
    const {match} = this.props;
    const details: RapidReactMatchDetails = match.matchDetails as RapidReactMatchDetails;
    details.blueAutoTaxiRobot1 = state === 1;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeRobotTwoAuto(state: number) {
    const {match} = this.props;
    const details: RapidReactMatchDetails = match.matchDetails as RapidReactMatchDetails;
    details.blueAutoTaxiRobot2 = state === 1;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeRobotThreeAuto(state: number) {
    const {match} = this.props;
    const details: RapidReactMatchDetails = match.matchDetails as RapidReactMatchDetails;
    details.blueAutoTaxiRobot3 = state === 1;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeTeleLowCargo(n: number) {
    const {match} = this.props;
    const details: RapidReactMatchDetails = match.matchDetails as RapidReactMatchDetails;
    details.blueTeleCargoLow += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeTeleHighCargo(n: number) {
    const {match} = this.props;
    const details: RapidReactMatchDetails = match.matchDetails as RapidReactMatchDetails;
    details.blueTeleCargoHigh += n;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private updateHangarBonus(state: number) {
    const {match} = this.props;
    const details: RapidReactMatchDetails = match.matchDetails as RapidReactMatchDetails;
    details.blueHangarBonus = state === 1;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private updateCargoBonus(state: number) {
    const {match} = this.props;
    const details: RapidReactMatchDetails = match.matchDetails as RapidReactMatchDetails;
    details.blueCargoBonus = state === 1;
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private endStateToScore(state: number): number {
    return (state === 0) ? 0 : (state === 1) ? 4 : (state === 2) ? 6 : (state === 3) ? 10 : (state === 4) ? 15 : 0;
  }

  private endScoreToState(score: number): number {
    return (score === 0) ? 0 : (score === 4) ? 1 : (score === 6) ? 2 : (score === 10) ? 3 : (score === 15) ? 4 : 0;
  }

  private changeRobotOneEnd(state: number) {
    const {match} = this.props;
    const details: RapidReactMatchDetails = match.matchDetails as RapidReactMatchDetails;
    details.blueHangerRobot1 = this.endStateToScore(state);
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeRobotTwoEnd(state: number) {
    const {match} = this.props;
    const details: RapidReactMatchDetails = match.matchDetails as RapidReactMatchDetails;
    details.blueHangerRobot2 = this.endStateToScore(state);
    this.forceUpdate();
    this.sendUpdatedScore();
  }

  private changeRobotThreeEnd(state: number) {
    const {match} = this.props;
    const details: RapidReactMatchDetails = match.matchDetails as RapidReactMatchDetails;
    details.blueHangerRobot3 = this.endStateToScore(state);
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