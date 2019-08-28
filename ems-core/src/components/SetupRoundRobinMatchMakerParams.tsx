import * as React from "react";
import {AllianceMember, Event, EventConfiguration, Match, RoundRobinFormat, TournamentRound} from "@the-orange-alliance/lib-ems";
import {Card, Form, Tab} from "semantic-ui-react";
import {getTheme} from "../AppTheme";
import {IDisableNavigation} from "../stores/internal/types";
import {ApplicationActions, IApplicationState} from "../stores";
import {Dispatch} from "redux";
import {disableNavigation} from "../stores/internal/actions";
import {connect} from "react-redux";
import RoundRobinManager from "../managers/playoffs/RoundRobinManager";

interface IProps {
  activeRound: TournamentRound,
  allianceMembers: AllianceMember[],
  event: Event,
  eventConfig: EventConfiguration,
  navigationDisabled?: boolean,
  setNavigationDisabled?: (disabled: boolean) => IDisableNavigation
}

class SetupRoundRobinMatchMakerParams extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.generateMatches = this.generateMatches.bind(this);
  }

  public render() {
    const {navigationDisabled} = this.props;
    return (
      <Tab.Pane className="step-view-tab">
        <Card fluid={true} color={getTheme().secondary}>
          <Card.Content>
            <Card.Header>Round Robin Parameters</Card.Header>
          </Card.Content>
          <Card.Content>
            <Form.Button color={getTheme().primary} disabled={navigationDisabled} loading={navigationDisabled} onClick={this.generateMatches}>Generate Matches</Form.Button>
          </Card.Content>
        </Card>
      </Tab.Pane>
    );
  }

  private generateMatches() {
    const {allianceMembers, activeRound, event, setNavigationDisabled} = this.props;
    const format: RoundRobinFormat = activeRound.format as RoundRobinFormat;
    setNavigationDisabled(true);
    RoundRobinManager.generateMatches(0, {
      allianceCaptains: format.alliances,
      allianceMembers: allianceMembers,
      eventKey: event.eventKey,
      fields: event.fieldCount
    }).then((matches: Match[]) => {
      console.log(matches);
      setNavigationDisabled(false);
    });
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
    setNavigationDisabled: (disabled: boolean) => dispatch(disableNavigation(disabled))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetupRoundRobinMatchMakerParams);