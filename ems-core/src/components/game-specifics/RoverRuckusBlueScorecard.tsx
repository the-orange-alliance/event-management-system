import * as React from "react";
import {Card, CheckboxProps, DropdownProps, Form, Grid, InputProps} from "semantic-ui-react";
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
import {RoverRuckusAutoItems, RoverRuckusEndItems, RoverRuckusPreItems} from "../../shared/data/DropdownItemOptions";

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

    this.modifyRobotOnePreStatus = this.modifyRobotOnePreStatus.bind(this);
    this.modifyRobotOneClaimed = this.modifyRobotOneClaimed.bind(this);
    this.modifyRobotTwoPreStatus = this.modifyRobotTwoPreStatus.bind(this);
    this.modifyRobotTwoClaimed = this.modifyRobotTwoClaimed.bind(this);
    this.modifyRobotOneAutoStatus = this.modifyRobotOneAutoStatus.bind(this);
    this.modifyRobotTwoAutoStatus = this.modifyRobotTwoAutoStatus.bind(this);
    this.modifySamples = this.modifySamples.bind(this);
    this.modifyAutoDepots = this.modifyAutoDepots.bind(this);
    this.modifyAutoGoldMinerals = this.modifyAutoGoldMinerals.bind(this);
    this.modifyAutoSilverMinerals = this.modifyAutoSilverMinerals.bind(this);
    this.modifyTeleDepots = this.modifyTeleDepots.bind(this);
    this.modifyTeleGoldMinerals = this.modifyTeleGoldMinerals.bind(this);
    this.modifyTeleSilverMinerals = this.modifyTeleSilverMinerals.bind(this);
    this.modifyRobotOneEndgame = this.modifyRobotOneEndgame.bind(this);
    this.modifyRobotTwoEndgame = this.modifyRobotTwoEndgame.bind(this);
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
                <Grid.Column><Form.Dropdown disabled={disabled} fluid={true} label="Robot 1 Pre-Auto" value={details.bluePreRobotOneStatus} options={RoverRuckusPreItems} onChange={this.modifyRobotOnePreStatus}/></Grid.Column>
                <Grid.Column><Form.Dropdown disabled={disabled} fluid={true} label="Robot 1 Auto" value={details.blueAutoRobotOneClaimed} options={RoverRuckusAutoItems} onChange={this.modifyRobotOneAutoStatus}/></Grid.Column>
                <Grid.Column><Form.Checkbox disabled={disabled} fluid={true} label="Robot 1 Claimed" checked={details.blueAutoRobotOneClaimed} onChange={this.modifyRobotOneClaimed}/></Grid.Column>
              </Grid.Row>
              <Grid.Row columns="equal" textAlign="center">
                <Grid.Column><Form.Dropdown disabled={disabled} fluid={true} label="Robot 2 Pre-Auto" value={details.bluePreRobotTwoStatus} options={RoverRuckusPreItems} onChange={this.modifyRobotTwoPreStatus}/></Grid.Column>
                <Grid.Column><Form.Dropdown disabled={disabled} fluid={true} label="Robot 2 Auto" value={details.blueAutoRobotTwoClaimed} options={RoverRuckusAutoItems} onChange={this.modifyRobotTwoAutoStatus}/></Grid.Column>
                <Grid.Column><Form.Checkbox disabled={disabled} fluid={true} label="Robot 2 Claimed" checked={details.blueAutoRobotTwoClaimed} onChange={this.modifyRobotTwoClaimed}/></Grid.Column>
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
                <Grid.Column><Form.Dropdown disabled={disabled} fluid={true} label="Robot 1 Endgame" value={details.blueEndRobotOneStatus} options={RoverRuckusEndItems} onChange={this.modifyRobotOneEndgame}/></Grid.Column>
                <Grid.Column><Form.Dropdown disabled={disabled} fluid={true} label="Robot 2 Endgame" value={details.blueEndRobotTwoStatus} options={RoverRuckusEndItems} onChange={this.modifyRobotTwoEndgame}/></Grid.Column>
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

  private modifyRobotOnePreStatus(event: SyntheticEvent, props: DropdownProps) {
    (this.props.details as RoverRuckusMatchDetails).bluePreRobotOneStatus = parseInt(props.value + "", 10);
    this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
    this.forceUpdate();
  }

  private modifyRobotOneClaimed(event: SyntheticEvent, props: CheckboxProps) {
    (this.props.details as RoverRuckusMatchDetails).blueAutoRobotOneClaimed = props.checked;
    this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
    this.forceUpdate();
  }

  private modifyRobotTwoPreStatus(event: SyntheticEvent, props: DropdownProps) {
    (this.props.details as RoverRuckusMatchDetails).bluePreRobotTwoStatus = parseInt(props.value + "", 10);
    this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
    this.forceUpdate();
  }

  private modifyRobotTwoClaimed(event: SyntheticEvent, props: CheckboxProps) {
    (this.props.details as RoverRuckusMatchDetails).blueAutoRobotTwoClaimed = props.checked;
    this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
    this.forceUpdate();
  }

  private modifyRobotOneAutoStatus(event: SyntheticEvent, props: DropdownProps) {
    (this.props.details as RoverRuckusMatchDetails).blueAutoRobotOneStatus = parseInt(props.value + "", 10);
    this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
    this.forceUpdate();
  }

  private modifyRobotTwoAutoStatus(event: SyntheticEvent, props: DropdownProps) {
    (this.props.details as RoverRuckusMatchDetails).blueAutoRobotTwoStatus = parseInt(props.value + "", 10);
    this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
    this.forceUpdate();
  }

  private modifySamples(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as RoverRuckusMatchDetails).blueAutoSuccessfulSamples = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.forceUpdate();
    }
  }

  private modifyAutoDepots(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as RoverRuckusMatchDetails).blueAutoDepotMinerals = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.forceUpdate();
    }
  }

  private modifyAutoGoldMinerals(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as RoverRuckusMatchDetails).blueAutoCargoGoldMinerals = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.forceUpdate();
    }
  }

  private modifyAutoSilverMinerals(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as RoverRuckusMatchDetails).blueAutoCargoSilverMinerals = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.forceUpdate();
    }
  }

  private modifyTeleDepots(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as RoverRuckusMatchDetails).blueTeleDepotMinerals = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.forceUpdate();
    }
  }

  private modifyTeleGoldMinerals(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as RoverRuckusMatchDetails).blueTeleCargoGoldMinerals = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.forceUpdate();
    }
  }

  private modifyTeleSilverMinerals(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as RoverRuckusMatchDetails).blueTeleCargoSilverMinerals = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.forceUpdate();
    }
  }

  private modifyRobotOneEndgame(event: SyntheticEvent, props: DropdownProps) {
    (this.props.details as RoverRuckusMatchDetails).blueEndRobotOneStatus = parseInt(props.value + "", 10);
    this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
    this.forceUpdate();
  }

  private modifyRobotTwoEndgame(event: SyntheticEvent, props: DropdownProps) {
    (this.props.details as RoverRuckusMatchDetails).blueEndRobotTwoStatus = parseInt(props.value + "", 10);
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

export default connect(mapStateToProps, mapDispatchToProps)(RoverRuckusBlueScorecard as any);