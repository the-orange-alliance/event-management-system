import * as React from "react";
import {Button, Grid, SemanticCOLORS} from "semantic-ui-react";
import {AllianceColors} from "../../shared/AppTypes";
import {ApplicationActions, IApplicationState} from "../../stores";
import {connect} from "react-redux";
import {MatchState} from "../../shared/models/MatchState";
import MatchParticipant from "../../shared/models/MatchParticipant";
import EventConfiguration from "../../shared/models/EventConfiguration";
import {IUpdateParticipantStatus} from "../../stores/scoring/types";
import {Dispatch} from "redux";
import {updateParticipantStatus} from "../../stores/scoring/actions";

interface IProps {
  alliance: AllianceColors,
  eventConfig?: EventConfiguration
  activeParticipants?: MatchParticipant[],
  matchState?: MatchState,
  updateParticipantStatus?: (index: number, status: number) => IUpdateParticipantStatus
}

class EnergyImpactTeamStatus extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  // TODO - What if there are more than 3 teams? Should be easy to implement. Check match tournament level.
  public render() {
    const teams = this.getTeams();
    const disabled = this.props.matchState === MatchState.MATCH_IN_PROGRESS;
    let teamOneName: any = teams[0].teamKey;
    if (typeof teams[0].team !== "undefined") {
      teamOneName = teams[0].team.getFromIdentifier(this.props.eventConfig.teamIdentifier);
    }

    let teamTwoName: any = teams[1].teamKey;
    if (typeof teams[1].team !== "undefined") {
      teamTwoName = teams[1].team.getFromIdentifier(this.props.eventConfig.teamIdentifier);
    }

    let teamThreeName: any = teams[2].teamKey;
    if (typeof teams[2].team !== "undefined") {
      teamThreeName = teams[2].team.getFromIdentifier(this.props.eventConfig.teamIdentifier);
    }
    return (
      <Grid columns={16}>
        <Grid.Row className="no-margin">
          <Grid.Column width={10} className="center-left-items">{teamOneName}</Grid.Column>
          <Grid.Column width={6}><Button onClick={this.changeCardStatus.bind(this, 0)} disabled={disabled} color={this.getButtonColor(teams[0].cardStatus)} fluid={true}>{this.getButtonText(teams[0].cardStatus)}</Button></Grid.Column>
        </Grid.Row>
        <Grid.Row className="no-margin">
          <Grid.Column width={10} className="center-left-items">{teamTwoName}</Grid.Column>
          <Grid.Column width={6}><Button onClick={this.changeCardStatus.bind(this, 1)} disabled={disabled} color={this.getButtonColor(teams[1].cardStatus)} fluid={true}>{this.getButtonText(teams[1].cardStatus)}</Button></Grid.Column>
        </Grid.Row>
        <Grid.Row className="no-margin">
          <Grid.Column width={10} className="center-left-items">{teamThreeName}</Grid.Column>
          <Grid.Column width={6}><Button onClick={this.changeCardStatus.bind(this, 2)} disabled={disabled} color={this.getButtonColor(teams[2].cardStatus)} fluid={true}>{this.getButtonText(teams[2].cardStatus)}</Button></Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  private changeCardStatus(index: number) {
    if (this.props.activeParticipants !== null && typeof this.props.activeParticipants !== "undefined" && this.props.activeParticipants.length > 0) {
      index = this.props.alliance === "Red" ? index : index + (this.props.activeParticipants.length / 2);
      const participant: MatchParticipant = this.props.activeParticipants[index];
      switch (participant.cardStatus) {
        case 0:
          this.props.updateParticipantStatus(index, 1);
          break;
        case 1:
          this.props.updateParticipantStatus(index, 2);
          break;
        case 2:
          this.props.updateParticipantStatus(index, 0);
          break;
        default:
          this.props.updateParticipantStatus(index, 0);
      }
    }
  }

  private getButtonText(cardStatus: number): string {
    switch (cardStatus) {
      case 0:
        return "NO CARD";
      case 1:
        return "YELLOW CARD";
      case 2:
        return "RED CARD";
      default:
        return "NO CARD";
    }
  }

  private getButtonColor(cardStatus: number): SemanticCOLORS {
    switch (cardStatus) {
      case 0:
        return "grey";
      case 1:
        return "yellow";
      case 2:
        return "red";
      default:
        return "grey";
    }
  }

  private getTeams(): MatchParticipant[] {
    if (this.props.activeParticipants === null || typeof this.props.activeParticipants === "undefined" || this.props.activeParticipants.length === 0) {
      const participants: MatchParticipant[] = [];
      for (let i = 0; i < 3; i++) {
        const participant: MatchParticipant = new MatchParticipant();
        participant.teamKey = (i + 1);
        participant.cardStatus = 0;
        participants.push(participant);
      }
      return participants;
    } else {
      if (this.props.alliance === "Red") {
        const participants: MatchParticipant[] = [];
        for (let i = 0; i < (this.props.activeParticipants.length / 2); i++) {
          participants.push(this.props.activeParticipants[i]);
        }
        return participants;
      } else {
        const participants: MatchParticipant[] = [];
        for (let i = 3; i < this.props.activeParticipants.length; i++) {
          participants.push(this.props.activeParticipants[i]);
        }
        return participants;
      }
    }
  }
}

export function mapStateToProps({configState, scoringState}: IApplicationState) {
  return {
    eventConfig: configState.eventConfiguration,
    activeParticipants: scoringState.activeParticipants,
    matchState: scoringState.matchState
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    updateParticipantStatus: (index: number, status: number) => dispatch(updateParticipantStatus(index, status))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EnergyImpactTeamStatus);