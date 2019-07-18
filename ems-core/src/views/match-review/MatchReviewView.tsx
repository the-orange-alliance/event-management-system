import * as React from "react";
import {Button, Card, Dimmer, DropdownProps, Form, Grid, Loader} from "semantic-ui-react";
import GameSpecificScorecard from "../../components/GameSpecificScorecard";
import {ApplicationActions, IApplicationState} from "../../stores";
import {connect} from "react-redux";
import {getTheme} from "../../AppTheme";
import {SyntheticEvent} from "react";
import MatchManager from "../../managers/MatchManager";
import {ISetActiveDetails, ISetActiveMatch, ISetActiveParticipants} from "../../stores/scoring/types";
import {Dispatch} from "redux";
import {setActiveDetails, setActiveMatch, setActiveParticipants} from "../../stores/scoring/actions";
import DialogManager from "../../managers/DialogManager";
import {IDisableNavigation, ISetEliminationsMatches} from "../../stores/internal/types";
import {disableNavigation, setEliminationsMatches} from "../../stores/internal/actions";
import ConfirmActionModal from "../../components/ConfirmActionModal";
import TOAUploadManager from "../../managers/TOAUploadManager";
import {Event, EventConfiguration, HttpError, Match, MatchDetails, MatchParticipant,
  PlayoffsType, TournamentType, TOAConfig
} from "@the-orange-alliance/lib-ems";

interface IProps {
  event?: Event,
  toaConfig?: TOAConfig,
  eventConfig?: EventConfiguration,
  practiceMatches?: Match[],
  qualificationMatches?: Match[],
  finalsMatches?: Match[],
  elimsMatches?: Match[],
  activeMatch?: Match,
  activeDetails?: MatchDetails,
  activeParticipants?: MatchParticipant[],
  setActiveMatch?: (match: Match) => ISetActiveMatch,
  setActiveDetails?: (details: MatchDetails) => ISetActiveDetails,
  setActiveParticipants?: (participants: MatchParticipant[]) => ISetActiveParticipants,
  setNavigationDisabled?: (disabled: boolean) => IDisableNavigation,
  setEliminationsMatches?: (match: Match[]) => ISetEliminationsMatches
}

interface IState {
  selectedLevel: TournamentType,
  updatingScores: boolean,
  confirmModalOpen: boolean,
  loadingMatch: boolean
}

class MatchReviewView extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedLevel: "Practice",
      updatingScores: false,
      confirmModalOpen: false,
      loadingMatch: false
    };
    this.changeSelectedLevel = this.changeSelectedLevel.bind(this);
    this.changeSelectedMatch = this.changeSelectedMatch.bind(this);
    this.openConfirmModal = this.openConfirmModal.bind(this);
    this.closeConfirmModal = this.closeConfirmModal.bind(this);
    this.updateScores = this.updateScores.bind(this);
  }

  public render() {
    const {eventConfig, activeMatch} = this.props;
    const {selectedLevel, updatingScores, confirmModalOpen, loadingMatch} = this.state;

    const availableLevels = this.getAvailableTournamentLevels(eventConfig.playoffsConfig).map(tournamentLevel => {
      return {
        text: tournamentLevel,
        value: tournamentLevel
      };
    });

    const availableMatches = this.getMatchesByTournamentLevel(selectedLevel).map(match => {
      return {
        text: match.matchName,
        value: match.matchKey
      };
    });
    const selectedMatch: Match = activeMatch === null ? new Match() : activeMatch;
    return (
      <div className="view">
        <ConfirmActionModal open={confirmModalOpen} onClose={this.closeConfirmModal} onConfirm={this.updateScores} innerText={`Are you sure you want to update the scores for ${selectedMatch.matchName}? (${selectedMatch.matchKey})`}/>
        <Card fluid={true} color={getTheme().secondary}>
          <Card.Content>
            <Grid columns={16}>
              <Grid.Row>
                <Grid.Column width={3}><Form.Dropdown fluid={true} selection={true} disabled={updatingScores} value={selectedLevel} options={availableLevels} onChange={this.changeSelectedLevel} label="Tournament Level"/></Grid.Column>
                <Grid.Column width={3}><Form.Dropdown fluid={true} selection={true} disabled={updatingScores} value={selectedMatch.matchKey} options={availableMatches} onChange={this.changeSelectedMatch} label="Match"/></Grid.Column>
                <Grid.Column width={7}/>
                <Grid.Column width={3} verticalAlign={"bottom"}><Button fluid={true} color="red" disabled={selectedMatch === null || typeof selectedMatch === "undefined" || updatingScores} loading={updatingScores} onClick={this.openConfirmModal}>Update Scores</Button></Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Content>
        </Card>
        <Card.Group itemsPerRow={2}>
          <Dimmer active={updatingScores}>
            <Loader/>
          </Dimmer>
          <GameSpecificScorecard type={eventConfig.eventType} alliance={"Red"} loading={loadingMatch}/>
          <GameSpecificScorecard type={eventConfig.eventType} alliance={"Blue"} loading={loadingMatch}/>
        </Card.Group>
      </div>
    );
  }

  private openConfirmModal() {
    this.setState({confirmModalOpen: true});
  }

  private closeConfirmModal() {
    this.setState({confirmModalOpen: false});
  }

  private getAvailableTournamentLevels(postQualConfig: PlayoffsType): TournamentType[] {
    return ["Practice", "Qualification", postQualConfig === "elims" ? "Eliminations" : "Finals"];
  }

  private getMatchesByTournamentLevel(tournamentLevel: TournamentType): Match[] { // TODO - Only show fields that EMS controls
    switch (tournamentLevel) {
      case "Practice":
        return this.props.practiceMatches.filter(match => this.props.eventConfig.fieldsControlled.indexOf(match.fieldNumber) > -1);
      case "Qualification":
        return this.props.qualificationMatches.filter(match => this.props.eventConfig.fieldsControlled.indexOf(match.fieldNumber) > -1);
      case "Finals":
        return this.props.finalsMatches.filter(match => this.props.eventConfig.fieldsControlled.indexOf(match.fieldNumber) > -1);
      case "Eliminations":
        return this.props.elimsMatches.filter(match => this.props.eventConfig.fieldsControlled.indexOf(match.fieldNumber) > -1);
      default:
        return [];
    }
  }

  private changeSelectedLevel(event: SyntheticEvent, props: DropdownProps) {
    const matches = this.getMatchesByTournamentLevel((props.value as TournamentType));
    if (matches.length > 0) {
      this.props.setActiveMatch(matches[0]);
      this.setState({
        selectedLevel: (props.value as TournamentType),
      });
    } else {
      this.setState({
        selectedLevel: (props.value as TournamentType)
      });
    }
  }

  private changeSelectedMatch(event: SyntheticEvent, props: DropdownProps) {
    for (const match of this.getMatchesByTournamentLevel(this.state.selectedLevel)) {
      if (match.matchKey === (props.value as string)) {
        this.props.setActiveMatch(match);
        // Temporarily set the match to what we have now, and then get ALL the details.
        MatchManager.getMatchResults(match.matchKey).then((data: Match) => {
          this.props.setActiveMatch(data);
          this.props.setActiveParticipants(data.participants);
          this.props.setActiveDetails(data.matchDetails);
        });
        break;
      }
    }
  }

  private updateScores() {
    // Make sure all of our 'active' objects are on the same page.
    this.setState({updatingScores: true, confirmModalOpen: false});
    this.props.activeMatch.matchDetails = this.props.activeDetails;
    this.props.activeMatch.participants = this.props.activeParticipants;
    if (this.props.toaConfig.enabled) {
      TOAUploadManager.postMatchResults(this.props.event.eventKey, this.props.activeMatch).then(() => {
        console.log(`Uploaded match results for ${this.props.activeMatch.matchKey}`);
      }).catch((error: HttpError) => {
        DialogManager.showErrorBox(error);
      });
    }
    MatchManager.commitScores(this.props.activeMatch, this.props.eventConfig).then(() => {
      this.props.setNavigationDisabled(false);
      this.setState({updatingScores: false});
      if (this.props.activeMatch.tournamentLevel >= 10) {
        MatchManager.checkForAdvancements(this.props.activeMatch.tournamentLevel, this.props.eventConfig.elimsFormat).then((matches: Match[]) => {
          if (this.props.elimsMatches.length < matches.length) {
            this.props.setEliminationsMatches(matches);
          }
        }).catch((error: HttpError) => {
          console.error(error);
        });
      }
    }).catch((error: HttpError) => {
      this.setState({updatingScores: false});
      DialogManager.showErrorBox(error);
    });
  }
}

export function mapStateToProps({configState, internalState, scoringState}: IApplicationState) {
  return {
    event: configState.event,
    toaConfig: configState.toaConfig,
    eventConfig: configState.eventConfiguration,
    practiceMatches: internalState.practiceMatches,
    qualificationMatches: internalState.qualificationMatches,
    finalsMatches: internalState.finalsMatches,
    elimsMatches: internalState.eliminationsMatches,
    activeMatch: scoringState.activeMatch,
    activeDetails: scoringState.activeDetails,
    activeParticipants: scoringState.activeParticipants
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setActiveMatch: (match: Match) => dispatch(setActiveMatch(match)),
    setActiveDetails: (details: MatchDetails) => dispatch(setActiveDetails(details)),
    setActiveParticipants: (participants: MatchParticipant[]) => dispatch(setActiveParticipants(participants)),
    setNavigationDisabled: (disabled: boolean) => dispatch(disableNavigation(disabled)),
    setEliminationsMatches: (matches: Match[]) => dispatch(setEliminationsMatches(matches))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchReviewView);