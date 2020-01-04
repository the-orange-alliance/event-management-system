import * as React from "react";
import {Button, Card, Checkbox, CheckboxProps, Dimmer, DropdownProps, Form, Grid, Loader} from "semantic-ui-react";
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
import {IDisableNavigation} from "../../stores/internal/types";
import {disableNavigation} from "../../stores/internal/actions";
import ConfirmActionModal from "../../components/ConfirmActionModal";
import {
  Event, EventConfiguration, HttpError, Match, MatchDetails, MatchParticipant,
  TournamentType, TOAConfig, EliminationMatchesFormat
} from "@the-orange-alliance/lib-ems";
import UploadManager from "../../managers/UploadManager";

interface IProps {
  event?: Event,
  toaConfig?: TOAConfig,
  eventConfig?: EventConfiguration,
  practiceMatches?: Match[],
  qualificationMatches?: Match[],
  playoffsMatches?: Match[],
  activeMatch?: Match,
  activeDetails?: MatchDetails,
  activeParticipants?: MatchParticipant[],
  setActiveMatch?: (match: Match) => ISetActiveMatch,
  setActiveDetails?: (details: MatchDetails) => ISetActiveDetails,
  setActiveParticipants?: (participants: MatchParticipant[]) => ISetActiveParticipants,
  setNavigationDisabled?: (disabled: boolean) => IDisableNavigation
}

interface IState {
  selectedLevel: TournamentType,
  updatingScores: boolean,
  confirmModalOpen: boolean,
  loadingMatch: boolean,
  updateAudience: boolean
}

