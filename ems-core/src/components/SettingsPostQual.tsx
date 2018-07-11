import * as React from "react";
import {Card, Dropdown, DropdownProps, Grid} from "semantic-ui-react";
import {getTheme} from "../shared/AppTheme";
import EventConfiguration from "../shared/models/EventConfiguration";
import {ApplicationActions, IApplicationState} from "../stores";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {ISetEventConfiguration} from "../stores/config/types";
import {setEventConfiguration} from "../stores/config/actions";
import {AllianceCaptainItems, PostQualItems} from "../shared/data/DropdownItemOptions";
import {SyntheticEvent} from "react";
import {PostQualConfig} from "../shared/AppTypes";

interface IProps {
  eventConfig?: EventConfiguration,
  setEventConfig?: (eventConfig: EventConfiguration) => ISetEventConfiguration
}

class SettingsPostQual extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    this.setPostQualConfig = this.setPostQualConfig.bind(this);
    this.setAllianceCaptainConfig = this.setAllianceCaptainConfig.bind(this);
  }

  private setPostQualConfig(event: SyntheticEvent, props: DropdownProps) {
    if (typeof props.value === "string") {
      this.props.eventConfig.postQualConfig = props.value as PostQualConfig;
      this.props.setEventConfig(this.props.eventConfig);
      this.forceUpdate();
    }
  }

  private setAllianceCaptainConfig(event: SyntheticEvent, props: DropdownProps) {
    const value: string = props.value.toString();
    if (!isNaN(parseInt(value, 10))) {
      this.props.eventConfig.allianceCaptains = parseInt(value, 10);
      this.props.setEventConfig(this.props.eventConfig);
      this.forceUpdate();
    }
  }

  public render() {
    return (
      <Card fluid={true} color={getTheme().secondary}>
        <Card.Content className="card-header"><h3>Post-Qualification Configuration</h3></Card.Content>
        <Card.Content>
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column className="center-left-items">
                <span>Post-Qualification Type</span>
              </Grid.Column>
              <Grid.Column>
                <Dropdown
                  fluid={true}
                  selection={true}
                  value={this.props.eventConfig.postQualConfig}
                  options={PostQualItems}
                  onChange={this.setPostQualConfig}
                />
              </Grid.Column>
            </Grid.Row>
            {
              this.props.eventConfig.postQualConfig === "elims" &&
              <Grid.Row>
                <Grid.Column><span>Alliance Captains</span></Grid.Column>
                <Grid.Column><Dropdown fluid={true} selection={true} value={this.props.eventConfig.allianceCaptains} options={AllianceCaptainItems} onChange={this.setAllianceCaptainConfig}/></Grid.Column>
              </Grid.Row>
            }
            {
              this.props.eventConfig.postQualConfig === "finals" &&
              <Grid.Row>
                <Grid.Column><span>Ranking Cutoff</span></Grid.Column>
                <Grid.Column><Dropdown fluid={true} selection={true} value={this.props.eventConfig.allianceCaptains} options={AllianceCaptainItems}/></Grid.Column>
              </Grid.Row>
            }
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
    setEventConfig: (eventConfig: EventConfiguration) => (dispatch(setEventConfiguration(eventConfig)))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPostQual);