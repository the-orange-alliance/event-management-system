import * as React from "react";
import {Card, Form, Grid, InputProps} from "semantic-ui-react";
import {ApplicationActions, IApplicationState} from "../../stores";
import {connect} from "react-redux";
import Match from "../../shared/models/Match";
import {MatchState} from "../../shared/models/MatchState";
import MatchParticipant from "../../shared/models/MatchParticipant";
import MatchDetails from "../../shared/models/MatchDetails";
import {ISetActiveDetails, ISetActiveMatch} from "../../stores/scoring/types";
import {Dispatch} from "redux";
import {setActiveDetails, setActiveMatch} from "../../stores/scoring/actions";
import RoverRuckusTeamStatus from "./RoverRuckusTeamStatus";
import RoverRuckusMatchDetails from "../../shared/models/RoverRuckusMatchDetails";
import {SyntheticEvent} from "react";
import EnergyImpactMatchDetails from "../../shared/models/EnergyImpactMatchDetails";

interface IProps {
  match?: Match,
  details?: RoverRuckusMatchDetails,
  matchParticipants?: MatchParticipant[]
  matchState?: MatchState,
  setActiveMatch?: (match: Match) => ISetActiveMatch,
  setActiveDetails?: (details: MatchDetails) => ISetActiveDetails
}

