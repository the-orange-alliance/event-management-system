import * as React from "react";
import {Card, CheckboxProps, DropdownProps, Form, Grid, InputProps} from "semantic-ui-react";
import {ApplicationActions, IApplicationState} from "../../../stores";
import {connect} from "react-redux";
import {ISetActiveDetails, ISetActiveMatch} from "../../../stores/scoring/types";
import {Dispatch} from "redux";
import {setActiveDetails} from "../../../stores/scoring/actions";
import {SyntheticEvent} from "react";
import {
  DropdownData,
  RapidReactMatchDetails,
  Match,
  MatchDetails,
  MatchParticipant,
  MatchState, SocketProvider
} from "@the-orange-alliance/lib-ems";
import FRC20TeamStatus from "../frc20/FRC20TeamStatus";

interface IProps {
  match?: Match,
  details?: RapidReactMatchDetails,
  matchParticipants?: MatchParticipant[]
  matchState?: MatchState,
  setActiveMatch?: (match: Match) => ISetActiveMatch,
  setActiveDetails?: (details: MatchDetails) => ISetActiveDetails
}

class RoverRuckusRedScorecard extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.modifyRobotOneTaxi = this.modifyRobotOneTaxi.bind(this);
    this.modifyRobotTwoTaxi = this.modifyRobotTwoTaxi.bind(this);
    this.modifyRobotThreeTaxi = this.modifyRobotThreeTaxi.bind(this);
    this.modifyRobotOneEndgame = this.modifyRobotOneEndgame.bind(this);
    this.modifyRobotTwoEndgame = this.modifyRobotTwoEndgame.bind(this);
    this.modifyRobotThreeEndgame = this.modifyRobotThreeEndgame.bind(this);
    this.modifyAutoLowCargo = this.modifyAutoLowCargo.bind(this);
    this.modifyAutoHighCargo = this.modifyAutoHighCargo.bind(this);
    this.modifyTeleLowCargo = this.modifyTeleLowCargo.bind(this);
    this.modifyTeleHighCargo = this.modifyTeleHighCargo.bind(this);
    this.modifyHangarBonus = this.modifyHangarBonus.bind(this);
    this.modifyCargoBonus = this.modifyCargoBonus.bind(this);
    this.modifyMajorPenalties = this.modifyMajorPenalties.bind(this);
    this.modifyMinorPenalties = this.modifyMinorPenalties.bind(this);
  }

  private boolCheck(v: any): boolean {
    if(typeof v === 'boolean') return v;
    if(typeof v === 'string') return v.toLowerCase() === 'true';
    return v;
  }

  public render() {
    const match = this.props.match === null ? new Match() : this.props.match;
    const details = this.getDetails();
    const disabled = this.props.matchState === MatchState.MATCH_IN_PROGRESS || match === null || typeof match.matchDetails === "undefined";
    return (
        <Card fluid={true} className="scorecard red-bg">
          <Card.Content className="center-items card-header"><Card.Header>Red Alliance Scorecard</Card.Header></Card.Content>
          <Card.Content>
            <FRC20TeamStatus alliance={"Red"} />
          </Card.Content>
          <Card.Content>
            <Form>
              <Grid className="details">
                <Grid.Row columns="equal" textAlign="center">
                  <Grid.Column><Form.Checkbox disabled={disabled} fluid={true} label="Auto Robot 1 Taxied" checked={this.boolCheck(details.redAutoTaxiRobot1)} onChange={this.modifyRobotOneTaxi}/></Grid.Column>
                  <Grid.Column><Form.Checkbox disabled={disabled} fluid={true} label="Auto Robot 2 Taxied" checked={this.boolCheck(details.redAutoTaxiRobot2)} onChange={this.modifyRobotTwoTaxi}/></Grid.Column>
                  <Grid.Column><Form.Checkbox disabled={disabled} fluid={true} label="Auto Robot 3 Taxied" checked={this.boolCheck(details.redAutoTaxiRobot3)} onChange={this.modifyRobotThreeTaxi}/></Grid.Column>
                </Grid.Row>
                <Grid.Row columns="equal" textAlign="center">
                  <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Auto Low Cargo" value={details.redAutoCargoLow} onChange={this.modifyAutoLowCargo}/></Grid.Column>
                  <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Auto High Cargo" value={details.redAutoCargoHigh} onChange={this.modifyAutoHighCargo}/></Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
          </Card.Content>
          <Card.Content>
            <Form>
              <Grid className="details">
                <Grid.Row columns="equal" textAlign="center">
                  <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Tele Low Cargo" value={details.redTeleCargoLow} onChange={this.modifyTeleLowCargo}/></Grid.Column>
                  <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Tele High Cargo" value={details.redTeleCargoHigh} onChange={this.modifyTeleHighCargo}/></Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
          </Card.Content>
          <Card.Content>
            <Form>
              <Grid className="details">
                <Grid.Row columns="equal" textAlign="center">
                  <Grid.Column><Form.Checkbox disabled={disabled} fluid={true} label="Hangar Bonus?" checked={this.boolCheck(details.redHangarBonus)} onChange={this.modifyHangarBonus}/></Grid.Column>
                  <Grid.Column><Form.Checkbox disabled={disabled} fluid={true} label="Cargo Bonus?" checked={this.boolCheck(details.redCargoBonus)} onChange={this.modifyCargoBonus}/></Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
          </Card.Content>
          <Card.Content>
            <Form>
              <Grid className="details">
                <Grid.Row columns="equal" textAlign="center">
                  <Grid.Column><Form.Dropdown disabled={disabled} fluid={true} label="Robot 1 Endgame" value={details.redHangerRobot1} options={DropdownData.RapidReactEndItems} onChange={this.modifyRobotOneEndgame}/></Grid.Column>
                  <Grid.Column><Form.Dropdown disabled={disabled} fluid={true} label="Robot 2 Endgame" value={details.redHangerRobot2} options={DropdownData.RapidReactEndItems} onChange={this.modifyRobotTwoEndgame}/></Grid.Column>
                  <Grid.Column><Form.Dropdown disabled={disabled} fluid={true} label="Robot 3 Endgame" value={details.redHangerRobot3} options={DropdownData.RapidReactEndItems} onChange={this.modifyRobotThreeEndgame}/></Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
          </Card.Content>
          <Card.Content>
            <Form>
              <Grid className="details">
                <Grid.Row columns="equal" textAlign="center">
                  <Grid.Column><Form.Input disabled={disabled} fluid={true} label="Fouls (4pt)" value={match.redMinPen} onChange={this.modifyMinorPenalties}/></Grid.Column>
                  <Grid.Column><Form.Input disabled={disabled} fluid={true} label="Tech Fouls (8pt)" value={match.redMajPen} onChange={this.modifyMajorPenalties}/></Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>Score: {match.redScore}</Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
          </Card.Content>
        </Card>
    );
  }

  private sendScores() {
    const toSend = this.props.match.toJSON() as any;
    toSend.details = this.getDetails().toJSON();
    toSend.participants = this.props.match.participants.map((p: MatchParticipant) => p.toJSON());
    SocketProvider.emit('score-update', toSend);
  }

  private getDetails(): RapidReactMatchDetails { // TODO - There is too much of this in the code... Maybe make some static methods inside of MatchDetails/Match?
    if (this.props.match === null || this.props.details === null || typeof this.props.details === "undefined") {
      return new RapidReactMatchDetails();
    } else {
      return this.props.details as RapidReactMatchDetails;
    }
  }

  private modifyRobotOneTaxi(event: SyntheticEvent, props: CheckboxProps) {
    (this.props.details as RapidReactMatchDetails).redAutoTaxiRobot1 = props.checked;
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
    this.sendScores();
  }

  private modifyRobotTwoTaxi(event: SyntheticEvent, props: CheckboxProps) {
    (this.props.details as RapidReactMatchDetails).redAutoTaxiRobot2 = props.checked;
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
    this.sendScores();
  }

  private modifyRobotThreeTaxi(event: SyntheticEvent, props: CheckboxProps) {
    (this.props.details as RapidReactMatchDetails).redAutoTaxiRobot3 = props.checked;
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
    this.sendScores();
  }

  private modifyAutoLowCargo(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as RapidReactMatchDetails).redAutoCargoLow = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
      this.sendScores();
    }
  }

  private modifyAutoHighCargo(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as RapidReactMatchDetails).redAutoCargoHigh = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
      this.sendScores();
    }
  }

  private modifyTeleLowCargo(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as RapidReactMatchDetails).redTeleCargoLow = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
      this.sendScores();
    }
  }

  private modifyTeleHighCargo(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as RapidReactMatchDetails).redTeleCargoHigh = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
      this.sendScores();
    }
  }

  private modifyCargoBonus(event: SyntheticEvent, props: CheckboxProps) {
    (this.props.details as RapidReactMatchDetails).redCargoBonus = props.checked;
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
    this.sendScores();
  }

  private modifyHangarBonus(event: SyntheticEvent, props: CheckboxProps) {
    (this.props.details as RapidReactMatchDetails).redHangarBonus = props.checked;
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
    this.sendScores();
  }

  private modifyRobotOneEndgame(event: SyntheticEvent, props: DropdownProps) {
    (this.props.details as RapidReactMatchDetails).redHangerRobot1 = parseInt(props.value + "", 10);
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
    this.sendScores();
  }

  private modifyRobotTwoEndgame(event: SyntheticEvent, props: DropdownProps) {
    (this.props.details as RapidReactMatchDetails).redHangerRobot2 = parseInt(props.value + "", 10);
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
    this.sendScores();
  }

  private modifyRobotThreeEndgame(event: SyntheticEvent, props: DropdownProps) {
    (this.props.details as RapidReactMatchDetails).redHangerRobot3 = parseInt(props.value + "", 10);
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
    this.sendScores();
  }

  private modifyMinorPenalties(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      this.props.match.redMinPen = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.props.setActiveDetails(new RapidReactMatchDetails().fromJSON(this.props.details.toJSON()));
      this.forceUpdate();
      this.sendScores();
    }
  }

  private modifyMajorPenalties(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      this.props.match.redMajPen = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.props.setActiveDetails(new RapidReactMatchDetails().fromJSON(this.props.details.toJSON()));
      this.forceUpdate();
      this.sendScores();
    }
  }
}

export function mapStateToProps({scoringState}: IApplicationState) {
  return {
    match: scoringState.activeMatch,
    details: scoringState.activeDetails,
    matchParticipants: scoringState.activeParticipants,
    matchState: scoringState.matchState
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setActiveDetails: (details: MatchDetails) => dispatch(setActiveDetails(details))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RoverRuckusRedScorecard as any);
