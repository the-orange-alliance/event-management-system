import * as React from "react";
import {Grid, Form, Radio, Button} from "semantic-ui-react";
import EventSelectionSetupCard from "../../../components/EventSelectionSetupCard";
import EventConfigurationCard from "../../../components/EventConfigurationCard";
import fgc_2018 from "../../../resources/FGC_ei.png";
import ftc_1718 from "../../../resources/FTC_rr.png";
import ftc_1819 from "../../../resources/FTC_roverruckus.png";
import ftc_logo from "../../../resources/FTC_logo.png";
import EventConfiguration, {
  DEFAULT_RESET,
  FGC_EI_PRESET, FTC_RELIC_PRESET,
  FTC_ROVER_PRESET
} from "../../../shared/models/EventConfiguration";
import Event from "../../../shared/models/Event";
import {ISetEventConfiguration} from "../../../stores/config/types";
import {ApplicationActions, IApplicationState} from "../../../stores";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {setEventConfiguration} from "../../../stores/config/actions";
import {getTheme} from "../../../shared/AppTheme";

interface IProps {
  eventConfig: EventConfiguration,
  event: Event,
  selectConfigPreset?: (preset: EventConfiguration) => ISetEventConfiguration
}

class EventSelection extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <div className="step-view">
        <EventSelectionSetupCard title={"1. Choose a Configuration Preset"} content={this.renderConfigCards()}/>
        <EventSelectionSetupCard title={"2. Data Download And Verification"} content={this.renderDownloadAndVerification()}/>
        <EventSelectionSetupCard title={"3. Basic Event Information"} content={<span>Content!</span>}/>
      </div>
    );
  }

  private setConfigurationPreset(preset: EventConfiguration) {
    this.props.selectConfigPreset(preset);
    this.forceUpdate();
  }

  private setConfigRequiresTOA(requiresTOA: boolean) {
    this.props.eventConfig.requiresTOA = requiresTOA;
    this.props.selectConfigPreset(this.props.eventConfig);
    this.forceUpdate();
  }

  private renderConfigCards(): JSX.Element {
    return (
      <Grid columns={16}>
        <Grid.Row>
          <Grid.Column width={4}>
            <EventConfigurationCard title={"FIRST Global Energy Impact"} color={"green"} imgUrl={fgc_2018} onClick={this.setConfigurationPreset.bind(this, FGC_EI_PRESET)}/>
          </Grid.Column>
          <Grid.Column width={4}>
            <EventConfigurationCard title={"Standard FIRST Tech Challenge Relic Recovery Event"} color={"brown"} imgUrl={ftc_1718} onClick={this.setConfigurationPreset.bind(this, FTC_RELIC_PRESET)}/>
          </Grid.Column>
          <Grid.Column width={4}>
            <EventConfigurationCard title={"Standard FIRST Tech Challenge Rover Ruckus Event"} color={"orange"} imgUrl={ftc_1819} onClick={this.setConfigurationPreset.bind(this, FTC_ROVER_PRESET)}/>
          </Grid.Column>
          <Grid.Column width={4}>
            <EventConfigurationCard title={"Custom FTC Event"} color={"black"} imgUrl={ftc_logo} onClick={this.setConfigurationPreset.bind(this, DEFAULT_RESET)}/>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  private renderDownloadAndVerification(): JSX.Element {
    return (
      <Form>
        <Grid>
          <Grid.Row columns={16}>
            <Grid.Column width={8}>Would you like to live upload match results to The Orange Alliance?</Grid.Column>
            <Grid.Column width={2}><Radio label="Yes" checked={this.props.eventConfig.requiresTOA} onClick={this.setConfigRequiresTOA.bind(this, true)}/></Grid.Column>
            <Grid.Column width={2}><Radio label="No" checked={!this.props.eventConfig.requiresTOA} onClick={this.setConfigRequiresTOA.bind(this, false)}/></Grid.Column>
          </Grid.Row>
          {
            this.props.eventConfig.requiresTOA &&
            <Grid.Row columns="equal">
              <Grid.Column>
                <Form.Group widths="equal">
                  <Form.Input
                    label="TOA API Key"
                    placeholder="Encrypted API Key"
                  />
                  <Form.Input
                    label="TOA Event Code"
                    placeholder="####-###-####"
                  />
                </Form.Group>
              </Grid.Column>
            </Grid.Row>
          }
          <Grid.Row columns={16}>
            <Grid.Column width={4}><Button fluid={true} color={getTheme().primary} disabled={!this.props.eventConfig.requiresTOA}>Download Event Data</Button></Grid.Column>
            <Grid.Column width={4}><Button fluid={true} color={getTheme().secondary}>Create New Event</Button></Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    );
  }

}

export function mapStateToProps({configState}: IApplicationState) {
  return {
    eventConfig: configState.eventConfiguration,
    event: configState.event
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    selectConfigPreset: (preset: EventConfiguration) => dispatch(setEventConfiguration(preset))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventSelection);