import * as React from "react";
import {TournamentRound} from "@the-orange-alliance/lib-ems";
import {Card, Form, Tab} from "semantic-ui-react";
import {getTheme} from "../AppTheme";
import {IDisableNavigation} from "../stores/internal/types";
import {ApplicationActions, IApplicationState} from "../stores";
import {Dispatch} from "redux";
import {disableNavigation} from "../stores/internal/actions";
import {connect} from "react-redux";

interface IProps {
  activeRound: TournamentRound,
  navigationDisabled?: boolean,
  setNavigationDisabled?: (disabled: boolean) => IDisableNavigation
}

class SetupRoundRobinMatchMakerParams extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
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
            <Form.Button color={getTheme().primary} disabled={navigationDisabled} loading={navigationDisabled}>Generate Matches</Form.Button>
          </Card.Content>
        </Card>
      </Tab.Pane>
    );
  }
}

export function mapStateToProps({internalState}: IApplicationState) {
  return {
    navigationDisabled: internalState.navigationDisabled
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setNavigationDisabled: (disabled: boolean) => dispatch(disableNavigation(disabled))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetupRoundRobinMatchMakerParams);