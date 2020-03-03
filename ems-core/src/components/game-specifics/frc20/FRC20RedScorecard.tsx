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
  InfiniteRechargeMatchDetails,
  Match,
  MatchDetails,
  MatchParticipant,
  MatchState
} from "@the-orange-alliance/lib-ems";
import FRC20TeamStatus from "./FRC20TeamStatus";

interface IProps {
  match?: Match,
  details?: InfiniteRechargeMatchDetails,
  matchParticipants?: MatchParticipant[]
  matchState?: MatchState,
  setActiveMatch?: (match: Match) => ISetActiveMatch,
  setActiveDetails?: (details: MatchDetails) => ISetActiveDetails
}

class RoverRuckusRedScorecard extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.modifyRobotOneCrossed = this.modifyRobotOneCrossed.bind(this);
    this.modifyRobotTwoCrossed = this.modifyRobotTwoCrossed.bind(this);
    this.modifyRobotThreeCrossed = this.modifyRobotThreeCrossed.bind(this);
    this.modifyRobotOneEndgame = this.modifyRobotOneEndgame.bind(this);
    this.modifyRobotTwoEndgame = this.modifyRobotTwoEndgame.bind(this);
    this.modifyRobotThreeEndgame = this.modifyRobotThreeEndgame.bind(this);
    this.modifyAutoBottomCells = this.modifyAutoBottomCells.bind(this);
    this.modifyAutoOuterCells = this.modifyAutoOuterCells.bind(this);
    this.modifyAutoInnerCells = this.modifyAutoInnerCells.bind(this);
    this.modifyTeleBottomCells = this.modifyTeleBottomCells.bind(this);
    this.modifyTeleOuterCells = this.modifyTeleOuterCells.bind(this);
    this.modifyTeleInnerCells = this.modifyTeleInnerCells.bind(this);
    this.modifyRotationControl = this.modifyRotationControl.bind(this);
    this.modifyPositionControl = this.modifyPositionControl.bind(this);
    this.modifyStageOneCells = this.modifyStageOneCells.bind(this);
    this.modifyStageTwoCells = this.modifyStageTwoCells.bind(this);
    this.modifyStageThreeCells = this.modifyStageThreeCells.bind(this);
    this.modifyStage = this.modifyStage.bind(this);
    this.modifyBalanced = this.modifyBalanced.bind(this);
    this.modifyMajorPenalties = this.modifyMajorPenalties.bind(this);
    this.modifyMinorPenalties = this.modifyMinorPenalties.bind(this);
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
                  <Grid.Column><Form.Checkbox disabled={disabled} fluid={true} label="Auto Robot 1 Crossed" checked={details.redAutoRobotOneCrossed} onChange={this.modifyRobotOneCrossed}/></Grid.Column>
                  <Grid.Column><Form.Checkbox disabled={disabled} fluid={true} label="Auto Robot 3 Crossed" checked={details.redAutoRobotTwoCrossed} onChange={this.modifyRobotTwoCrossed}/></Grid.Column>
                  <Grid.Column><Form.Checkbox disabled={disabled} fluid={true} label="Auto Robot 2 Crossed" checked={details.redAutoRobotThreeCrossed} onChange={this.modifyRobotThreeCrossed}/></Grid.Column>
                </Grid.Row>
                <Grid.Row columns="equal" textAlign="center">
                  <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Auto Bottom Cells" value={details.redAutoBottomCells} onChange={this.modifyAutoBottomCells}/></Grid.Column>
                  <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Auto Outer Cells" value={details.redAutoOuterCells} onChange={this.modifyAutoOuterCells}/></Grid.Column>
                  <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Auto Inner Cells" value={details.redAutoInnerCells} onChange={this.modifyAutoInnerCells}/></Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
          </Card.Content>
          <Card.Content>
            <Form>
              <Grid className="details">
                <Grid.Row columns="equal" textAlign="center">
                  <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Tele Bottom Cells" value={details.redTeleBottomCells} onChange={this.modifyTeleBottomCells}/></Grid.Column>
                  <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Tele Outer Cells" value={details.redTeleOuterCells} onChange={this.modifyTeleOuterCells}/></Grid.Column>
                  <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Tele Inner Cells" value={details.redTeleInnerCells} onChange={this.modifyTeleInnerCells}/></Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
          </Card.Content>
          <Card.Content>
            <Form>
              <Grid className="details">
                <Grid.Row columns="equal" textAlign="center">
                  <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Stage 1 Cells" value={details.redStageOneCells} onChange={this.modifyStageOneCells}/></Grid.Column>
                  <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Stage 3 Cells" value={details.redStageTwoCells} onChange={this.modifyStageTwoCells}/></Grid.Column>
                  <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Stage 3 Cells" value={details.redStageThreeCells} onChange={this.modifyStageThreeCells}/></Grid.Column>
                </Grid.Row>
                <Grid.Row columns="equal" textAlign="center">
                  <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Stage" value={details.redStage} onChange={this.modifyStage}/></Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
          </Card.Content>
          <Card.Content>
            <Form>
              <Grid className="details">
                <Grid.Row columns="equal" textAlign="center">
                  <Grid.Column><Form.Checkbox disabled={disabled} fluid={true} label="Rotation Control" checked={details.redRotationControl} onChange={this.modifyRotationControl}/></Grid.Column>
                  <Grid.Column><Form.Checkbox disabled={disabled} fluid={true} label="Position Control" checked={details.redPositionControl} onChange={this.modifyPositionControl}/></Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
          </Card.Content>
          <Card.Content>
            <Form>
              <Grid className="details">
                <Grid.Row columns="equal" textAlign="center">
                  <Grid.Column><Form.Dropdown disabled={disabled} fluid={true} label="Robot 1 Endgame" value={details.redEndRobotOneStatus} options={DropdownData.InfiniteRechargeEndItems} onChange={this.modifyRobotOneEndgame}/></Grid.Column>
                  <Grid.Column><Form.Dropdown disabled={disabled} fluid={true} label="Robot 2 Endgame" value={details.redEndRobotTwoStatus} options={DropdownData.InfiniteRechargeEndItems} onChange={this.modifyRobotTwoEndgame}/></Grid.Column>
                  <Grid.Column><Form.Dropdown disabled={disabled} fluid={true} label="Robot 3 Endgame" value={details.redEndRobotThreeStatus} options={DropdownData.InfiniteRechargeEndItems} onChange={this.modifyRobotThreeEndgame}/></Grid.Column>
                </Grid.Row>
                <Grid.Row columns="equal" textAlign="center">
                  <Grid.Column><Form.Checkbox disabled={disabled} fluid={true} label="Balanced?" checked={details.redEndEqualized} onChange={this.modifyBalanced}/></Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
          </Card.Content>
          <Card.Content>
            <Form>
              <Grid className="details">
                <Grid.Row columns="equal" textAlign="center">
                  <Grid.Column><Form.Input disabled={disabled} fluid={true} label="Minor Penalties" value={match.redMinPen} onChange={this.modifyMinorPenalties}/></Grid.Column>
                  <Grid.Column><Form.Input disabled={disabled} fluid={true} label="Major Penalties" value={match.redMajPen} onChange={this.modifyMajorPenalties}/></Grid.Column>
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

  private getDetails(): InfiniteRechargeMatchDetails { // TODO - There is too much of this in the code... Maybe make some static methods inside of MatchDetails/Match?
    if (this.props.match === null || this.props.details === null || typeof this.props.details === "undefined") {
      return new InfiniteRechargeMatchDetails();
    } else {
      return this.props.details as InfiniteRechargeMatchDetails;
    }
  }

  private modifyRobotOneCrossed(event: SyntheticEvent, props: CheckboxProps) {
    (this.props.details as InfiniteRechargeMatchDetails).redAutoRobotOneCrossed = props.checked;
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
  }

  private modifyRobotTwoCrossed(event: SyntheticEvent, props: CheckboxProps) {
    (this.props.details as InfiniteRechargeMatchDetails).redAutoRobotTwoCrossed = props.checked;
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
  }

  private modifyRobotThreeCrossed(event: SyntheticEvent, props: CheckboxProps) {
    (this.props.details as InfiniteRechargeMatchDetails).redAutoRobotThreeCrossed = props.checked;
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
  }

  private modifyAutoBottomCells(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as InfiniteRechargeMatchDetails).redAutoBottomCells = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifyAutoOuterCells(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as InfiniteRechargeMatchDetails).redAutoOuterCells = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifyAutoInnerCells(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as InfiniteRechargeMatchDetails).redAutoInnerCells = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifyTeleBottomCells(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as InfiniteRechargeMatchDetails).redTeleBottomCells = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifyTeleOuterCells(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as InfiniteRechargeMatchDetails).redTeleOuterCells = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifyTeleInnerCells(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as InfiniteRechargeMatchDetails).redTeleInnerCells = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifyPositionControl(event: SyntheticEvent, props: CheckboxProps) {
    (this.props.details as InfiniteRechargeMatchDetails).redPositionControl = props.checked;
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
  }

  private modifyRotationControl(event: SyntheticEvent, props: CheckboxProps) {
    (this.props.details as InfiniteRechargeMatchDetails).redRotationControl = props.checked;
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
  }

  private modifyBalanced(event: SyntheticEvent, props: CheckboxProps) {
    (this.props.details as InfiniteRechargeMatchDetails).redEndEqualized = props.checked;
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
  }

  private modifyRobotOneEndgame(event: SyntheticEvent, props: DropdownProps) {
    (this.props.details as InfiniteRechargeMatchDetails).redEndRobotOneStatus = parseInt(props.value + "", 10);
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
  }

  private modifyRobotTwoEndgame(event: SyntheticEvent, props: DropdownProps) {
    (this.props.details as InfiniteRechargeMatchDetails).redEndRobotTwoStatus = parseInt(props.value + "", 10);
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
  }

  private modifyRobotThreeEndgame(event: SyntheticEvent, props: DropdownProps) {
    (this.props.details as InfiniteRechargeMatchDetails).redEndRobotThreeStatus = parseInt(props.value + "", 10);
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
  }

  private modifyStageOneCells(event: SyntheticEvent, props: DropdownProps) {
    (this.props.details as InfiniteRechargeMatchDetails).redStageOneCells = parseInt(props.value + "", 10);
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
  }

  private modifyStageTwoCells(event: SyntheticEvent, props: DropdownProps) {
    (this.props.details as InfiniteRechargeMatchDetails).redStageTwoCells = parseInt(props.value + "", 10);
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
  }

  private modifyStageThreeCells(event: SyntheticEvent, props: DropdownProps) {
    (this.props.details as InfiniteRechargeMatchDetails).redStageThreeCells = parseInt(props.value + "", 10);
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
  }

  private modifyStage(event: SyntheticEvent, props: DropdownProps) {
    (this.props.details as InfiniteRechargeMatchDetails).redStage = parseInt(props.value + "", 10);
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
  }

  private modifyMinorPenalties(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      this.props.match.redMinPen = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.props.setActiveDetails(new InfiniteRechargeMatchDetails().fromJSON(this.props.details.toJSON()));
      this.forceUpdate();
    }
  }

  private modifyMajorPenalties(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      this.props.match.redMajPen = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.props.setActiveDetails(new InfiniteRechargeMatchDetails().fromJSON(this.props.details.toJSON()));
      this.forceUpdate();
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
