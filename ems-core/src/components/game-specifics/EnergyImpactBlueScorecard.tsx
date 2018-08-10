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
import {Dispatch} from "redux";
import MatchDetails from "../../shared/models/MatchDetails";
import {setActiveDetails} from "../../stores/scoring/actions";
import {ISetActiveDetails} from "../../stores/scoring/types";

interface IProps {
  match?: Match,
  details?: EnergyImpactMatchDetails,
  matchParticipants?: MatchParticipant[]
  matchState?: MatchState,
  setActiveDetails?: (details: MatchDetails) => ISetActiveDetails
}

class EnergyImpactBlueScorecard extends React.Component<IProps> {
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
      <Card fluid={true} className="blue-bg">
        <Card.Content className="center-items card-header"><Card.Header>Blue Alliance Scorecard</Card.Header></Card.Content>
        <Card.Content>
          <EnergyImpactTeamStatus alliance={"Blue"} />
        </Card.Content>
        <Card.Content>
          <Form>
            <Grid className="details">
              <Grid.Row columns="equal" textAlign="center">
                <Grid.Column><Form.Input disabled={disabled} fluid={true} label="SP 1" value={details.blueSolarPanelOwnerships[0]} onChange={this.modifySolarOne}/></Grid.Column>
                <Grid.Column><Form.Input disabled={disabled} fluid={true} label="SP 2" value={details.blueSolarPanelOwnerships[1]} onChange={this.modifySolarTwo}/></Grid.Column>
                <Grid.Column><Form.Input disabled={disabled} fluid={true} label="SP 3" value={details.blueSolarPanelOwnerships[2]} onChange={this.modifySolarThree}/></Grid.Column>
                <Grid.Column><Form.Input disabled={disabled} fluid={true} label="SP 4" value={details.blueSolarPanelOwnerships[3]} onChange={this.modifySolarFour}/></Grid.Column>
                <Grid.Column><Form.Input disabled={disabled} fluid={true} label="SP 5" value={details.blueSolarPanelOwnerships[4]} onChange={this.modifySolarFive}/></Grid.Column>
              </Grid.Row>
              <Grid.Row columns={16}>
                <Grid.Column width={8}>
                  <Form.Checkbox disabled={disabled} label="Wind Powerline" checked={details.blueWindTurbinePowerlineOn} onChange={this.modifyWindPowerline}/>
                  <Form.Checkbox disabled={disabled} label="Combustion Powerline" checked={details.blueCombustionPowerlineOn} onChange={this.modifyCombustionPowerline}/>
                  <Form.Checkbox disabled={disabled} label="Reactor Powerline" checked={details.blueNuclearReactorPowerlineOn} onChange={this.modifyReactorPowerline}/>
                  <Form.Checkbox disabled={disabled} label="Coop Powerline" checked={details.blueDidCoopertition} onChange={this.modifyCooperPowerline}/>
                  <Form.Checkbox disabled={disabled} label="Turbine Cranked" checked={details.blueWindTurbineCranked} onChange={this.modifyTurbineCranked}/>
                </Grid.Column>
                <Grid.Column width={4} textAlign="center">
                  <Form.Input disabled={disabled} fluid={true} label="High Goals" value={details.blueHighCombustionGoals} onChange={this.modifyHighGoals}/>
                  <Form.Input disabled={disabled} fluid={true} label="Wind Ownership" value={details.blueWindTurbineOwnership} onChange={this.modifyWindOwnership}/>
                </Grid.Column>
                <Grid.Column width={4} textAlign="center">
                  <Form.Input disabled={disabled} fluid={true} label="Low Goals" value={details.blueLowCombustionGoals} onChange={this.modifyLowGoals}/>
                  <Form.Input disabled={disabled} fluid={true} label="Reactor Ownership" value={details.blueNuclearReactorOwnership} onChange={this.modifyReactorOwnership}/>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns="equal">
                <Grid.Column><Form.Input disabled={disabled} fluid={true} label="Robots Parked" value={details.blueRobotsParked} onChange={this.modifyRobotsParked}/></Grid.Column>
                <Grid.Column><Form.Input disabled={disabled} fluid={true} label="Reactor Cubes" value={details.sharedNuclearReactorCubes} onChange={this.modifyReactorCubes}/></Grid.Column>
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

