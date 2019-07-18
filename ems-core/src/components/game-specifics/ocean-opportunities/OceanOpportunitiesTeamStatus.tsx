import * as React from "react";
import {AllianceColor, Match, MatchParticipant, MatchState} from "@the-orange-alliance/lib-ems";
import {ApplicationActions, IApplicationState} from "../../../stores";
import {connect} from "react-redux";
import {Button, DropdownProps, Form, Grid, SemanticCOLORS} from "semantic-ui-react";
import EventConfiguration from "@the-orange-alliance/lib-ems/dist/models/ems/EventConfiguration";
import Team from "@the-orange-alliance/lib-ems/dist/models/ems/Team";
import {SyntheticEvent} from "react";
import {IUpdateParticipantStatus} from "../../../stores/scoring/types";
import {updateParticipantStatus} from "../../../stores/scoring/actions";
import {Dispatch} from "redux";

interface IProps {
  alliance: AllianceColor,
  eventConfig?: EventConfiguration
  match?: Match,
  matchParticipants?: MatchParticipant[]
  matchState?: MatchState,
  teams?: Team[],
  updateParticipantStatus?: (index: number, status: number) => IUpdateParticipantStatus
}

class OceanOpportunitiesTeamStatus extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);

    this.updateParticipant = this.updateParticipant.bind(this);
  }

  public render() {
    const {alliance, matchParticipants} = this.props;
    const canChangeTeam = this.props.matchState === MatchState.PRESTART_READY;
    const disabled = this.props.matchState === MatchState.MATCH_IN_PROGRESS;
    const participants = matchParticipants.filter((p: MatchParticipant) => alliance === "Red" ? (p.station < 20) : (p.station >= 20));
    const teamsView = participants.map((p: MatchParticipant, index: number) => {
      return (
        <Grid.Row key={p.matchParticipantKey} className="match-play-team">
          <Grid.Column largeScreen={8} widescreen={10} className="center-left-items"><Form.Dropdown disabled={!canChangeTeam || disabled} fluid={true} search={true} selection={true} value={p.teamKey} options={this.getTeamOptions()} onChange={this.updateParticipant.bind(this, p)}/></Grid.Column>
          <Grid.Column largeScreen={8} widescreen={6}><Button onClick={this.changeCardStatus.bind(this, index)} disabled={disabled} color={this.getButtonColor(p.cardStatus)} fluid={true}>{this.getButtonText(p.cardStatus)}</Button></Grid.Column>
        </Grid.Row>
      );
    });

    return (
      <Grid columns={16}>
        {teamsView}
      </Grid>
    );
  }

  private updateParticipant(participant: MatchParticipant, event: SyntheticEvent, props: DropdownProps) {
    participant.teamKey = props.value as number;
    participant.team = this.props.teams.filter((t: Team) => t.teamKey === props.value as number)[0];
    this.forceUpdate();
  }

  private changeCardStatus(index: number) {
    if (this.props.matchParticipants !== null && typeof this.props.matchParticipants !== "undefined" && this.props.matchParticipants.length > 0) {
      index = this.props.alliance === "Red" ? index : index + (this.props.matchParticipants.length / 2);
      const participant: MatchParticipant = this.props.matchParticipants[index];
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

  private getTeamOptions() {
    const testTeam: Team = new Team();
    testTeam.teamKey = -1;
    testTeam.countryCode = "us";
    testTeam.country = "USA";
    testTeam.teamNameShort = "Test Team";

    const teamsCopy: Team[] = [testTeam, ...this.props.teams];

    return teamsCopy.map((t: Team) => {
      const displayName: any = t.getFromIdentifier(this.props.eventConfig.teamIdentifier);
      return {
        key: t.teamKey,
        value: t.teamKey,
        text: displayName
      };
    });
  }
}

function mapStateToProps({configState, internalState, scoringState}: IApplicationState) {
  return {
    eventConfig: configState.eventConfiguration,
    match: scoringState.activeMatch,
    matchParticipants: scoringState.activeParticipants,
    matchState: scoringState.matchState,
    teams: internalState.teamList
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    updateParticipantStatus: (index: number, status: number) => dispatch(updateParticipantStatus(index, status))
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(OceanOpportunitiesTeamStatus);