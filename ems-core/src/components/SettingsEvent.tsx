import * as React from "react";
import {Card, Dropdown, DropdownProps, Grid} from "semantic-ui-react";
import {getTheme} from "../shared/AppTheme";
import {TeamIdentifierItems} from "../shared/data/DropdownItemOptions";
import EventConfiguration from "../shared/models/EventConfiguration";
import {ISetEventConfiguration} from "../stores/config/types";
import {SyntheticEvent} from "react";
import {ApplicationActions, IApplicationState} from "../stores";
import {Dispatch} from "redux";
import {setEventConfiguration} from "../stores/config/actions";
import {connect} from "react-redux";
import {TeamIdentifier} from "../shared/AppTypes";

interface IProps {
  eventConfig?: EventConfiguration,
  setEventConfig?: (config: EventConfiguration) => ISetEventConfiguration
}

class SettingsEvent extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.setTeamIdentifier = this.setTeamIdentifier.bind(this);
  }

  private setTeamIdentifier(event: SyntheticEvent, props: DropdownProps) {
    this.props.eventConfig.teamIdentifier = props.value as TeamIdentifier;
    this.props.setEventConfig(this.props.eventConfig);
    this.forceUpdate();
  }

  public render() {
    return (
      <Card fluid={true} color={getTheme().secondary}>
        <Card.Content className="card-header"><h3>Event Configuration</h3></Card.Content>
        <Card.Content>
          <Grid>
            <Grid.Row columns="equal">
              <Grid.Column className="center-left-items"><span>Field Control</span></Grid.Column>
              <Grid.Column>
                <Dropdown
                  fluid={true}
                  selection={true}
                  multiple={true}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row columns="equal">
              <Grid.Column className="center-left-items"><span>Team Identifier</span></Grid.Column>
              <Grid.Column>
                <Dropdown
                  fluid={true}
                  selection={true}
                  value={this.props.eventConfig.teamIdentifier}
                  options={TeamIdentifierItems}
                  onChange={this.setTeamIdentifier}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card.Content>
      </Card>
    );
  }
}

function mapStateToProps({configState}: IApplicationState) {
  return {
    eventConfig: configState.eventConfiguration
  };
}

function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    setEventConfig: (config: EventConfiguration) => dispatch(setEventConfiguration(config))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsEvent);