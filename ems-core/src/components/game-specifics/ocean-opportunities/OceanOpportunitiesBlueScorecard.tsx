import * as React from "react";
import {Card, Dimmer, Form, Grid, Loader} from "semantic-ui-react";
import OceanOpportunitiesTeamStatus from "./OceanOpportunitiesTeamStatus";
import OceanOpportunitiesMatchDetails from "@the-orange-alliance/lib-ems/dist/models/ems/games/ocean-opportunities/OceanOpportunitiesMatchDetails";
import {DropdownData, Match, MatchState} from "@the-orange-alliance/lib-ems";
import MatchDetails from "@the-orange-alliance/lib-ems/dist/models/ems/MatchDetails";
import {IApplicationState} from "../../../stores";
import {connect} from "react-redux";

interface IProps {
  match?: Match
  matchDetails?: MatchDetails,
  matchState?: MatchState,
  loading: boolean
}
class OceanOpportunitiesBlueScorecard extends React.Component<IProps> {
  constructor(props: any) {
    super(props);
  }

  public render() {
    const {match, matchState, loading} = this.props;
    const disabled = matchState === MatchState.MATCH_IN_PROGRESS || match === null || typeof match.matchDetails === "undefined";

    return (
      <Card fluid={true} className="scorecard blue-bg">
        <Dimmer active={loading}>
          <Loader/>
        </Dimmer>
        <Card.Content className="center-items card-header"><Card.Header>Blue Alliance Scorecard</Card.Header></Card.Content>
        <Card.Content>
          <OceanOpportunitiesTeamStatus alliance={"Blue"} />
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
              <Form.Input label={"Reuse"} disabled={disabled} fluid={true} value={reuse}/>
            </Grid.Column>
            <Grid.Column width={4}>
              <Form.Input label={"Recycle"} disabled={disabled} fluid={true} value={recycle}/>
            </Grid.Column>
            <Grid.Column width={4}>
              <Form.Input label={"Recovery"} disabled={disabled} fluid={true} value={recovery}/>
            </Grid.Column>
            <Grid.Column width={4}>
              <Form.Input label={"Reduction"} disabled={disabled} fluid={true} value={reduction}/>
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
              <Form.Dropdown label={"Robot 1"} disabled={disabled} fluid={true} selection={true} value={robotOne} options={DropdownData.OceanOpportunitiesEndItems}/>
            </Grid.Column>
            <Grid.Column>
              <Form.Dropdown label={"Robot 2"} disabled={disabled} fluid={true} selection={true} value={robotTwo} options={DropdownData.OceanOpportunitiesEndItems}/>
            </Grid.Column>
            <Grid.Column>
              <Form.Dropdown label={"Robot 3"} disabled={disabled} fluid={true} selection={true} value={robotThree} options={DropdownData.OceanOpportunitiesEndItems}/>
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
      const penalties = match.blueMinPen;
      return (
        <Grid>
          <Grid.Row columns={3}>
            <Grid.Column className={"align-center"}>
              <span>SCORE: {match.blueScore}</span>
            </Grid.Column>
            <Grid.Column><div/></Grid.Column>
            <Grid.Column>
              <Form.Input label={"Minor Penalties"} disabled={disabled} fluid={true} value={penalties}/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    } else {
      return (<div/>);
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

export default connect(mapStateToProps)(OceanOpportunitiesBlueScorecard);