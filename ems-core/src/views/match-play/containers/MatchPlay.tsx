import * as React from "react";
import {SyntheticEvent} from "react";
import {Button, Card, Divider, DropdownProps, Form, Grid, Tab} from "semantic-ui-react";
import {ApplicationActions, IApplicationState} from "../../../stores";
import {connect} from "react-redux";
import MatchPlayTimerConfiguration from "../../../components/MatchPlayTimerConfiguration";
import {
  ISetActiveDetails,
  ISetActiveMatch,
  ISetActiveParticipants,
  ISetMatchState
} from "../../../stores/scoring/types";
import {Dispatch} from "redux";
import {setActiveDetails, setActiveMatch, setActiveParticipants, setMatchState} from "../../../stores/scoring/actions";
import MatchManager from "../../../managers/MatchManager";
import * as moment from "moment";
import DialogManager from "../../../managers/DialogManager";
import {IDisableNavigation, ISetEliminationsMatches} from "../../../stores/internal/types";
import {disableNavigation, setEliminationsMatches} from "../../../stores/internal/actions";
import GameSpecificScorecard from "../../../components/GameSpecificScorecard";
import TOAUploadManager from "../../../managers/TOAUploadManager";
import {Event, EventConfiguration, HttpError, Match, MatchDetails, MatchConfiguration, MatchParticipant,
  MatchState, MatchTimer, PlayoffsType, SocketProvider, TOAConfig, TournamentType
} from "@the-orange-alliance/lib-ems";
import InternalStateManager from "../../../managers/InternalStateManager";
import ConfirmActionModal from "../../../components/ConfirmActionModal";

interface IProps {
  mode: string,
  timer: MatchTimer,
  activeMatch?: Match,
  activeDetails?: MatchDetails,
  activeParticipants?: MatchParticipant[],
  event?: Event,
  toaConfig?: TOAConfig,
  backupDir?: string,
  eventConfig?: EventConfiguration,
  matchConfig?: MatchConfiguration,
  matchState?: MatchState,
  testMatches: Match[],
  practiceMatches: Match[],
  qualificationMatches: Match[],
  finalsMatches: Match[],
  elimsMatches: Match[],
  connected: boolean,
  matchDuration?: moment.Duration,
  setMatchState?: (matchState: MatchState) => ISetMatchState,
  setNavigationDisabled?: (disabled: boolean) => IDisableNavigation,
  setActiveMatch?: (match: Match) => ISetActiveMatch,
  setActiveParticipants?: (participants: MatchParticipant[]) => ISetActiveParticipants,
  setActiveDetails?: (details: MatchDetails) => ISetActiveDetails,
  setEliminationsMatches?: (matches: Match[]) => ISetEliminationsMatches
}

interface IState {
  selectedLevel: TournamentType
  configModalOpen: boolean,
  activeMatch: Match,
  committingScores: boolean,
  loadingMatch: boolean,
  differentTeamModalOpen: boolean
}

class MatchPlay extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedLevel: "Practice",
      configModalOpen: false,
      activeMatch: this.props.activeMatch,
      committingScores: false,
      loadingMatch: true,
      differentTeamModalOpen: false
    };
    this.changeSelectedLevel = this.changeSelectedLevel.bind(this);
    this.changeSelectedMatch = this.changeSelectedMatch.bind(this);
    this.changeSelectedField = this.changeSelectedField.bind(this);

    this.beginPrestart = this.beginPrestart.bind(this);
    this.cancelPrestart = this.cancelPrestart.bind(this);
    this.prestart = this.prestart.bind(this);
    this.setAudienceDisplay = this.setAudienceDisplay.bind(this);
    this.startMatch = this.startMatch.bind(this);
    this.abortMatch = this.abortMatch.bind(this);
    this.commitScores = this.commitScores.bind(this);

    this.openDifferentTeamModal = this.openDifferentTeamModal.bind(this);
    this.closeDifferentTeamModal = this.closeDifferentTeamModal.bind(this);
  }

  public componentDidMount() {
    setTimeout(() => {
      if (this.props.elimsMatches.length > 0) {
        this.changeSelectedMatch(null, {value: this.props.elimsMatches[0].matchKey});
      } else if (this.props.qualificationMatches.length > 0) {
        this.changeSelectedLevel(null, {value: "Qualification"});
        this.changeSelectedMatch(null, {value: this.props.qualificationMatches[0].matchKey});
      } else if (this.props.practiceMatches.length > 0) {
        this.changeSelectedLevel(null, {value: "Practice"});
        this.changeSelectedMatch(null, {value: this.props.practiceMatches[0].matchKey});
      } else if (this.props.testMatches.length > 0) {
        this.changeSelectedLevel(null, {value: "Test"});
        this.changeSelectedMatch(null, {value: this.props.testMatches[0].matchKey});
      }
    }, 250); // Gives the renderer process a chance to catch up.
  }

  public render() {
    const {selectedLevel, committingScores, loadingMatch, differentTeamModalOpen} = this.state;
    const {eventConfig, matchState, connected, matchDuration, mode} = this.props;
    const fieldControl: number[] = (typeof eventConfig.fieldsControlled === "undefined" ? [1] : eventConfig.fieldsControlled);

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

    const availableFields = fieldControl.map(fieldNumber => {
      return {
        text: "Field " + fieldNumber,
        value: fieldNumber
      };
    });

    const activeMatch: Match = this.props.activeMatch === null ? new Match() : this.props.activeMatch;
    const disabledStates = MatchManager.getDisabledStates(this.props.matchState);
    const hasRedAlliance = typeof activeMatch.participants !== "undefined" && activeMatch.participants.filter((participant) => participant.station < 20).length > 0;
    const hasBlueAlliance = typeof activeMatch.participants !== "undefined" && activeMatch.participants.filter((participant) => participant.station >= 20).length > 0;
    const canPrestart = activeMatch.matchKey.length > 0 && activeMatch.fieldNumber > 0 && typeof activeMatch.participants !== null && hasRedAlliance && hasBlueAlliance && connected && !loadingMatch;
    const hasPrestarted = matchState !== MatchState.PRESTART_READY && matchState !== MatchState.PRESTART_IN_PROGRESS && matchState !== MatchState.MATCH_ABORTED;
    const disMin = matchDuration.minutes() < 10 ? "0" + matchDuration.minutes().toString() : matchDuration.minutes().toString();
    const disSec = matchDuration.seconds() < 10 ? "0" + matchDuration.seconds().toString() : matchDuration.seconds().toString();

    return (
      <Tab.Pane className="tab-subview">
        <ConfirmActionModal open={differentTeamModalOpen} onClose={this.closeDifferentTeamModal} onConfirm={this.prestart.bind(this, true)} innerText={"You are about to prestart a match with a different team selected. Are you sure you want to do this?"}/>
        <Grid columns="equal">
          <Grid.Row>
            <Grid.Column textAlign="left"><b>Match Status: </b>{matchState}</Grid.Column>
            <Grid.Column textAlign="center"><b>{disMin}:{disSec} </b>({mode})</Grid.Column>
            <Grid.Column textAlign="right"><b>Connection Status: </b><span className={connected ? "success-text" : "error-text"}>{connected ? "OKAY" : "NO CONNECTION"}</span></Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider/>
        <Grid columns={16} centered={true}>
          <Grid.Row>
            {
              hasPrestarted &&
              <Grid.Column width={3}><Button fluid={true} disabled={disabledStates[0]} color="red" onClick={this.cancelPrestart}>Cancel Prestart</Button></Grid.Column>
            }
            {
              !hasPrestarted &&
              <Grid.Column width={3}><Button fluid={true} disabled={disabledStates[0] || !canPrestart} color="orange" onClick={this.beginPrestart}>Prestart</Button></Grid.Column>
            }
            <Grid.Column width={3}><Button fluid={true} disabled={disabledStates[1]} color="blue" onClick={this.setAudienceDisplay}>Set Audience Display</Button></Grid.Column>
            <Grid.Column width={3}><Button fluid={true} disabled={disabledStates[2]} color="purple" onClick={this.startMatch}>Start Match</Button></Grid.Column>
            <Grid.Column width={3}><Button fluid={true} disabled={disabledStates[3]} color="red" onClick={this.abortMatch}>Abort Match</Button></Grid.Column>
            <Grid.Column width={3}><Button fluid={true} disabled={disabledStates[4]} loading={committingScores} color="green" onClick={this.commitScores}>Commit Scores</Button></Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider/>
        <Card.Group itemsPerRow={3}>
          <Card fluid={true}>
            <Card.Content className="center-items card-header"><Card.Header>Match Configuration</Card.Header></Card.Content>
            <Card.Content>
              <Form>
                <Grid columns={16}>
                  <Grid.Row>
                    <Grid.Column computer={16} largeScreen={8} widescreen={6}><Form.Dropdown disabled={hasPrestarted} fluid={true} selection={true} value={selectedLevel} options={availableLevels} onChange={this.changeSelectedLevel} label="Tournament Level"/></Grid.Column>
                    <Grid.Column computer={16} largeScreen={8} widescreen={6}><Form.Dropdown disabled={hasPrestarted} fluid={true} selection={true} value={activeMatch.matchKey} options={availableMatches} onChange={this.changeSelectedMatch} label="Match"/></Grid.Column>
                    <Grid.Column computer={16} largeScreen={6} widescreen={4}><Form.Dropdown disabled={hasPrestarted} fluid={true} selection={true} value={activeMatch.fieldNumber} options={availableFields} onChange={this.changeSelectedField} label="Field"/></Grid.Column>
                  </Grid.Row>
                  <Divider/>
                </Grid>
                <MatchPlayTimerConfiguration/>
              </Form>
            </Card.Content>
          </Card>
          <GameSpecificScorecard type={eventConfig.eventType} alliance={"Red"} loading={loadingMatch}/>
          <GameSpecificScorecard type={eventConfig.eventType} alliance={"Blue"} loading={loadingMatch}/>
        </Card.Group>
      </Tab.Pane>
    );
  }

  private cancelPrestart() {
    MatchManager.cancelPrestart();
    this.props.setNavigationDisabled(false);
    this.props.setMatchState(MatchState.PRESTART_READY);
  }

  private beginPrestart() {
    const participantKeys: number[] = this.props.activeMatch.participants.map((p: MatchParticipant) => p.teamKey);
    const activeParticipantKeys: number[] = this.props.activeParticipants.map((p: MatchParticipant) => p.teamKey);
    let changedParticipants: boolean = false;
    for (let i = 0; i < participantKeys.length; i++) {
      if (!(participantKeys[i] === activeParticipantKeys[i])) {
        // Participants were changed and we need to address this.
        changedParticipants = true;
      }
    }
    if (changedParticipants) {
      this.openDifferentTeamModal();
    } else {
      this.prestart();
    }
  }

  private prestart(differentTeams?: boolean) {
    if (this.state.differentTeamModalOpen) {
      this.closeDifferentTeamModal();
    }

    this.props.setNavigationDisabled(true);
    this.props.setMatchState(MatchState.PRESTART_IN_PROGRESS);
    this.props.activeMatch.active = 1; // TODO - Change activeID... if this even ends up mattering...
    // This dereferences the participants, so we may perform the above checks again safely.
    this.props.activeMatch.participants = this.props.activeParticipants.map((p: MatchParticipant) => new MatchParticipant().fromJSON(p.toJSON()));
    console.log("Prestarting match " + this.props.activeMatch.matchKey + "...");
    MatchManager.prestart(this.props.activeMatch, differentTeams).then(() => {
      this.props.setActiveDetails(this.props.activeMatch.matchDetails);
      this.props.setMatchState(MatchState.PRESTART_COMPLETE);
    }).catch((error: HttpError) => {
      this.cancelPrestart();
      this.props.setMatchState(MatchState.PRESTART_READY);
      DialogManager.showErrorBox(error);
    });
  }

  private setAudienceDisplay() {
    MatchManager.setAudienceDisplay().then(() => {
      console.log(this.props.activeMatch.matchKey);
      this.props.setMatchState(MatchState.AUDIENCE_DISPLAY_SET);
    });
  }

  private startMatch() {
    SocketProvider.once("match-start", (timerJSON: any) => {
      this.props.timer.matchConfig = new MatchConfiguration().fromJSON(timerJSON);
      this.props.timer.start();
    });
    SocketProvider.once("match-end", () => {
      console.log(this.props.activeMatch.matchKey);
      this.props.setMatchState(MatchState.MATCH_COMPLETE);
      SocketProvider.off("score-update");
    });
    SocketProvider.on("score-update", (matchJSON: any) => {
      const match: Match = new Match().fromJSON(matchJSON);

      this.state.activeMatch.redScore = match.redScore;
      this.state.activeMatch.redMinPen = match.redMinPen;
      this.state.activeMatch.redMajPen = match.redMajPen;
      this.state.activeMatch.blueScore = match.blueScore;
      this.state.activeMatch.blueMinPen = match.blueMinPen;
      this.state.activeMatch.blueMajPen = match.blueMajPen;

      if (typeof matchJSON.details !== "undefined") {
        const seasonKey: string = match.matchKey.split("-")[0];
        match.matchDetails = Match.getDetailsFromSeasonKey(seasonKey).fromJSON(matchJSON.details);
      }

      if (typeof matchJSON.participants !== "undefined") {
        match.participants = matchJSON.participants.map((p: any) => new MatchParticipant().fromJSON(p));

        for (let i = 0; i < this.state.activeMatch.participants.length; i++) {
          this.state.activeMatch.participants[i].cardStatus = match.participants[i].cardStatus;
        }

        for (let i = 0; i < this.state.activeMatch.participants.length; i++) {
          if (typeof this.state.activeMatch.participants[i].team !== "undefined" && typeof match.participants !== "undefined") {
            match.participants[i].team = this.state.activeMatch.participants[i].team;
          }
        }
      }

      // Since everything is 'technically' pass-by-reference, updating activeMatch from activeMatch doesn't do anything.
      // Essentially, we are creating a different object with the same properties to properly update the scorecards.
      const oldActiveMatch: Match = new Match().fromJSON(this.state.activeMatch.toJSON());
      oldActiveMatch.matchDetails = match.matchDetails;
      oldActiveMatch.participants = match.participants;

      this.props.setActiveMatch(oldActiveMatch);
      this.props.setActiveDetails(oldActiveMatch.matchDetails);

      if (typeof oldActiveMatch.participants !== "undefined") {
        this.props.setActiveParticipants(oldActiveMatch.participants);
      }

    });
    MatchManager.startMatch().then(() => {
      this.props.setMatchState(MatchState.MATCH_IN_PROGRESS);
      this.forceUpdate();
      console.log(this.props.activeMatch.matchKey);
    });
  }

  private abortMatch() {
    this.props.setNavigationDisabled(false);
    SocketProvider.off("score-update");
    MatchManager.abortMatch().then(() => {
      SocketProvider.off("match-end");
      this.props.setMatchState(MatchState.MATCH_ABORTED);
    });
  }

  private commitScores() {
    // Make sure all of our 'active' objects are on the same page.
    this.setState({committingScores: true});
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
      this.props.setMatchState(MatchState.PRESTART_READY);
      this.setState({committingScores: false});
      const tournamentMatches: Match[] = this.getMatchesByTournamentLevel(this.state.selectedLevel);
      for (let i = 0; i < tournamentMatches.length; i++) {
        if (tournamentMatches[i].matchKey === this.props.activeMatch.matchKey && typeof tournamentMatches[i + 1] !== "undefined") {
          this.changeSelectedMatch(null, {value: tournamentMatches[i + 1].matchKey});
          break;
        }
      }
      if (this.props.activeMatch.tournamentLevel >= 10) {
        MatchManager.checkForAdvancements(this.props.activeMatch.tournamentLevel, this.props.eventConfig.elimsFormat).then((matches: Match[]) => {
          if (this.props.elimsMatches.length < matches.length) {
            this.props.setEliminationsMatches(matches);
          }
          if (this.props.backupDir.length > 0) {
            InternalStateManager.createBackup(this.props.backupDir);
          }
        }).catch((error: HttpError) => {
          console.error(error);
        });
      } else {
        if (this.props.backupDir.length > 0) {
          InternalStateManager.createBackup(this.props.backupDir);
        }
      }
    }).catch((error: HttpError) => {
      this.setState({committingScores: false});
      DialogManager.showErrorBox(error);
    });
  }

  private getAvailableTournamentLevels(postQualConfig: PlayoffsType): TournamentType[] {
    return ["Test", "Practice", "Qualification", postQualConfig === "elims" ? "Eliminations" : "Finals"];
  }

  private getMatchesByTournamentLevel(tournamentLevel: TournamentType): Match[] { // TODO - Only show fields that EMS controls
    switch (tournamentLevel) {
      case "Test":
        return this.props.testMatches;
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
      this.setState({
        selectedLevel: (props.value as TournamentType),
      }, () => {
        this.changeSelectedMatch(null, {value: matches[0].matchKey});
      });
    } else {
      this.setState({
        selectedLevel: (props.value as TournamentType)
      });
    }
  }

  private changeSelectedMatch(event: SyntheticEvent, props: DropdownProps) {
    this.setState({loadingMatch: true});
    const matchPromise = new Promise((resolve, reject) => {
      for (const match of this.getMatchesByTournamentLevel(this.state.selectedLevel)) {
        if (match.matchKey === (props.value as string)) {
          this.props.setActiveMatch(match);
          this.setState({activeMatch: match});
          // Temporarily set the match to what we have now, and then get ALL the details.
          MatchManager.getMatchResults(match.matchKey).then((data: Match) => {
            const participants: MatchParticipant[] = [];
            for (let i = 0; i < match.participants.length; i++) {
              const participant: MatchParticipant = match.participants[i];
              if (typeof data.participants[i] !== "undefined") {
                if (participant.teamKey !== data.participants[i].teamKey) {
                  participants.push(data.participants[i]);
                } else {
                  participant.cardStatus = data.participants[i].cardStatus;
                  console.log("data.participant", participant.cardStatus, data.participants[i].cardStatus);
                  participants.push(participant);
                }
              } else {
                console.log("participant", participant.cardStatus, data.participants[i].cardStatus);
                participants.push(participant);
              }
            }
            data.participants = participants.map((p: MatchParticipant) => new MatchParticipant().fromJSON(p.toJSON()));

            this.props.setActiveMatch(data);
            this.props.setActiveParticipants(participants);
            this.props.setActiveDetails(data.matchDetails);
            this.setState({activeMatch: data});
            resolve();
          });
          break;
        }
      }
    });
    matchPromise.then(() => this.setState({loadingMatch: false}));
  }

  private changeSelectedField(event: SyntheticEvent, props: DropdownProps) {
    this.props.activeMatch.fieldNumber = props.value as number;
    this.forceUpdate();
  }

  private openDifferentTeamModal() {
    this.setState({differentTeamModalOpen: true});
  }

  private closeDifferentTeamModal() {
    this.setState({differentTeamModalOpen: false});
  }
}

export function mapStateToProps({configState, internalState, scoringState}: IApplicationState) {
  return {
    activeMatch: scoringState.activeMatch,
    activeDetails: scoringState.activeDetails,
    activeParticipants: scoringState.activeParticipants,
    event: configState.event,
    toaConfig: configState.toaConfig,
    backupDir: configState.backupDir,
    eventConfig: configState.eventConfiguration,
    matchConfig: configState.matchConfig,
    matchState: scoringState.matchState,
    testMatches: internalState.testMatches,
    practiceMatches: internalState.practiceMatches,
    qualificationMatches: internalState.qualificationMatches,
    finalsMatches: internalState.finalsMatches,
    elimsMatches: internalState.eliminationsMatches,
    connected: internalState.socketConnected,
    matchDuration: scoringState.matchDuration
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setMatchState: (matchState: MatchState) => dispatch(setMatchState(matchState)),
    setNavigationDisabled: (disabled: boolean) => dispatch(disableNavigation(disabled)),
    setActiveMatch: (match: Match) => dispatch(setActiveMatch(match)),
    setActiveParticipants: (participants: MatchParticipant[]) => dispatch(setActiveParticipants(participants)),
    setActiveDetails: (details: MatchDetails) => dispatch(setActiveDetails(details)),
    setEliminationsMatches: (matches: Match[]) => dispatch(setEliminationsMatches(matches))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchPlay);