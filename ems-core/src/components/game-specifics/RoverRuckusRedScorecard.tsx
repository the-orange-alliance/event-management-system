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
import {setActiveDetails} from "../../stores/scoring/actions";
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

class RoverRuckusRedScorecard extends React.Component<IProps> {
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
      <Card fluid={true} className="scorecard red-bg">
        <Card.Content className="center-items card-header"><Card.Header>Red Alliance Scorecard</Card.Header></Card.Content>
        <Card.Content>
          <RoverRuckusTeamStatus alliance={"Red"} />
        </Card.Content>
        <Card.Content>
          <Form>
            <Grid className="details">
              <Grid.Row columns="equal" textAlign="center">
                <Grid.Column><Form.Dropdown disabled={disabled} fluid={true} label="Robot 1 Pre-Auto" value={details.redPreRobotOneStatus} options={RoverRuckusPreItems} onChange={this.modifyRobotOnePreStatus}/></Grid.Column>
                <Grid.Column><Form.Dropdown disabled={disabled} fluid={true} label="Robot 1 Auto" value={details.redAutoRobotOneClaimed} options={RoverRuckusAutoItems} onChange={this.modifyRobotOneAutoStatus}/></Grid.Column>
                <Grid.Column><Form.Checkbox disabled={disabled} fluid={true} label="Robot 1 Claimed" checked={details.redAutoRobotOneClaimed} onChange={this.modifyRobotOneClaimed}/></Grid.Column>
              </Grid.Row>
              <Grid.Row columns="equal" textAlign="center">
                <Grid.Column><Form.Dropdown disabled={disabled} fluid={true} label="Robot 2 Pre-Auto" value={details.redPreRobotTwoStatus} options={RoverRuckusPreItems} onChange={this.modifyRobotTwoPreStatus}/></Grid.Column>
                <Grid.Column><Form.Dropdown disabled={disabled} fluid={true} label="Robot 2 Auto" value={details.redAutoRobotTwoClaimed} options={RoverRuckusAutoItems} onChange={this.modifyRobotTwoAutoStatus}/></Grid.Column>
                <Grid.Column><Form.Checkbox disabled={disabled} fluid={true} label="Robot 2 Claimed" checked={details.redAutoRobotTwoClaimed} onChange={this.modifyRobotTwoClaimed}/></Grid.Column>
              </Grid.Row>
              <Grid.Row columns="equal" textAlign="center">
                <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Successful Samples" value={details.redAutoSuccessfulSamples} onChange={this.modifySamples}/></Grid.Column>
                <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Depot Minerals" value={details.redAutoDepotMinerals} onChange={this.modifyAutoDepots}/></Grid.Column>
                <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Gold Cargo Minerals" value={details.redAutoCargoGoldMinerals} onChange={this.modifyAutoGoldMinerals}/></Grid.Column>
                <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Silver Cargo Minerals" value={details.redAutoCargoSilverMinerals} onChange={this.modifyAutoSilverMinerals}/></Grid.Column>
              </Grid.Row>
            </Grid>
          </Form>
        </Card.Content>
        <Card.Content>
          <Form>
            <Grid className="details">
              <Grid.Row columns="equal" textAlign="center">
                <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Depot Minerals" value={details.redTeleDepotMinerals} onChange={this.modifyTeleDepots}/></Grid.Column>
                <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Gold Cargo Minerals" value={details.redTeleCargoGoldMinerals} onChange={this.modifyTeleGoldMinerals}/></Grid.Column>
                <Grid.Column className="align-bottom"><Form.Input disabled={disabled} fluid={true} label="Silver Cargo Minerals" value={details.redTeleCargoSilverMinerals} onChange={this.modifyTeleSilverMinerals}/></Grid.Column>
              </Grid.Row>
            </Grid>
          </Form>
        </Card.Content>
        <Card.Content>
          <Form>
            <Grid className="details">
              <Grid.Row columns="equal" textAlign="center">
                <Grid.Column><Form.Dropdown disabled={disabled} fluid={true} label="Robot 1 Endgame" value={details.redEndRobotOneStatus} options={RoverRuckusEndItems} onChange={this.modifyRobotOneEndgame}/></Grid.Column>
                <Grid.Column><Form.Dropdown disabled={disabled} fluid={true} label="Robot 2 Endgame" value={details.redEndRobotTwoStatus} options={RoverRuckusEndItems} onChange={this.modifyRobotTwoEndgame}/></Grid.Column>
              </Grid.Row>
            </Grid>
          </Form>
        </Card.Content>
        <Card.Content>
          <Form>
            <Grid className="details">
              <Grid.Row columns="equal" textAlign="center">
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