class RoverRuckusBlueScorecard extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.modifyRobotsLanded = this.modifyRobotsLanded.bind(this);
    this.modifyRobotsParked = this.modifyRobotsParked.bind(this);
    this.modifyAllianceClaims = this.modifyAllianceClaims.bind(this);
    this.modifySamples = this.modifySamples.bind(this);
    this.modifyAutoDepots = this.modifyAutoDepots.bind(this);
    this.modifyAutoGoldMinerals = this.modifyAutoGoldMinerals.bind(this);
    this.modifyAutoSilverMinerals = this.modifyAutoSilverMinerals.bind(this);
    this.modifyTeleDepots = this.modifyTeleDepots.bind(this);
    this.modifyTeleGoldMinerals = this.modifyTeleGoldMinerals.bind(this);
    this.modifyTeleSilverMinerals = this.modifyTeleSilverMinerals.bind(this);
    this.modifyRobotsLatched = this.modifyRobotsLatched.bind(this);
    this.modifyRobotsPartiallyParked = this.modifyRobotsPartiallyParked.bind(this);
    this.modifyRobotsFullyParked = this.modifyRobotsFullyParked.bind(this);
    this.modifyMinorPenalties = this.modifyMinorPenalties.bind(this);
    this.modifyMajorPenalties = this.modifyMajorPenalties.bind(this);
  }

  public render() {
    const match = this.props.match === null ? new Match() : this.props.match;
    const details = this.getDetails();
    const disabled = this.props.matchState === MatchState.MATCH_IN_PROGRESS || match === null || typeof match.matchDetails === "undefined";
    return (
      <Card fluid={true} className="scorecard blue-bg">
        <Card.Content className="center-items card-header"><Card.Header>Blue Alliance Scorecard</Card.Header></Card.Content>
        <Card.Content>
          <RoverRuckusTeamStatus alliance={"Blue"} />
        </Card.Content>
        <Card.Content>
          <Form>
            <Grid className="details">
              <Grid.Row columns="equal" textAlign="center">
                <Grid.Column><Form.Input disabled={disabled} fluid={true} label="Robots Landed" value={details.blueAutoRobotsLanded} onChange={this.modifyRobotsLanded}/></Grid.Column>
                <Grid.Column><Form.Input disabled={disabled} fluid={true} label="Robots Parked" value={details.blueAutoRobotsParked} onChange={this.modifyRobotsParked}/></Grid.Column>
                <Grid.Column><Form.Input disabled={disabled} fluid={true} label="Alliance Claims" value={details.blueAutoClaims} onChange={this.modifyAllianceClaims}/></Grid.Column>
              </Grid.Row>
              <Grid.Row columns="equal" textAlign="center">
                <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Successful Samples" value={details.blueAutoSuccessfulSamples} onChange={this.modifySamples}/></Grid.Column>
                <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Depot Minerals" value={details.blueAutoDepotMinerals} onChange={this.modifyAutoDepots}/></Grid.Column>
                <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Gold Cargo Minerals" value={details.blueAutoCargoGoldMinerals} onChange={this.modifyAutoGoldMinerals}/></Grid.Column>
                <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Silver Cargo Minerals" value={details.blueAutoCargoSilverMinerals} onChange={this.modifyAutoSilverMinerals}/></Grid.Column>
              </Grid.Row>
            </Grid>
          </Form>
        </Card.Content>
        <Card.Content>
          <Form>
            <Grid className="details">
              <Grid.Row columns="equal" textAlign="center">
                <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Depot Minerals" value={details.blueTeleDepotMinerals} onChange={this.modifyTeleDepots}/></Grid.Column>
                <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Gold Cargo Minerals" value={details.blueTeleCargoGoldMinerals} onChange={this.modifyTeleGoldMinerals}/></Grid.Column>
                <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Silver Cargo Minerals" value={details.blueTeleCargoSilverMinerals} onChange={this.modifyTeleSilverMinerals}/></Grid.Column>
              </Grid.Row>
            </Grid>
          </Form>
        </Card.Content>
        <Card.Content>
          <Form>
            <Grid className="details">
              <Grid.Row columns="equal" textAlign="center">
                <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Robots Latched" value={details.blueEndRobotsLatched} onChange={this.modifyRobotsLatched}/></Grid.Column>
                <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Robots Partially Parked" value={details.blueEndRobotsInCraterPartial} onChange={this.modifyRobotsPartiallyParked}/></Grid.Column>
                <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Robots Fully Parked" value={details.blueEndRobotsInCraterFull} onChange={this.modifyRobotsFullyParked}/></Grid.Column>
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

  private getDetails(): RoverRuckusMatchDetails { // TODO - There is too much of this in the code... Maybe make some static methods inside of MatchDetails/Match?
    if (this.props.match === null || this.props.details === null || typeof this.props.details === "undefined") {
      return new RoverRuckusMatchDetails();
    } else {
      return this.props.details as RoverRuckusMatchDetails;
    }
  }

  private modifyRobotsLanded(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as RoverRuckusMatchDetails).blueAutoRobotsLanded = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifyRobotsParked(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as RoverRuckusMatchDetails).blueAutoRobotsParked = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifyAllianceClaims(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as RoverRuckusMatchDetails).blueAutoClaims = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifySamples(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as RoverRuckusMatchDetails).blueAutoSuccessfulSamples = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifyAutoDepots(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as RoverRuckusMatchDetails).blueAutoDepotMinerals = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifyAutoGoldMinerals(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as RoverRuckusMatchDetails).blueAutoCargoGoldMinerals = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifyAutoSilverMinerals(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as RoverRuckusMatchDetails).blueAutoCargoSilverMinerals = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifyTeleDepots(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as RoverRuckusMatchDetails).blueTeleDepotMinerals = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifyTeleGoldMinerals(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as RoverRuckusMatchDetails).blueTeleCargoGoldMinerals = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifyTeleSilverMinerals(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as RoverRuckusMatchDetails).blueTeleCargoSilverMinerals = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifyRobotsLatched(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as RoverRuckusMatchDetails).blueEndRobotsLatched = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifyRobotsPartiallyParked(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as RoverRuckusMatchDetails).blueEndRobotsInCraterPartial = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getRedScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.forceUpdate();
    }
  }

  private modifyRobotsFullyParked(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as RoverRuckusMatchDetails).blueEndRobotsInCraterFull = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getRedScore(this.props.match.redMinPen, this.props.match.redMajPen);
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
    setActiveMatch: (match: Match) => dispatch(setActiveMatch(match)),
    setActiveDetails: (details: MatchDetails) => dispatch(setActiveDetails(details))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RoverRuckusBlueScorecard as any);