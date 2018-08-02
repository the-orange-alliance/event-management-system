import * as React from "react";
import {Card, Form, Grid, InputProps} from "semantic-ui-react";
import {ApplicationActions, IApplicationState} from "../../stores";
import {connect} from "react-redux";
import EnergyImpactMatchDetails from "../../shared/models/EnergyImpactMatchDetails";
import Match from "../../shared/models/Match";
import {MatchState} from "../../shared/models/MatchState";
import EnergyImpactTeamStatus from "./EnergyImpactTeamStatus";
import MatchParticipant from "../../shared/models/MatchParticipant";
import {SyntheticEvent} from "react";
import MatchDetails from "../../shared/models/MatchDetails";
import {ISetActiveDetails, ISetActiveMatch} from "../../stores/scoring/types";
import {Dispatch} from "redux";
import {setActiveDetails, setActiveMatch} from "../../stores/scoring/actions";

interface IProps {
  match?: Match,
  details?: EnergyImpactMatchDetails,
  matchParticipants?: MatchParticipant[]
  matchState?: MatchState,
  setActiveMatch?: (match: Match) => ISetActiveMatch,
  setActiveDetails?: (details: MatchDetails) => ISetActiveDetails
}

class EnergyImpactRedScorecard extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.modifySolarOne = this.modifySolarOne.bind(this);
    this.modifySolarTwo = this.modifySolarTwo.bind(this);
    this.modifySolarThree = this.modifySolarThree.bind(this);
    this.modifySolarFour = this.modifySolarFour.bind(this);
    this.modifySolarFive = this.modifySolarFive.bind(this);
    this.modifyWindPowerline = this.modifyWindPowerline.bind(this);
    this.modifyCombustionPowerline = this.modifyCombustionPowerline.bind(this);
    this.modifyReactorPowerline = this.modifyReactorPowerline.bind(this);
    this.modifyCooperPowerline = this.modifyCooperPowerline.bind(this);
    this.modifyTurbineCranked = this.modifyTurbineCranked.bind(this);
    this.modifyHighGoals = this.modifyHighGoals.bind(this);
    this.modifyLowGoals = this.modifyLowGoals.bind(this);
    this.modifyWindOwnership = this.modifyWindOwnership.bind(this);
    this.modifyReactorOwnership = this.modifyReactorOwnership.bind(this);
    this.modifyRobotsParked = this.modifyRobotsParked.bind(this);
    this.modifyReactorCubes = this.modifyReactorCubes.bind(this);
    this.modifyMinorPenalties = this.modifyMinorPenalties.bind(this);
    this.modifyMajorPenalties = this.modifyMajorPenalties.bind(this);
  }

  public render() {
    const match = this.props.match === null ? new Match() : this.props.match;
    const details = this.getDetails();
    const disabled = this.props.matchState === MatchState.MATCH_IN_PROGRESS || match === null || typeof match.matchDetails === "undefined";
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
                <Grid.Column><Form.Input disabled={disabled} fluid={true} label="SP 1" value={details.redSolarPanelOwnerships[0]} onChange={this.modifySolarOne}/></Grid.Column>
                <Grid.Column><Form.Input disabled={disabled} fluid={true} label="SP 2" value={details.redSolarPanelOwnerships[1]} onChange={this.modifySolarTwo}/></Grid.Column>
                <Grid.Column><Form.Input disabled={disabled} fluid={true} label="SP 3" value={details.redSolarPanelOwnerships[2]} onChange={this.modifySolarThree}/></Grid.Column>
                <Grid.Column><Form.Input disabled={disabled} fluid={true} label="SP 4" value={details.redSolarPanelOwnerships[3]} onChange={this.modifySolarFour}/></Grid.Column>
                <Grid.Column><Form.Input disabled={disabled} fluid={true} label="SP 5" value={details.redSolarPanelOwnerships[4]} onChange={this.modifySolarFive}/></Grid.Column>
              </Grid.Row>
              <Grid.Row columns={16}>
                <Grid.Column width={8}>
                  <Form.Checkbox disabled={disabled} label="Wind Powerline" checked={details.redWindTurbinePowerlineOn} onChange={this.modifyWindPowerline}/>
                  <Form.Checkbox disabled={disabled} label="Combustion Powerline" checked={details.redCombustionPowerlineOn} onChange={this.modifyCombustionPowerline}/>
                  <Form.Checkbox disabled={disabled} label="Reactor Powerline" checked={details.redNuclearReactorPowerlineOn} onChange={this.modifyReactorPowerline}/>
                  <Form.Checkbox disabled={disabled} label="Coop Powerline" checked={details.redDidCoopertition} onChange={this.modifyCooperPowerline}/>
                  <Form.Checkbox disabled={disabled} label="Turbine Cranked" checked={details.redWindTurbineCranked} onChange={this.modifyTurbineCranked}/>
                </Grid.Column>
                <Grid.Column width={4} textAlign="center">
                  <Form.Input disabled={disabled} fluid={true} label="High Goals" value={details.redHighCombustionGoals} onChange={this.modifyHighGoals}/>
                  <Form.Input disabled={disabled} fluid={true} label="Wind Ownership" value={details.redWindTurbineOwnership} onChange={this.modifyWindOwnership}/>
                </Grid.Column>
                <Grid.Column width={4} textAlign="center">
                  <Form.Input disabled={disabled} fluid={true} label="Low Goals" value={details.redLowCombustionGoals} onChange={this.modifyLowGoals}/>
                  <Form.Input disabled={disabled} fluid={true} label="Reactor Ownership" value={details.redNuclearReactorOwnership} onChange={this.modifyReactorOwnership}/>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns="equal">
                <Grid.Column><Form.Input disabled={disabled} fluid={true} label="Robots Parked" value={details.redRobotsParked} onChange={this.modifyRobotsParked}/></Grid.Column>
                <Grid.Column><Form.Input disabled={disabled} fluid={true} label="Reactor Cubes" value={details.sharedNuclearReactorCubes} onChange={this.modifyReactorCubes}/></Grid.Column>
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

  private getDetails(): EnergyImpactMatchDetails { // TODO - There is too much of this in the code... Maybe make some static methods inside of MatchDetails/Match?
    if (this.props.match === null || this.props.details === null || typeof this.props.details === "undefined") {
      return new EnergyImpactMatchDetails();
    } else {
      return this.props.details as EnergyImpactMatchDetails;
    }
  }

  private modifySolarOne(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as EnergyImpactMatchDetails).redSolarPanelOwnerships[0] = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifySolarTwo(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as EnergyImpactMatchDetails).redSolarPanelOwnerships[1] = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifySolarThree(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as EnergyImpactMatchDetails).redSolarPanelOwnerships[2] = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifySolarFour(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as EnergyImpactMatchDetails).redSolarPanelOwnerships[3] = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifySolarFive(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as EnergyImpactMatchDetails).redSolarPanelOwnerships[4] = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifyWindPowerline() {
    (this.props.details as EnergyImpactMatchDetails).redWindTurbinePowerlineOn = !(this.props.details as EnergyImpactMatchDetails).redWindTurbinePowerlineOn;
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
  }

  private modifyCombustionPowerline() {
    (this.props.details as EnergyImpactMatchDetails).redCombustionPowerlineOn = !(this.props.details as EnergyImpactMatchDetails).redCombustionPowerlineOn;
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
  }

  private modifyReactorPowerline() {
    (this.props.details as EnergyImpactMatchDetails).redNuclearReactorPowerlineOn = !(this.props.details as EnergyImpactMatchDetails).redNuclearReactorPowerlineOn;
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
  }

  private modifyCooperPowerline() {
    (this.props.details as EnergyImpactMatchDetails).redDidCoopertition = !(this.props.details as EnergyImpactMatchDetails).redDidCoopertition;
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
    this.props.setActiveDetails(new EnergyImpactMatchDetails().fromJSON(this.props.details.toJSON()));
    this.forceUpdate();
  }

  private modifyTurbineCranked() {
    (this.props.details as EnergyImpactMatchDetails).redWindTurbineCranked = !(this.props.details as EnergyImpactMatchDetails).redWindTurbineCranked;
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
  }

  private modifyHighGoals(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as EnergyImpactMatchDetails).redHighCombustionGoals = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifyLowGoals(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as EnergyImpactMatchDetails).redLowCombustionGoals = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifyWindOwnership(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as EnergyImpactMatchDetails).redWindTurbineOwnership = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifyReactorOwnership(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as EnergyImpactMatchDetails).redNuclearReactorOwnership = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifyRobotsParked(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0 && parseInt(props.value, 10) <= 3) {
      (this.props.details as EnergyImpactMatchDetails).redRobotsParked = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifyReactorCubes(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as EnergyImpactMatchDetails).sharedNuclearReactorCubes = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.props.setActiveDetails(new EnergyImpactMatchDetails().fromJSON(this.props.details.toJSON()));
      this.forceUpdate();
    }
  }

  private modifyMinorPenalties(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      this.props.match.redMinPen = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.props.setActiveDetails(new EnergyImpactMatchDetails().fromJSON(this.props.details.toJSON()));
      this.forceUpdate();
    }
  }

  private modifyMajorPenalties(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      this.props.match.redMajPen = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
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

export default connect(mapStateToProps, mapDispatchToProps)(EnergyImpactRedScorecard as any);
// This is 100% not type safe, but TypeScript started randomly complaining and all other components are fine.