  private getDetails(): RoverRuckusMatchDetails { // TODO - There is too much of this in the code... Maybe make some static methods inside of MatchDetails/Match?
    if (this.props.match === null || this.props.details === null || typeof this.props.details === "undefined") {
      return new RoverRuckusMatchDetails();
    } else {
      return this.props.details as RoverRuckusMatchDetails;
    }
  }

  private modifyRobotOnePreStatus(event: SyntheticEvent, props: DropdownProps) {
    (this.props.details as RoverRuckusMatchDetails).redPreRobotOneStatus = parseInt(props.value + "", 10);
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
  }

  private modifyRobotOneClaimed(event: SyntheticEvent, props: CheckboxProps) {
    (this.props.details as RoverRuckusMatchDetails).redAutoRobotOneClaimed = props.checked;
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
  }

  private modifyRobotTwoPreStatus(event: SyntheticEvent, props: DropdownProps) {
    (this.props.details as RoverRuckusMatchDetails).redPreRobotTwoStatus = parseInt(props.value + "", 10);
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
  }

  private modifyRobotTwoClaimed(event: SyntheticEvent, props: CheckboxProps) {
    (this.props.details as RoverRuckusMatchDetails).redAutoRobotTwoClaimed = props.checked;
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
  }

  private modifyRobotOneAutoStatus(event: SyntheticEvent, props: DropdownProps) {
    (this.props.details as RoverRuckusMatchDetails).redAutoRobotOneStatus = parseInt(props.value + "", 10);
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
  }

  private modifyRobotTwoAutoStatus(event: SyntheticEvent, props: DropdownProps) {
    (this.props.details as RoverRuckusMatchDetails).redAutoRobotTwoStatus = parseInt(props.value + "", 10);
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
  }

  private modifySamples(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as RoverRuckusMatchDetails).redAutoSuccessfulSamples = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifyAutoDepots(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as RoverRuckusMatchDetails).redAutoDepotMinerals = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifyAutoGoldMinerals(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as RoverRuckusMatchDetails).redAutoCargoGoldMinerals = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifyAutoSilverMinerals(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as RoverRuckusMatchDetails).redAutoCargoSilverMinerals = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifyTeleDepots(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as RoverRuckusMatchDetails).redTeleDepotMinerals = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifyTeleGoldMinerals(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as RoverRuckusMatchDetails).redTeleCargoGoldMinerals = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifyTeleSilverMinerals(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      (this.props.details as RoverRuckusMatchDetails).redTeleCargoSilverMinerals = parseInt(props.value, 10);
      this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
      this.forceUpdate();
    }
  }

  private modifyRobotOneEndgame(event: SyntheticEvent, props: DropdownProps) {
    (this.props.details as RoverRuckusMatchDetails).redEndRobotOneStatus = parseInt(props.value + "", 10);
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
  }

  private modifyRobotTwoEndgame(event: SyntheticEvent, props: DropdownProps) {
    (this.props.details as RoverRuckusMatchDetails).redEndRobotTwoStatus = parseInt(props.value + "", 10);
    this.props.match.redScore = this.props.details.getRedScore(this.props.match.blueMinPen, this.props.match.blueMajPen);
    this.forceUpdate();
  }

  private modifyMinorPenalties(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      this.props.match.redMinPen = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
      this.props.setActiveDetails(new RoverRuckusMatchDetails().fromJSON(this.props.details.toJSON()));
      this.forceUpdate();
    }
  }

  private modifyMajorPenalties(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(props.value) && parseInt(props.value, 10) >= 0) {
      this.props.match.redMajPen = parseInt(props.value, 10);
      this.props.match.blueScore = this.props.details.getBlueScore(this.props.match.redMinPen, this.props.match.redMajPen);
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
    setActiveDetails: (details: MatchDetails) => dispatch(setActiveDetails(details))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RoverRuckusRedScorecard as any);