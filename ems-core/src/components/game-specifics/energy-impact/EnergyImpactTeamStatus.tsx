import * as React from "react";
import {Button, Grid, SemanticCOLORS} from "semantic-ui-react";
import {ApplicationActions, IApplicationState} from "../../../stores";
import {connect} from "react-redux";
import {IUpdateParticipantStatus} from "../../../stores/scoring/types";
import {Dispatch} from "redux";
import {updateParticipantStatus} from "../../../stores/scoring/actions";
import {AllianceColor, EventConfiguration, Match, MatchParticipant, MatchState} from "@the-orange-alliance/lib-ems";

interface IProps {
  alliance: AllianceColor,
  eventConfig?: EventConfiguration,
  activeMatch?: Match,
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

    const teamsView = teams.map((team, index) => {
      let displayName: any = team.teamKey;
      if (typeof team.team !== "undefined") {
        displayName = team.team.getFromIdentifier(this.props.eventConfig.teamIdentifier);
      }
      return (
        <Grid.Row key={index} className="no-margin">
          <Grid.Column width={10} className="center-left-items">{displayName}</Grid.Column>
          <Grid.Column width={6}><Button onClick={this.changeCardStatus.bind(this, index)} disabled={disabled} color={this.getButtonColor(team.cardStatus)} fluid={true}>{this.getButtonText(team.cardStatus)}</Button></Grid.Column>
        </Grid.Row>
      );
    });

    return (
      <Grid columns={16}>
        {teamsView}
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
        return this.props.activeParticipants.filter((participant) => participant.station < 20);
      } else {
        return this.props.activeParticipants.filter((participant) => participant.station >= 20);
      }
    }
  }
}

export function mapStateToProps({configState, scoringState}: IApplicationState) {
  return {
    eventConfig: configState.eventConfiguration,
    activeMatch: scoringState.activeMatch,
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