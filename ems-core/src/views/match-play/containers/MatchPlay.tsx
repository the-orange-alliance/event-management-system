import * as React from "react";
import {SyntheticEvent} from "react";
import {Button, Card, Divider, DropdownProps, Form, Grid, Tab} from "semantic-ui-react";
import Match from "../../../shared/models/Match";
import {ApplicationActions, IApplicationState} from "../../../stores";
import {connect} from "react-redux";
import EventConfiguration from "../../../shared/models/EventConfiguration";
import {PostQualConfig, TournamentLevels} from "../../../shared/AppTypes";
import MatchConfiguration from "../../../shared/models/MatchConfiguration";
import MatchPlayTimerConfiguration from "../../../components/MatchPlayTimerConfiguration";
import {MatchState} from "../../../shared/models/MatchState";
import {
  ISetActiveDetails,
  ISetActiveMatch,
  ISetActiveParticipants,
  ISetMatchState
} from "../../../stores/scoring/types";
import {Dispatch} from "redux";
import {setActiveDetails, setActiveMatch, setActiveParticipants, setMatchState} from "../../../stores/scoring/actions";
import MatchFlowController from "../controllers/MatchFlowController";
import * as moment from "moment";
import HttpError from "../../../shared/models/HttpError";
import DialogManager from "../../../shared/managers/DialogManager";
import SocketProvider from "../../../shared/providers/SocketProvider";
import {IDisableNavigation} from "../../../stores/internal/types";
import {disableNavigation} from "../../../stores/internal/actions";
import GameSpecificScorecard from "../../../components/GameSpecificScorecard";
import SocketMatch from "../../../shared/models/scoring/SocketMatch";
import EnergyImpactDetails from "../../../shared/models/scoring/EnergyImpactDetails";
import MatchParticipant from "../../../shared/models/MatchParticipant";
import MatchDetails from "../../../shared/models/MatchDetails";

interface IProps {
  activeMatch?: Match,
  activeDetails?: MatchDetails,
  activeParticipants?: MatchParticipant[]
  eventConfig?: EventConfiguration,
  matchConfig?: MatchConfiguration,
  matchState?: MatchState,
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
  setActiveDetails?: (details: MatchDetails) => ISetActiveDetails
}

interface IState {
  selectedLevel: TournamentLevels
  configModalOpen: boolean
}

class MatchPlay extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedLevel: "Practice",
      configModalOpen: false,
    };
    this.changeSelectedLevel = this.changeSelectedLevel.bind(this);
    this.changeSelectedMatch = this.changeSelectedMatch.bind(this);
    this.changeSelectedField = this.changeSelectedField.bind(this);

    this.cancelPrestart = this.cancelPrestart.bind(this);
    this.prestart = this.prestart.bind(this);
    this.setAudienceDisplay = this.setAudienceDisplay.bind(this);
    this.startMatch = this.startMatch.bind(this);
    this.abortMatch = this.abortMatch.bind(this);
    this.commitScores = this.commitScores.bind(this);
  }

  public render() {
    const {selectedLevel} = this.state;
    const {eventConfig, matchState, connected, matchDuration} = this.props;
    const fieldControl: number[] = (typeof eventConfig.fieldsControlled === "undefined" ? [1] : eventConfig.fieldsControlled);

    const availableLevels = this.getAvailableTournamentLevels(eventConfig.postQualConfig).map(tournamentLevel => {
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
    const disabledStates = MatchFlowController.getDisabledStates(this.props.matchState);
    const canPrestart = activeMatch.matchKey.length > 0 && activeMatch.fieldNumber > 0;
    const hasPrestarted = matchState !== MatchState.PRESTART_READY && matchState !== MatchState.PRESTART_IN_PROGRESS && matchState !== MatchState.MATCH_ABORTED;
    const disMin = matchDuration.minutes() < 10 ? "0" + matchDuration.minutes().toString() : matchDuration.minutes().toString();
    const disSec = matchDuration.seconds() < 10 ? "0" + matchDuration.seconds().toString() : matchDuration.seconds().toString();

    return (
      <Tab.Pane className="tab-subview">
        <Grid columns="equal">
          <Grid.Row>
            <Grid.Column textAlign="left"><b>Match Status: </b>{matchState}</Grid.Column>
            <Grid.Column textAlign="center"><b>{disMin}:{disSec} </b>(TELEOP)</Grid.Column>
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
              <Grid.Column width={3}><Button fluid={true} disabled={disabledStates[0] || !canPrestart} color="orange" onClick={this.prestart}>Prestart</Button></Grid.Column>
            }
            <Grid.Column width={3}><Button fluid={true} disabled={disabledStates[1]} color="blue" onClick={this.setAudienceDisplay}>Set Audience Display</Button></Grid.Column>
            <Grid.Column width={3}><Button fluid={true} disabled={disabledStates[2]} color="yellow" onClick={this.startMatch}>Start Match</Button></Grid.Column>
            <Grid.Column width={3}><Button fluid={true} disabled={disabledStates[3]} color="red" onClick={this.abortMatch}>Abort Match</Button></Grid.Column>
            <Grid.Column width={3}><Button fluid={true} disabled={disabledStates[4]} color="green" onClick={this.commitScores}>Commit Scores</Button></Grid.Column>
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
          <GameSpecificScorecard type={eventConfig.eventType} alliance={"Red"}/>
          <GameSpecificScorecard type={eventConfig.eventType} alliance={"Blue"}/>
        </Card.Group>
      </Tab.Pane>
    );
  }

  private cancelPrestart() {
    this.props.setNavigationDisabled(false);
    this.props.setMatchState(MatchState.PRESTART_READY);
  }

  private prestart() { // TODO - Emit field number that match is also prestarting on
    this.props.setNavigationDisabled(true);
    this.props.setMatchState(MatchState.PRESTART_IN_PROGRESS);
    this.props.activeMatch.active = 1; // TODO - Change activeID... if this even ends up mattering...
    console.log("Prestarting match " + this.props.activeMatch.matchKey + "...");
    MatchFlowController.prestart(this.props.activeMatch).then(() => {
      this.props.setActiveDetails(this.props.activeMatch.matchDetails);
      this.props.setMatchState(MatchState.PRESTART_COMPLETE);
    }).catch((error: HttpError) => {
      this.props.setMatchState(MatchState.PRESTART_READY);
      DialogManager.showErrorBox(error);
    });
  }

  private setAudienceDisplay() {
    MatchFlowController.setAudienceDisplay().then(() => {
      this.props.setMatchState(MatchState.AUDIENCE_DISPLAY_SET);
    });
  }

  private startMatch() {
    SocketProvider.once("match-end", () => {
      this.props.setMatchState(MatchState.MATCH_COMPLETE);
      SocketProvider.off("score-update");
    });
    SocketProvider.on("score-update", (scoreObj: any) => {
      // TODO - This looks better. However, the scoreObj should eventually be coming through as an actual Match object.
      const sckMatch: SocketMatch = new SocketMatch().fromJSON(scoreObj, new EnergyImpactDetails());
      this.props.activeMatch.redScore = sckMatch.redScore;
      this.props.activeMatch.redMinPen = sckMatch.redMinPen;
      this.props.activeMatch.redMajPen = sckMatch.redMajPen;
      this.props.activeMatch.blueScore = sckMatch.blueScore;
      this.props.activeMatch.blueMinPen = sckMatch.blueMinPen;
      this.props.activeMatch.blueMajPen = sckMatch.blueMajPen;
      for (let i = 0; i < this.props.activeMatch.participants.length; i++) {
        this.props.activeMatch.participants[i].cardStatus = sckMatch.cardStatuses[i];
      }
      // Since everything is 'technically' pass-by-reference, updating activeMatch from activeMatch doesn't do anything.
      // Essentially, we are creating a different object with the same properties to properly update the scorecards.
      const match: Match = new Match().fromJSON(this.props.activeMatch.toJSON());
      match.matchDetails = sckMatch.toMatchDetails();
      match.participants = this.props.activeMatch.participants;
      this.props.setActiveMatch(match);
      this.props.setActiveParticipants(match.participants);
      this.props.setActiveDetails(match.matchDetails);
    });
    MatchFlowController.startMatch().then(() => {
      this.props.setMatchState(MatchState.MATCH_IN_PROGRESS);
      this.props.setActiveMatch(this.props.activeMatch);
      this.forceUpdate();
    });
  }

  private abortMatch() {
    this.props.setNavigationDisabled(false);
    SocketProvider.off("score-update");
    MatchFlowController.abortMatch().then(() => {
      this.props.setMatchState(MatchState.MATCH_ABORTED);
    });
  }

  private commitScores() {
    // Make sure all of our 'active' objects are on the same page.
    this.props.activeMatch.matchDetails = this.props.activeDetails;
    this.props.activeMatch.participants = this.props.activeParticipants;
    MatchFlowController.commitScores(this.props.activeMatch, this.props.eventConfig.eventType).then(() => {
      this.props.setNavigationDisabled(false);
      this.props.setMatchState(MatchState.PRESTART_READY);
    }).catch((error: HttpError) => {
      DialogManager.showErrorBox(error);
    });
  }

  private getAvailableTournamentLevels(postQualConfig: PostQualConfig): TournamentLevels[] {
    return ["Practice", "Qualification", postQualConfig === "elims" ? "Eliminations" : "Finals"];
  }

  private getMatchesByTournamentLevel(tournamentLevel: TournamentLevels): Match[] { // TODO - Only show fields that EMS controls
    switch (tournamentLevel) {
      case "Practice":
        return this.props.practiceMatches;
      case "Qualification":
        return this.props.qualificationMatches;
      case "Finals":
        return this.props.finalsMatches;
      case "Eliminations":
        return this.props.elimsMatches;
      default:
        return [];
    }
  }

  private changeSelectedLevel(event: SyntheticEvent, props: DropdownProps) {
    const matches = this.getMatchesByTournamentLevel((props.value as TournamentLevels));
    if (matches.length > 0) {
      this.props.setActiveMatch(matches[0]);
      this.setState({
        selectedLevel: (props.value as TournamentLevels),
      });
    } else {
      this.setState({
        selectedLevel: (props.value as TournamentLevels)
      });
    }
  }

  private changeSelectedMatch(event: SyntheticEvent, props: DropdownProps) {
    for (const match of this.getMatchesByTournamentLevel(this.state.selectedLevel)) {
      if (match.matchKey === (props.value as string)) {
        this.props.setActiveMatch(match);
        // Temporarily set the match to what we have now, and then get ALL the details.
        MatchFlowController.getMatchResults(match.matchKey).then((data: Match) => {
          this.props.setActiveMatch(data);
          this.props.setActiveParticipants(data.participants);
          this.props.setActiveDetails(data.matchDetails);
        });
        break;
      }
    }
  }

  private changeSelectedField(event: SyntheticEvent, props: DropdownProps) {
    this.props.activeMatch.fieldNumber = props.value as number;
    this.forceUpdate();
  }
}

export function mapStateToProps({configState, internalState, scoringState}: IApplicationState) {
  return {
    activeMatch: scoringState.activeMatch,
    activeDetails: scoringState.activeDetails,
    activeParticipants: scoringState.activeParticipants,
    eventConfig: configState.eventConfiguration,
    matchConfig: configState.matchConfig,
    matchState: scoringState.matchState,
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
    setActiveDetails: (details: MatchDetails) => dispatch(setActiveDetails(details))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchPlay);