import * as React from "react";
import {Card, CheckboxProps, DropdownProps, Form, Grid, InputProps} from "semantic-ui-react";
import {ApplicationActions, IApplicationState} from "../../../stores";
import {connect} from "react-redux";
import {ISetActiveDetails, ISetActiveMatch} from "../../../stores/scoring/types";
import {Dispatch} from "redux";
import {setActiveDetails, setActiveMatch} from "../../../stores/scoring/actions";
import {SyntheticEvent} from "react";
import {
  DropdownData,
  InfiniteRechargeMatchDetails,
  Match,
  MatchDetails,
  MatchParticipant,
  MatchState, RoverRuckusMatchDetails
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

class FRC20BlueScorecard extends React.Component<IProps> {
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
      <Card fluid={true} className="scorecard blue-bg">
        <Card.Content className="center-items card-header"><Card.Header>Blue Alliance Scorecard</Card.Header></Card.Content>
        <Card.Content>
          <FRC20TeamStatus alliance={"Blue"} />
        </Card.Content>
        <Card.Content>
          <Form>
            <Grid className="details">
              <Grid.Row columns="equal" textAlign="center">
                <Grid.Column><Form.Checkbox disabled={disabled} fluid={true} label="Auto Robot 1 Crossed" checked={details.blueAutoRobotOneCrossed} onChange={this.modifyRobotOneCrossed}/></Grid.Column>
                <Grid.Column><Form.Checkbox disabled={disabled} fluid={true} label="Auto Robot 2 Crossed" checked={details.blueAutoRobotTwoCrossed} onChange={this.modifyRobotTwoCrossed}/></Grid.Column>
                <Grid.Column><Form.Checkbox disabled={disabled} fluid={true} label="Auto Robot 3 Crossed" checked={details.blueAutoRobotThreeCrossed} onChange={this.modifyRobotThreeCrossed}/></Grid.Column>
              </Grid.Row>
              <Grid.Row columns="equal" textAlign="center">
                <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Auto Bottom Cells" value={details.blueAutoBottomCells} onChange={this.modifyAutoBottomCells}/></Grid.Column>
                <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Auto Outer Cells" value={details.blueAutoOuterCells} onChange={this.modifyAutoOuterCells}/></Grid.Column>
                <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Auto Inner Cells" value={details.blueAutoInnerCells} onChange={this.modifyAutoInnerCells}/></Grid.Column>
              </Grid.Row>
            </Grid>
          </Form>
        </Card.Content>
        <Card.Content>
          <Form>
            <Grid className="details">
              <Grid.Row columns="equal" textAlign="center">
                <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Tele Bottom Cells" value={details.blueTeleBottomCells} onChange={this.modifyTeleBottomCells}/></Grid.Column>
                <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Tele Outer Cells" value={details.blueTeleOuterCells} onChange={this.modifyTeleOuterCells}/></Grid.Column>
                <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Tele Inner Cells" value={details.blueTeleInnerCells} onChange={this.modifyTeleInnerCells}/></Grid.Column>
              </Grid.Row>
            </Grid>
          </Form>
        </Card.Content>
        <Card.Content>
          <Form>
            <Grid className="details">
              <Grid.Row columns="equal" textAlign="center">
                <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Stage 1 Cells" value={details.blueStageOneCells} onChange={this.modifyStageOneCells}/></Grid.Column>
                <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Stage 3 Cells" value={details.blueStageTwoCells} onChange={this.modifyStageTwoCells}/></Grid.Column>
                <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Stage 3 Cells" value={details.blueStageThreeCells} onChange={this.modifyStageThreeCells}/></Grid.Column>
              </Grid.Row>
              <Grid.Row columns="equal" textAlign="center">
                <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Stage" value={details.blueStage} onChange={this.modifyStage}/></Grid.Column>
              </Grid.Row>
            </Grid>
          </Form>
        </Card.Content>
        <Card.Content>
          <Form>
            <Grid className="details">
              <Grid.Row columns="equal" textAlign="center">
                <Grid.Column><Form.Checkbox disabled={disabled} fluid={true} label="Rotation Control" checked={details.blueRotationControl} onChange={this.modifyRotationControl}/></Grid.Column>
                <Grid.Column><Form.Checkbox disabled={disabled} fluid={true} label="Position Control" checked={details.bluePositionControl} onChange={this.modifyPositionControl}/></Grid.Column>
              </Grid.Row>
            </Grid>
          </Form>
        </Card.Content>
        <Card.Content>
          <Form>
            <Grid className="details">
              <Grid.Row columns="equal" textAlign="center">
                <Grid.Column><Form.Dropdown disabled={disabled} fluid={true} label="Robot 1 Endgame" value={details.blueEndRobotOneStatus} options={DropdownData.InfiniteRechargeEndItems} onChange={this.modifyRobotOneEndgame}/></Grid.Column>
                <Grid.Column><Form.Dropdown disabled={disabled} fluid={true} label="Robot 2 Endgame" value={details.blueEndRobotTwoStatus} options={DropdownData.InfiniteRechargeEndItems} onChange={this.modifyRobotTwoEndgame}/></Grid.Column>
                <Grid.Column><Form.Dropdown disabled={disabled} fluid={true} label="Robot 3 Endgame" value={details.blueEndRobotThreeStatus} options={DropdownData.InfiniteRechargeEndItems} onChange={this.modifyRobotThreeEndgame}/></Grid.Column>
              </Grid.Row>
              <Grid.Row columns="equal" textAlign="center">
                <Grid.Column><Form.Checkbox disabled={disabled} fluid={true} label="Balanced?" checked={details.blueEndEqualized} onChange={this.modifyBalanced}/></Grid.Column>
              </Grid.Row>
            </Grid>
          </Form>
        </Card.Content>
        <Card.Content>
          <Form>
            <Grid className="details">
              <Grid.Row columns="equal" textAlign="center">
                <Grid.Column><Form.Input disabled={disabled} fluid={true} label="Minor Penalties" value={match.blueMinPen} onChange={this.modifyMinorPenalties}/></Grid.Column>
                <Grid.Column><Form.Input disabled={disabled} fluid={true} label="Major Penalties" value={match.blueMajPen} onChange={this.modifyMajorPenalties}/></Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>Score: {match.blueScore}</Grid.Column>
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
    (this.props.details as InfiniteRechargeMatchDetails).blueAutoRobotOneCrossed = props.checked;
    this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
    this.forceUpdate();
  }

  private modifyRobotTwoCrossed(event: SyntheticEvent, props: CheckboxProps) {
    (this.props.details as InfiniteRechargeMatchDetails).blueAutoRobotTwoCrossed = props.checked;
    this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
    this.forceUpdate();
  }

  private modifyRobotThreeCrossed(event: SyntheticEvent, props: CheckboxProps) {
    (this.props.details as InfiniteRechargeMatchDetails).blueAutoRobotThreeCrossed = props.checked;
    this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
    this.forceUpdate();
  }

  private modifyAutoBottomCells(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as InfiniteRechargeMatchDetails).blueAutoBottomCells = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.forceUpdate();
    }
  }

  private modifyAutoOuterCells(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as InfiniteRechargeMatchDetails).blueAutoOuterCells = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.forceUpdate();
    }
  }

  private modifyAutoInnerCells(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as InfiniteRechargeMatchDetails).blueAutoInnerCells = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.forceUpdate();
    }
  }

  private modifyTeleBottomCells(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as InfiniteRechargeMatchDetails).blueTeleBottomCells = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.forceUpdate();
    }
  }

  private modifyTeleOuterCells(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as InfiniteRechargeMatchDetails).blueTeleOuterCells = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.forceUpdate();
    }
  }

  private modifyTeleInnerCells(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as InfiniteRechargeMatchDetails).blueTeleInnerCells = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.forceUpdate();
    }
  }

  private modifyPositionControl(event: SyntheticEvent, props: CheckboxProps) {
    (this.props.details as InfiniteRechargeMatchDetails).bluePositionControl = props.checked;
    this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
    this.forceUpdate();
  }

  private modifyRotationControl(event: SyntheticEvent, props: CheckboxProps) {
    (this.props.details as InfiniteRechargeMatchDetails).blueRotationControl = props.checked;
    this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
    this.forceUpdate();
  }

  private modifyBalanced(event: SyntheticEvent, props: CheckboxProps) {
    (this.props.details as InfiniteRechargeMatchDetails).blueEndEqualized = props.checked;
    this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
    this.forceUpdate();
  }

  private modifyRobotOneEndgame(event: SyntheticEvent, props: DropdownProps) {
    (this.props.details as InfiniteRechargeMatchDetails).blueEndRobotOneStatus = parseInt(props.value + "", 10);
    this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
    this.forceUpdate();
  }

  private modifyRobotTwoEndgame(event: SyntheticEvent, props: DropdownProps) {
    (this.props.details as InfiniteRechargeMatchDetails).blueEndRobotTwoStatus = parseInt(props.value + "", 10);
    this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
    this.forceUpdate();
  }

  private modifyRobotThreeEndgame(event: SyntheticEvent, props: DropdownProps) {
    (this.props.details as InfiniteRechargeMatchDetails).blueEndRobotThreeStatus = parseInt(props.value + "", 10);
    this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
    this.forceUpdate();
  }

  private modifyStageOneCells(event: SyntheticEvent, props: DropdownProps) {
    (this.props.details as InfiniteRechargeMatchDetails).blueStageOneCells = parseInt(props.value + "", 10);
    this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
    this.forceUpdate();
  }

  private modifyStageTwoCells(event: SyntheticEvent, props: DropdownProps) {
    (this.props.details as InfiniteRechargeMatchDetails).blueStageTwoCells = parseInt(props.value + "", 10);
    this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
    this.forceUpdate();
  }

  private modifyStageThreeCells(event: SyntheticEvent, props: DropdownProps) {
    (this.props.details as InfiniteRechargeMatchDetails).blueStageThreeCells = parseInt(props.value + "", 10);
    this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
    this.forceUpdate();
  }

  private modifyStage(event: SyntheticEvent, props: DropdownProps) {
    (this.props.details as InfiniteRechargeMatchDetails).blueStage = parseInt(props.value + "", 10);
    this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
    this.forceUpdate();
  }

  private modifyMinorPenalties(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      this.props.match.blueMinPen = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.props.setActiveDetails(new RoverRuckusMatchDetails().fromJSON(this.props.details.toJSON()));
      this.forceUpdate();
    }
  }

  private modifyMajorPenalties(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      this.props.match.blueMajPen = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.props.setActiveDetails(new RoverRuckusMatchDetails().fromJSON(this.props.details.toJSON()));
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
    setActiveMatch: (match: Match) => dispatch(setActiveMatch(match)),
    setActiveDetails: (details: MatchDetails) => dispatch(setActiveDetails(details))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FRC20BlueScorecard as any);
