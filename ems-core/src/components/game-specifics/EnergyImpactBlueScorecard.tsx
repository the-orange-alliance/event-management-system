import * as React from "react";
import {Card, Form, Grid} from "semantic-ui-react";
import {IApplicationState} from "../../stores";
import {connect} from "react-redux";
import EnergyImpactMatchDetails from "../../shared/models/EnergyImpactMatchDetails";
import Match from "../../shared/models/Match";
import {MatchState} from "../../shared/models/MatchState";
import EnergyImpactTeamStatus from "./EnergyImpactTeamStatus";
import MatchParticipant from "../../shared/models/MatchParticipant";

interface IProps {
  match?: Match,
  matchParticipants?: MatchParticipant[]
  matchState?: MatchState
}

interface IState {
  matchDetails: EnergyImpactMatchDetails
}

class EnergyImpactBlueScorecard extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      matchDetails: this.getDetails()
    };
  }

  public render() {
    const match = this.props.match === null ? new Match() : this.props.match;
    const details = this.getDetails();
    return (
      <Card fluid={true} className="blue-bg">
        <Card.Content className="center-items card-header"><Card.Header>Blue Alliance Scorecard</Card.Header></Card.Content>
        <Card.Content>
          <EnergyImpactTeamStatus alliance={"Blue"} />
        </Card.Content>
        <Card.Content>
          <Form>
            <Grid className="details">
              <Grid.Row columns="equal" textAlign="center">
                <Grid.Column><Form.Input fluid={true} label="SP 1" value={details.blueSolarPanelOwnerships[0]}/></Grid.Column>
                <Grid.Column><Form.Input fluid={true} label="SP 2" value={details.blueSolarPanelOwnerships[1]}/></Grid.Column>
                <Grid.Column><Form.Input fluid={true} label="SP 3" value={details.blueSolarPanelOwnerships[2]}/></Grid.Column>
                <Grid.Column><Form.Input fluid={true} label="SP 4" value={details.blueSolarPanelOwnerships[3]}/></Grid.Column>
                <Grid.Column><Form.Input fluid={true} label="SP 5" value={details.blueSolarPanelOwnerships[4]}/></Grid.Column>
              </Grid.Row>
              <Grid.Row columns={16}>
                <Grid.Column width={8}>
                  <Form.Checkbox label="Wind Powerline" checked={details.blueWindTurbinePowerlineOn}/>
                  <Form.Checkbox label="Combustion Powerline" checked={details.blueCombustionPowerlineOn}/>
                  <Form.Checkbox label="Reactor Powerline" checked={details.blueNuclearReactorPowerlineOn}/>
                  <Form.Checkbox label="Coop Powerline" checked={details.blueDidCoopertition}/>
                  <Form.Checkbox label="Turbine Cranked" checked={details.blueWindTurbineCranked}/>
                </Grid.Column>
                <Grid.Column width={4} textAlign="center">
                  <Form.Input fluid={true} label="High Goals" value={details.blueHighCombustionGoals}/>
                  <Form.Input fluid={true} label="Wind Ownership" value={details.blueWindTurbineOwnership}/>
                </Grid.Column>
                <Grid.Column width={4} textAlign="center">
                  <Form.Input fluid={true} label="Low Goals" value={details.blueLowCombustionGoals}/>
                  <Form.Input fluid={true} label="Reactor Ownership" value={details.blueNuclearReactorOwnership}/>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns="equal">
                <Grid.Column><Form.Input fluid={true} label="Robots Parked" value={details.blueRobotsParked}/></Grid.Column>
                <Grid.Column><Form.Input fluid={true} label="Reactor Cubes" value={details.sharedNuclearReactorCubes}/></Grid.Column>
                <Grid.Column><Form.Input fluid={true} label="Minor Penalties" value={match.blueMinPen}/></Grid.Column>
                <Grid.Column><Form.Input fluid={true} label="Major Penalties" value={match.blueMajPen}/></Grid.Column>
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

  private getDetails(): EnergyImpactMatchDetails { // TODO - There is too much of this in the code... Maybe make some static methods inside of MatchDetails/Match?
    if (this.props.match === null || typeof this.props.match.matchDetails === "undefined") {
      return new EnergyImpactMatchDetails();
    } else {
      return this.props.match.matchDetails as EnergyImpactMatchDetails;
    }
  }
}

export function mapStateToProps({scoringState}: IApplicationState) {
  return {
    match: scoringState.activeMatch,
    matchParticipants: scoringState.activeParticipants,
    matchState: scoringState.matchState
  };
}

export default connect(mapStateToProps)(EnergyImpactBlueScorecard);