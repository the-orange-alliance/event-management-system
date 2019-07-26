import * as React from "react";
import {Card, CheckboxProps, Dimmer, DropdownProps, Form, Grid, Loader} from "semantic-ui-react";
import OceanOpportunitiesTeamStatus from "./OceanOpportunitiesTeamStatus";
import {DropdownData, Match, MatchDetails, MatchState, OceanOpportunitiesMatchDetails} from "@the-orange-alliance/lib-ems";
import {ApplicationActions, IApplicationState} from "../../../stores";
import {connect} from "react-redux";
import {SyntheticEvent} from "react";
import {ISetActiveDetails} from "../../../stores/scoring/types";
import {Dispatch} from "redux";
import {setActiveDetails} from "../../../stores/scoring/actions";

interface IProps {
  match?: Match
  matchDetails?: MatchDetails,
  matchState?: MatchState,
  loading: boolean,
  setActiveDetails?: (details: MatchDetails) => ISetActiveDetails
}

class OceanOpportunitiesBlueScorecard extends React.Component<IProps> {
  constructor(props: any) {
    super(props);
    this.changeRecoveryProcessing = this.changeRecoveryProcessing.bind(this);
    this.changeRecycleProcessing = this.changeRecycleProcessing.bind(this);
    this.changeReductionProcessing = this.changeReductionProcessing.bind(this);
    this.changeReuseProcessing = this.changeReuseProcessing.bind(this);
    this.changeRobotOneEndState = this.changeRobotOneEndState.bind(this);
    this.changeRobotTwoEndState = this.changeRobotTwoEndState.bind(this);
    this.changeRobotThreeEndState = this.changeRobotThreeEndState.bind(this);
    this.changeMinorPenalties = this.changeMinorPenalties.bind(this);
    this.changeCoopertition = this.changeCoopertition.bind(this);
  }

  public render() {
    const {match, matchState, loading} = this.props;
    const disabled = matchState === MatchState.MATCH_IN_PROGRESS || match === null || typeof match.matchDetails === "undefined";

    return (
      <Card fluid={true} className="scorecard blue-bg">
        <Dimmer active={loading}>
          <Loader/>
        </Dimmer>
        <Card.Content className="center-items card-header"><Card.Header>Blue Alliance
          Scorecard</Card.Header></Card.Content>
        <Card.Content>
          <OceanOpportunitiesTeamStatus alliance={"Blue"}/>
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
      const reuse: number = (matchDetails as OceanOpportunitiesMatchDetails).blueProcessingBargeReuse;
      const recycle: number = (matchDetails as OceanOpportunitiesMatchDetails).blueProcessingBargeRecycle;
      const recovery: number = (matchDetails as OceanOpportunitiesMatchDetails).blueProcessingBargeRecovery;
      const reduction: number = (matchDetails as OceanOpportunitiesMatchDetails).blueReductionProcessing;
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
      const robotOne = (matchDetails as OceanOpportunitiesMatchDetails).blueEndRobotOneDocking;
      const robotTwo = (matchDetails as OceanOpportunitiesMatchDetails).blueEndRobotTwoDocking;
      const robotThree = (matchDetails as OceanOpportunitiesMatchDetails).blueEndRobotThreeDocking;
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
      const {match, matchDetails} = this.props;
      const penalties = match.blueMinPen;
      const coopertition = (matchDetails as OceanOpportunitiesMatchDetails).coopertitionBonus;
      return (
        <Grid className={"details"}>
          <Grid.Row columns={3}>
            <Grid.Column className={"align-center"}>
              <span>SCORE: {match.blueScore}</span>
            </Grid.Column>
            <Grid.Column className={"align-center"}>
              <Form.Checkbox label={"Coopertition"} disabled={disabled} checked={coopertition} onChange={this.changeCoopertition}/>
            </Grid.Column>
            <Grid.Column>
              <Form.Input label={"Minor Penalties"} disabled={disabled} fluid={true} value={penalties} onChange={this.changeMinorPenalties}/>
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
    details.blueProcessingBargeReuse = parseInt(props.value as string, 10);
    match.blueScore = details.getBlueScore(match.redMinPen, 0);
    this.checkForCoopertition();
    this.forceUpdate();
  }

  private changeRecycleProcessing(event: SyntheticEvent, props: DropdownProps) {
    const {match, matchDetails} = this.props;
    const details: OceanOpportunitiesMatchDetails = (matchDetails as OceanOpportunitiesMatchDetails);
    details.blueProcessingBargeRecycle = parseInt(props.value as string, 10);
    match.blueScore = details.getBlueScore(match.redMinPen, 0);
    this.checkForCoopertition();
    this.forceUpdate();
  }

  private changeRecoveryProcessing(event: SyntheticEvent, props: DropdownProps) {
    const {match, matchDetails} = this.props;
    const details: OceanOpportunitiesMatchDetails = (matchDetails as OceanOpportunitiesMatchDetails);
    details.blueProcessingBargeRecovery = parseInt(props.value as string, 10);
    match.blueScore = details.getBlueScore(match.redMinPen, 0);
    this.checkForCoopertition();
    this.forceUpdate();
  }

  private changeReductionProcessing(event: SyntheticEvent, props: DropdownProps) {
    const {match, matchDetails} = this.props;
    const details: OceanOpportunitiesMatchDetails = (matchDetails as OceanOpportunitiesMatchDetails);
    details.blueReductionProcessing = parseInt(props.value as string, 10);
    match.blueScore = details.getBlueScore(match.redMinPen, 0);
    this.checkForCoopertition();
    this.forceUpdate();
  }

  private changeRobotOneEndState(event: SyntheticEvent, props: DropdownProps) {
    const {match, matchDetails} = this.props;
    const details: OceanOpportunitiesMatchDetails = (matchDetails as OceanOpportunitiesMatchDetails);
    details.blueEndRobotOneDocking = parseInt(props.value as string, 10);
    match.blueScore = details.getBlueScore(match.redMinPen, 0);
    this.forceUpdate();
  }

  private changeRobotTwoEndState(event: SyntheticEvent, props: DropdownProps) {
    const {match, matchDetails} = this.props;
    const details: OceanOpportunitiesMatchDetails = (matchDetails as OceanOpportunitiesMatchDetails);
    details.blueEndRobotTwoDocking = parseInt(props.value as string, 10);
    match.blueScore = details.getBlueScore(match.redMinPen, 0);
    this.forceUpdate();
  }

  private changeRobotThreeEndState(event: SyntheticEvent, props: DropdownProps) {
    const {match, matchDetails} = this.props;
    const details: OceanOpportunitiesMatchDetails = (matchDetails as OceanOpportunitiesMatchDetails);
    details.blueEndRobotThreeDocking = parseInt(props.value as string, 10);
    match.blueScore = details.getBlueScore(match.redMinPen, 0);
    this.forceUpdate();
  }

  private changeMinorPenalties(event: SyntheticEvent, props: DropdownProps) {
    const {match, matchDetails} = this.props;
    const details: OceanOpportunitiesMatchDetails = (matchDetails as OceanOpportunitiesMatchDetails);
    match.blueMinPen = parseInt(props.value as string, 10);
    match.redScore = details.getRedScore(match.blueMinPen, 0);
    // this.props.setActiveDetails(new OceanOpportunitiesMatchDetails().fromJSON(this.props.matchDetails.toJSON()));
    this.forceUpdate();
  }

  private changeCoopertition(event: SyntheticEvent, props: CheckboxProps) {
    const {matchDetails} = this.props;
    const details: OceanOpportunitiesMatchDetails = (matchDetails as OceanOpportunitiesMatchDetails);
    details.coopertitionBonus = props.checked;
    // this.props.setActiveDetails(new OceanOpportunitiesMatchDetails().fromJSON(details.toJSON()));
    this.forceUpdate();
  }

  private checkForCoopertition() {
    const {match, matchDetails} = this.props;
    const redReusePollutants = (matchDetails as OceanOpportunitiesMatchDetails).redProcessingBargeReuse;
    const redRecyclePollutants = (matchDetails as OceanOpportunitiesMatchDetails).redProcessingBargeRecycle;
    const redRecoveryPollutants = (matchDetails as OceanOpportunitiesMatchDetails).redProcessingBargeRecovery;
    const redReductionPollutants = (matchDetails as OceanOpportunitiesMatchDetails).redReductionProcessing;

    const blueReusePollutants = (matchDetails as OceanOpportunitiesMatchDetails).blueProcessingBargeReuse;
    const blueRecyclePollutants = (matchDetails as OceanOpportunitiesMatchDetails).blueProcessingBargeRecycle;
    const blueRecoveryPollutants = (matchDetails as OceanOpportunitiesMatchDetails).blueProcessingBargeRecovery;
    const blueReductionPollutants = (matchDetails as OceanOpportunitiesMatchDetails).blueReductionProcessing;

    const maxPollutants = match.tournamentLevel > 1 ? OceanOpportunitiesMatchDetails.MAX_POLLUTANTS_PLAYOFFS : OceanOpportunitiesMatchDetails.MAX_POLLUTANTS;
    const redPollutants = redReusePollutants + redRecyclePollutants + redRecoveryPollutants + redReductionPollutants;
    const bluePollutants = blueReusePollutants + blueRecyclePollutants + blueRecoveryPollutants + blueReductionPollutants;
    const totalPollutants = redPollutants + bluePollutants;

    const remainingPollutants = maxPollutants - totalPollutants;

    (matchDetails as OceanOpportunitiesMatchDetails).coopertitionBonus = remainingPollutants === 0;
    // this.props.setActiveDetails(new OceanOpportunitiesMatchDetails().fromJSON(this.props.matchDetails.toJSON()));
    if (match.tournamentLevel > Match.QUALIFICATION_LEVEL) {
      match.redScore += (matchDetails as OceanOpportunitiesMatchDetails).coopertitionBonus ? OceanOpportunitiesMatchDetails.COOPERTITION_PLAYOFFS_POINTS : 0;
      match.blueScore += (matchDetails as OceanOpportunitiesMatchDetails).coopertitionBonus ? OceanOpportunitiesMatchDetails.COOPERTITION_PLAYOFFS_POINTS : 0;
    }
  }
}

export function mapStateToProps({scoringState}: IApplicationState) {
  return {
    match: scoringState.activeMatch,
    matchDetails: scoringState.activeDetails,
    matchState: scoringState.matchState
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setActiveDetails: (details: MatchDetails) => dispatch(setActiveDetails(details))
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(OceanOpportunitiesBlueScorecard);