  private getDetails(): EnergyImpactMatchDetails { // TODO - There is too much of this in the code... Maybe make some static methods inside of MatchDetails/Match?
    if (this.props.match === null || this.props.details === null || typeof this.props.details === "undefined") {
      return new EnergyImpactMatchDetails();
    } else {
      return this.props.details as EnergyImpactMatchDetails;
    }
  }

  private modifySolarOne(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as EnergyImpactMatchDetails).blueSolarPanelOwnerships[0] = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.forceUpdate();
    }
  }

  private modifySolarTwo(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as EnergyImpactMatchDetails).blueSolarPanelOwnerships[1] = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.forceUpdate();
    }
  }

  private modifySolarThree(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as EnergyImpactMatchDetails).blueSolarPanelOwnerships[2] = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.forceUpdate();
    }
  }

  private modifySolarFour(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as EnergyImpactMatchDetails).blueSolarPanelOwnerships[3] = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.forceUpdate();
    }
  }

  private modifySolarFive(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as EnergyImpactMatchDetails).blueSolarPanelOwnerships[4] = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.forceUpdate();
    }
  }

  private modifyWindPowerline() {
    (this.props.details as EnergyImpactMatchDetails).blueWindTurbinePowerlineOn = !(this.props.details as EnergyImpactMatchDetails).blueWindTurbinePowerlineOn;
    this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
    this.forceUpdate();
  }

  private modifyCombustionPowerline() {
    (this.props.details as EnergyImpactMatchDetails).blueCombustionPowerlineOn = !(this.props.details as EnergyImpactMatchDetails).blueCombustionPowerlineOn;
    this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
    this.forceUpdate();
  }

  private modifyReactorPowerline() {
    (this.props.details as EnergyImpactMatchDetails).blueNuclearReactorPowerlineOn = !(this.props.details as EnergyImpactMatchDetails).blueNuclearReactorPowerlineOn;
    this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
    this.forceUpdate();
  }

  private modifyCooperPowerline() {
    (this.props.details as EnergyImpactMatchDetails).blueDidCoopertition = !(this.props.details as EnergyImpactMatchDetails).blueDidCoopertition;
    this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.props.setActiveDetails(new EnergyImpactMatchDetails().fromJSON(this.props.details.toJSON()));
    this.forceUpdate();
  }

  private modifyTurbineCranked() {
    (this.props.details as EnergyImpactMatchDetails).blueWindTurbineCranked = !(this.props.details as EnergyImpactMatchDetails).blueWindTurbineCranked;
    this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
    this.forceUpdate();
  }

  private modifyHighGoals(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as EnergyImpactMatchDetails).blueHighCombustionGoals = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.forceUpdate();
    }
  }

  private modifyLowGoals(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as EnergyImpactMatchDetails).blueLowCombustionGoals = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.forceUpdate();
    }
  }

  private modifyWindOwnership(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as EnergyImpactMatchDetails).blueWindTurbineOwnership = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.forceUpdate();
    }
  }

  private modifyReactorOwnership(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as EnergyImpactMatchDetails).blueNuclearReactorOwnership = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.forceUpdate();
    }
  }

  private modifyRobotsParked(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0 && parseInt(props.value, 10) <= 3) {
      (this.props.details as EnergyImpactMatchDetails).blueRobotsParked = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.forceUpdate();
    }
  }

  private modifyReactorCubes(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as EnergyImpactMatchDetails).sharedNuclearReactorCubes = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.props.setActiveDetails(new EnergyImpactMatchDetails().fromJSON(this.props.details.toJSON()));
      this.forceUpdate();
    }
  }

  private modifyMinorPenalties(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      this.props.match.blueMinPen = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.props.setActiveDetails(new EnergyImpactMatchDetails().fromJSON(this.props.details.toJSON()));
      this.forceUpdate();
    }
  }

  private modifyMajorPenalties(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      this.props.match.blueMajPen = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
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

export default connect(mapStateToProps, mapDispatchToProps)(EnergyImpactBlueScorecard);