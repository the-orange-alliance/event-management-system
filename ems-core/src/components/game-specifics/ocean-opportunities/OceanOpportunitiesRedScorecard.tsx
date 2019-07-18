import * as React from "react";
import {Card, Dimmer, DropdownProps, Form, Grid, Loader} from "semantic-ui-react";
import OceanOpportunitiesTeamStatus from "./OceanOpportunitiesTeamStatus";
import {DropdownData, Match, MatchState} from "@the-orange-alliance/lib-ems";
import MatchDetails from "@the-orange-alliance/lib-ems/dist/models/ems/MatchDetails";
import {IApplicationState} from "../../../stores";
import {connect} from "react-redux";
import OceanOpportunitiesMatchDetails from "@the-orange-alliance/lib-ems/dist/models/ems/games/ocean-opportunities/OceanOpportunitiesMatchDetails";
import {SyntheticEvent} from "react";

interface IProps {
  match?: Match
  matchDetails?: MatchDetails,
  matchState?: MatchState,
  loading: boolean
}

class OceanOpportunitiesRedScorecard extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.changeRecoveryProcessing = this.changeRecoveryProcessing.bind(this);
    this.changeRecycleProcessing = this.changeRecycleProcessing.bind(this);
    this.changeReductionProcessing = this.changeReductionProcessing.bind(this);
    this.changeReuseProcessing = this.changeReuseProcessing.bind(this);
    this.changeRobotOneEndState = this.changeRobotOneEndState.bind(this);
    this.changeRobotTwoEndState = this.changeRobotTwoEndState.bind(this);
    this.changeRobotThreeEndState = this.changeRobotThreeEndState.bind(this);
    this.changeMinorPenalties = this.changeMinorPenalties.bind(this);
  }

  public render() {
    const {match, matchState, loading} = this.props;
    const disabled = matchState === MatchState.MATCH_IN_PROGRESS || match === null || typeof match.matchDetails === "undefined";

    return (
      <Card fluid={true} className="scorecard red-bg">
        <Dimmer active={loading}>
          <Loader/>
        </Dimmer>
        <Card.Content className="center-items card-header"><Card.Header>Red Alliance Scorecard</Card.Header></Card.Content>
        <Card.Content>
          <OceanOpportunitiesTeamStatus alliance={"Red"}/>
        </Card.Content>
        <Card.Content>
          {this.renderTeleView(disabled, loading)}
        </Card.Content>
        <Card.Content>
          {this.renderEndgameView(disabled, loading)}
        </Card.Content>
        <Card.Content>
          {this.renderPenaltyView(disabled, loading)}
        </Card.Content>
      </Card>
    );
  }

  private renderTeleView(disabled: boolean, loading: boolean): JSX.Element {
    if (!loading) {
      const {matchDetails} = this.props;
      const reuse: number = (matchDetails as OceanOpportunitiesMatchDetails).redProcessingBargeReuse;
      const recycle: number = (matchDetails as OceanOpportunitiesMatchDetails).redProcessingBargeRecycle;
      const recovery: number = (matchDetails as OceanOpportunitiesMatchDetails).redProcessingBargeRecovery;
      const reduction: number = (matchDetails as OceanOpportunitiesMatchDetails).redReductionProcessing;
      return (
        <Grid>
          <Grid.Row columns={16}>
            <Grid.Column width={4}>
              <Form.Input label={"Reuse"} disabled={disabled} fluid={true} value={reuse} onChange={this.changeReuseProcessing}/>
            </Grid.Column>
            <Grid.Column width={4}>
              <Form.Input label={"Recycle"} disabled={disabled} fluid={true} value={recycle} onChange={this.changeRecycleProcessing}/>
            </Grid.Column>
            <Grid.Column width={4}>
              <Form.Input label={"Recovery"} disabled={disabled} fluid={true} value={recovery} onChange={this.changeRecoveryProcessing}/>
            </Grid.Column>
            <Grid.Column width={4}>
              <Form.Input label={"Reduction"} disabled={disabled} fluid={true} value={reduction} onChange={this.changeReductionProcessing}/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    } else {
      return (<div/>);
    }
  }

  private renderEndgameView(disabled: boolean, loading: boolean): JSX.Element {
    if (!loading) {
      const {matchDetails} = this.props;
      const robotOne = (matchDetails as OceanOpportunitiesMatchDetails).redEndRobotOneDocking;
      const robotTwo = (matchDetails as OceanOpportunitiesMatchDetails).redEndRobotTwoDocking;
      const robotThree = (matchDetails as OceanOpportunitiesMatchDetails).redEndRobotThreeDocking;
      return (
        <Grid>
          <Grid.Row columns={3}>
            <Grid.Column>
              <Form.Dropdown label={"Robot 1"} disabled={disabled} fluid={true} selection={true} value={robotOne} options={DropdownData.OceanOpportunitiesEndItems} onChange={this.changeRobotOneEndState}/>
            </Grid.Column>
            <Grid.Column>
              <Form.Dropdown label={"Robot 2"} disabled={disabled} fluid={true} selection={true} value={robotTwo} options={DropdownData.OceanOpportunitiesEndItems} onChange={this.changeRobotTwoEndState}/>
            </Grid.Column>
            <Grid.Column>
              <Form.Dropdown label={"Robot 3"} disabled={disabled} fluid={true} selection={true} value={robotThree} options={DropdownData.OceanOpportunitiesEndItems} onChange={this.changeRobotThreeEndState}/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    } else {
      return (<div/>);
    }
  }

  private renderPenaltyView(disabled: boolean, loading: boolean): JSX.Element {
    if (!loading) {
      const {match} = this.props;
      const penalties = match.redMinPen;
      return (
        <Grid>
          <Grid.Row columns={3}>
            <Grid.Column>
              <Form.Input label={"Minor Penalties"} disabled={disabled} fluid={true} value={penalties} onChange={this.changeMinorPenalties}/>
            </Grid.Column>
            <Grid.Column><div/></Grid.Column>
            <Grid.Column className={"align-center"}>
              <span>SCORE: {match.redScore}</span>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    } else {
      return (<div/>);
    }
  }

  private changeReuseProcessing(event: SyntheticEvent, props: DropdownProps) {
    const {match, matchDetails} = this.props;
    const details: OceanOpportunitiesMatchDetails = (matchDetails as OceanOpportunitiesMatchDetails);
    details.redProcessingBargeReuse = parseInt(props.value as string, 10);
    match.redScore = details.getRedScore(match.blueMinPen, 0);
    this.forceUpdate();
  }

  private changeRecycleProcessing(event: SyntheticEvent, props: DropdownProps) {
    const {match, matchDetails} = this.props;
    const details: OceanOpportunitiesMatchDetails = (matchDetails as OceanOpportunitiesMatchDetails);
    details.redProcessingBargeRecycle = parseInt(props.value as string, 10);
    match.redScore = details.getRedScore(match.blueMinPen, 0);
    this.forceUpdate();
  }

  private changeRecoveryProcessing(event: SyntheticEvent, props: DropdownProps) {
    const {match, matchDetails} = this.props;
    const details: OceanOpportunitiesMatchDetails = (matchDetails as OceanOpportunitiesMatchDetails);
    details.redProcessingBargeRecovery = parseInt(props.value as string, 10);
    match.redScore = details.getRedScore(match.blueMinPen, 0);
    this.forceUpdate();
  }

  private changeReductionProcessing(event: SyntheticEvent, props: DropdownProps) {
    const {match, matchDetails} = this.props;
    const details: OceanOpportunitiesMatchDetails = (matchDetails as OceanOpportunitiesMatchDetails);
    details.redReductionProcessing = parseInt(props.value as string, 10);
    match.redScore = details.getRedScore(match.blueMinPen, 0);
    this.forceUpdate();
  }

  private changeRobotOneEndState(event: SyntheticEvent, props: DropdownProps) {
    const {match, matchDetails} = this.props;
    const details: OceanOpportunitiesMatchDetails = (matchDetails as OceanOpportunitiesMatchDetails);
    details.redEndRobotOneDocking = parseInt(props.value as string, 10);
    match.redScore = details.getRedScore(match.blueMinPen, 0);
    this.forceUpdate();
  }

  private changeRobotTwoEndState(event: SyntheticEvent, props: DropdownProps) {
    const {match, matchDetails} = this.props;
    const details: OceanOpportunitiesMatchDetails = (matchDetails as OceanOpportunitiesMatchDetails);
    details.redEndRobotTwoDocking = parseInt(props.value as string, 10);
    match.redScore = details.getRedScore(match.blueMinPen, 0);
    this.forceUpdate();
  }

  private changeRobotThreeEndState(event: SyntheticEvent, props: DropdownProps) {
    const {match, matchDetails} = this.props;
    const details: OceanOpportunitiesMatchDetails = (matchDetails as OceanOpportunitiesMatchDetails);
    details.redEndRobotThreeDocking = parseInt(props.value as string, 10);
    match.redScore = details.getRedScore(match.blueMinPen, 0);
    this.forceUpdate();
  }

  private changeMinorPenalties(event: SyntheticEvent, props: DropdownProps) {
    const {match, matchDetails} = this.props;
    const details: OceanOpportunitiesMatchDetails = (matchDetails as OceanOpportunitiesMatchDetails);
    match.redMinPen = parseInt(props.value as string, 10);
    match.blueScore = details.getBlueScore(match.redMinPen, 0);
    this.forceUpdate();
  }
}

export function mapStateToProps({scoringState}: IApplicationState) {
  return {
    match: scoringState.activeMatch,
    matchDetails: scoringState.activeDetails,
    matchState: scoringState.matchState
  };
}

export default connect(mapStateToProps)(OceanOpportunitiesRedScorecard);