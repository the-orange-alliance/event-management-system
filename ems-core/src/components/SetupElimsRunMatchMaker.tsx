import * as React from "react";
import {Card, Form, Grid, Tab} from "semantic-ui-react";
import {getTheme} from "../AppTheme";
import {ApplicationActions, IApplicationState} from "../stores";
import DialogManager from "../managers/DialogManager";
import {connect} from "react-redux";
import {IDisableNavigation} from "../stores/internal/types";
import {Dispatch} from "redux";
import {disableNavigation} from "../stores/internal/actions";
import EliminationsManager from "../managers/playoffs/EliminationsManager";
import {AllianceMember, AppError, EliminationMatchesFormat, Event, Match} from "@the-orange-alliance/lib-ems";
import TournamentRound from "@the-orange-alliance/lib-ems/dist/models/ems/TournamentRound";
import EventConfiguration from "@the-orange-alliance/lib-ems/dist/models/ems/EventConfiguration";
import NumericInput from "./NumericInput";

interface IProps {
  activeRound: TournamentRound,
  allianceMembers: AllianceMember[],
  event: Event,
  eventConfig: EventConfiguration,
  navigationDisabled?: boolean,
  setNavigationDisabled?: (disabled: boolean) => IDisableNavigation,
  onComplete: (match: Match[]) => void
}

interface IState {
  fields: number;
}

class SetupElimsRunMatchMaker extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      fields: props.event.fieldCount
    };
    this.generateMatches = this.generateMatches.bind(this);
    this.updateFields = this.updateFields.bind(this);
  }

  public render() {
    const {event, navigationDisabled} = this.props;
    const {fields} = this.state;
    const fieldsError: boolean = fields > event.fieldCount || fields === 0;
    return (
      <Tab.Pane className="step-view-tab">
        <Card fluid={true} color={getTheme().secondary}>
          <Card.Content>
            <Card.Header>Match Maker Parameters</Card.Header>
          </Card.Content>
          <Card.Content>
            <Grid>
              <Grid.Row columns={6}>
                <Grid.Column><NumericInput label={`Field Count`} value={fields} error={fieldsError} onUpdate={this.updateFields}/></Grid.Column>
              </Grid.Row>
              <Grid.Row columns={6}>
                <Grid.Column><Form.Button fluid={true} color={getTheme().primary} disabled={navigationDisabled || fieldsError} loading={navigationDisabled} onClick={this.generateMatches}>Generate Matches</Form.Button></Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Content>
        </Card>
      </Tab.Pane>
    );
  }

  private generateMatches() {
    const {allianceMembers, activeRound, event, setNavigationDisabled, onComplete} = this.props;
    const {fields} = this.state;
    const format: EliminationMatchesFormat = activeRound.format as EliminationMatchesFormat;

    setNavigationDisabled(true);
    EliminationsManager.generateBracket({
      allianceCaptains: format.alliances,
      format: format.seriesType,
      allianceMembers: allianceMembers,
      eventKey: event.eventKey,
      fields: fields,
      tournamentId: activeRound.id
    }).then((matches: Match[]) => {
      onComplete(matches);
      setNavigationDisabled(false);
    }).catch((error: AppError) => {
      console.log(error);
      setNavigationDisabled(false);
      DialogManager.showErrorBox(error);
    });
  }

  private updateFields(value: number) {
    this.setState({fields: value});
  }
}

export function mapStateToProps({configState, internalState}: IApplicationState) {
  return {
    allianceMembers: internalState.allianceMembers,
    event: configState.event,
    eventConfig: configState.eventConfiguration,
    navigationDisabled: internalState.navigationDisabled
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setNavigationDisabled: (disabled: boolean) => dispatch(disableNavigation(disabled)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SetupElimsRunMatchMaker);