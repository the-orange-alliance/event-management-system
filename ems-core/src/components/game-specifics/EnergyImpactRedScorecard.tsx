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

class EnergyImpactRedScorecard extends React.Component<IProps, IState> {
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
      <Card fluid={true} className="red-bg">
        <Card.Content className="center-items card-header"><Card.Header>Red Alliance Scorecard</Card.Header></Card.Content>
        <Card.Content>
          <EnergyImpactTeamStatus alliance={"Red"} />
        </Card.Content>
        <Card.Content>
          <Form>
            <Grid className="details">
              <Grid.Row columns="equal" textAlign="center">
                <Grid.Column><Form.Input fluid={true} label="SP 1" value={details.redSolarPanelOwnerships[0]}/></Grid.Column>
                <Grid.Column><Form.Input fluid={true} label="SP 2" value={details.redSolarPanelOwnerships[1]}/></Grid.Column>
                <Grid.Column><Form.Input fluid={true} label="SP 3" value={details.redSolarPanelOwnerships[2]}/></Grid.Column>
                <Grid.Column><Form.Input fluid={true} label="SP 4" value={details.redSolarPanelOwnerships[3]}/></Grid.Column>
                <Grid.Column><Form.Input fluid={true} label="SP 5" value={details.redSolarPanelOwnerships[4]}/></Grid.Column>
              </Grid.Row>
              <Grid.Row columns={16}>
                <Grid.Column width={8}>
                  <Form.Checkbox label="Wind Powerline" checked={details.redWindTurbinePowerlineOn}/>
                  <Form.Checkbox label="Combustion Powerline" checked={details.redCombustionPowerlineOn}/>
                  <Form.Checkbox label="Reactor Powerline" checked={details.redNuclearReactorPowerlineOn}/>
                  <Form.Checkbox label="Coop Powerline" checked={details.redDidCoopertition}/>
                  <Form.Checkbox label="Turbine Cranked" checked={details.redWindTurbineCranked}/>
                </Grid.Column>
                <Grid.Column width={4} textAlign="center">
                  <Form.Input fluid={true} label="High Goals" value={details.redHighCombustionGoals}/>
                  <Form.Input fluid={true} label="Wind Ownership" value={details.redWindTurbineOwnership}/>
                </Grid.Column>
                <Grid.Column width={4} textAlign="center">
                  <Form.Input fluid={true} label="Low Goals" value={details.redLowCombustionGoals}/>
                  <Form.Input fluid={true} label="Reactor Ownership" value={details.redNuclearReactorOwnership}/>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns="equal">
                <Grid.Column><Form.Input fluid={true} label="Robots Parked" value={details.redRobotsParked}/></Grid.Column>
                <Grid.Column><Form.Input fluid={true} label="Reactor Cubes" value={details.sharedNuclearReactorCubes}/></Grid.Column>
                <Grid.Column><Form.Input fluid={true} label="Minor Penalties" value={match.redMinPen}/></Grid.Column>
                <Grid.Column><Form.Input fluid={true} label="Major Penalties" value={match.redMajPen}/></Grid.Column>
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

export default connect(mapStateToProps)(EnergyImpactRedScorecard);