class MatchReviewView extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedLevel: "Practice",
      updatingScores: false,
      confirmModalOpen: false,
      loadingMatch: true,
      updateAudience: false
    };
    this.changeSelectedLevel = this.changeSelectedLevel.bind(this);
    this.changeSelectedMatch = this.changeSelectedMatch.bind(this);
    this.openConfirmModal = this.openConfirmModal.bind(this);
    this.closeConfirmModal = this.closeConfirmModal.bind(this);
    this.updateScores = this.updateScores.bind(this);
    this.onUpdateAudience = this.onUpdateAudience.bind(this);
  }

  public componentDidMount() {
    setTimeout(() => {
      if (this.props.playoffsMatches.length > 0) {
        this.changeSelectedMatch(null, {value: this.props.playoffsMatches[0].matchKey});
      } else if (this.props.qualificationMatches.length > 0) {
        this.changeSelectedLevel(null, {value: "Qualification"});
        this.changeSelectedMatch(null, {value: this.props.qualificationMatches[0].matchKey});
      } else if (this.props.practiceMatches.length > 0) {
        this.changeSelectedLevel(null, {value: "Practice"});
        this.changeSelectedMatch(null, {value: this.props.practiceMatches[0].matchKey});
      }
    }, 250); // Gives the renderer process a chance to catch up.
  }

  public render() {
    const {eventConfig, activeMatch} = this.props;
    const {selectedLevel, updatingScores, confirmModalOpen, loadingMatch, updateAudience} = this.state;

    const availableLevels = this.getAvailableTournamentLevels().map(tournamentLevel => {
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
                <Grid.Column width={4}/>
                <Grid.Column width={3} verticalAlign={"bottom"}><Checkbox label={"Update Audience?"} checked={updateAudience} onChange={this.onUpdateAudience}/></Grid.Column>
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

  private getAvailableTournamentLevels(): TournamentType[] {
    const {playoffsMatches} = this.props;
    const hasRoundRobin: boolean = playoffsMatches.filter(match => match.tournamentLevel === Match.ROUND_ROBIN_LEVEL).length > 0;
    const hasRanking: boolean = playoffsMatches.filter(match => match.tournamentLevel === Match.FINALS_LEVEL).length > 0;
    const hasEliminations: boolean = playoffsMatches.filter(match => match.tournamentLevel >= Match.OCTOFINALS_LEVEL).length > 0;

    const levels: TournamentType[] = ["Practice", "Qualification"];

    if (hasRoundRobin) {
      levels.push("Round Robin");
    }
    if (hasRanking) {
      levels.push("Ranking");
    }
    if (hasEliminations) {
      levels.push("Eliminations");
    }

    return levels;
  }

  private getMatchesByTournamentLevel(tournamentLevel: TournamentType): Match[] {
    switch (tournamentLevel) {
      case "Practice":
        return this.props.practiceMatches.filter(match => this.props.eventConfig.fieldsControlled.indexOf(match.fieldNumber) > -1);
      case "Qualification":
        return this.props.qualificationMatches.filter(match => this.props.eventConfig.fieldsControlled.indexOf(match.fieldNumber) > -1);
      case "Round Robin":
        return this.props.playoffsMatches.filter(
          match => this.props.eventConfig.fieldsControlled.indexOf(match.fieldNumber) > -1 &&
            match.tournamentLevel === Match.ROUND_ROBIN_LEVEL
        );
      case "Ranking":
        return this.props.playoffsMatches.filter(
          match => this.props.eventConfig.fieldsControlled.indexOf(match.fieldNumber) > -1 &&
            match.tournamentLevel === Match.FINALS_LEVEL
        );
      case "Eliminations":
        return this.props.playoffsMatches.filter(
          match => this.props.eventConfig.fieldsControlled.indexOf(match.fieldNumber) > -1 &&
            match.tournamentLevel >= 10
        );
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
    this.setState({loadingMatch: true});
    for (const match of this.getMatchesByTournamentLevel(this.state.selectedLevel)) {
      if (match.matchKey === (props.value as string)) {
        this.props.setActiveMatch(match);
        // Temporarily set the match to what we have now, and then get ALL the details.
        MatchManager.getMatchResults(match.matchKey).then((data: Match) => {
          this.props.setActiveMatch(data);
          this.props.setActiveParticipants(data.participants);
          this.props.setActiveDetails(data.matchDetails);
          this.setState({loadingMatch: false});
        });
        break;
      }
    }
  }

  private updateScores() {
    const {activeMatch, event, eventConfig} = this.props;
    const {updateAudience} = this.state;
    // Make sure all of our 'active' objects are on the same page.
    this.setState({updatingScores: true, confirmModalOpen: false});
    this.props.activeMatch.matchDetails = this.props.activeDetails;
    this.props.activeMatch.participants = this.props.activeParticipants;
    const updateDisplay: boolean = updateAudience ? updateAudience : false;
    MatchManager.commitScores(this.props.activeMatch, this.props.eventConfig, updateDisplay).then(() => {
      if (this.props.toaConfig.enabled) {
        UploadManager.postMatchResults(this.props.event.eventKey, this.props.activeMatch).then(() => {
          console.log(`Uploaded match results for ${this.props.activeMatch.matchKey}`);
        }).catch((error: HttpError) => {
          DialogManager.showErrorBox(error);
        });
      }

      this.props.setNavigationDisabled(false);
      this.setState({updatingScores: false});
      if (this.props.activeMatch.tournamentLevel >= 10 && eventConfig.activeTournamentID >= 0) {
        const tournamentRound = Array.isArray(eventConfig.tournament) ? eventConfig.tournament[eventConfig.activeTournamentID] : eventConfig.tournament;
        MatchManager.checkForAdvancements(event.eventKey, tournamentRound.id, activeMatch.tournamentLevel, (tournamentRound.format as EliminationMatchesFormat).seriesType).then((matches: Match[]) => {
          // if (this.props.elimsMatches.length < matches.length) { // TODO - This needs to change.
          //   this.props.setEliminationsMatches(matches);
          // }
        }).catch((error: HttpError) => {
          console.error(error);
        });
      }
    }).catch((error: HttpError) => {
      this.setState({updatingScores: false});
      DialogManager.showErrorBox(error);
    });
  }

  private onUpdateAudience(event: React.SyntheticEvent, props: CheckboxProps) {
    this.setState({updateAudience: props.checked});
  }
}

export function mapStateToProps({configState, internalState, scoringState}: IApplicationState) {
  return {
    event: configState.event,
    toaConfig: configState.toaConfig,
    eventConfig: configState.eventConfiguration,
    practiceMatches: internalState.practiceMatches,
    qualificationMatches: internalState.qualificationMatches,
    playoffsMatches: internalState.playoffsMatches,
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
    setNavigationDisabled: (disabled: boolean) => dispatch(disableNavigation(disabled))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchReviewView);