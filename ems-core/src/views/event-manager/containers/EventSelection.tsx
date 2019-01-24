import * as React from "react";
import {Grid, Form, Radio, Button, DropdownProps, InputProps} from "semantic-ui-react";
import EventSelectionSetupCard from "../../../components/EventSelectionSetupCard";
import EventConfigurationCard from "../../../components/EventConfigurationCard";
import fgc_2018 from "../../../resources/FGC_ei.png";
import ftc_1718 from "../../../resources/FTC_rr.png";
import ftc_1819 from "../../../resources/FTC_roverruckus.png";
import ftc_logo from "../../../resources/FTC_logo.png";
import {ISetEvent, ISetEventConfiguration} from "../../../stores/config/types";
import {ApplicationActions, IApplicationState} from "../../../stores";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {setEvent, setEventConfiguration} from "../../../stores/config/actions";
import {getTheme} from "../../../AppTheme";
import ExplanationIcon from "../../../components/ExplanationIcon";
import {SyntheticEvent} from "react";
import EventCreationValidator from "../controllers/EventCreationValidator";
import {CONFIG_STORE} from "../../../AppStore";
import {IDisableNavigation} from "../../../stores/internal/types";
import {disableNavigation} from "../../../stores/internal/actions";
import DialogManager from "../../../managers/DialogManager";
import EventCreationManager from "../../../managers/EventCreationManager";
import {DropdownData, EMSEventAdapter, Event, EventConfiguration, HttpError, PlayoffsType, Region, RegionData, SeasonData,
  TOAConfig, TOAEvent, TOAProvider, DEFAULT_RESET, FTC_RELIC_PRESET, FGC_EI_PRESET, FTC_ROVER_PRESET
} from "@the-orange-alliance/lib-ems";
import NumericInput from "../../../components/NumericInput";

interface IProps {
  onComplete: () => void,
  eventConfig?: EventConfiguration,
  event?: Event,
  toaConfig?: TOAConfig,
  selectConfigPreset?: (preset: EventConfiguration) => ISetEventConfiguration
  setEvent?: (event: Event) => ISetEvent,
  setNavigationDisabled?: (disabled: boolean) => IDisableNavigation
}

interface IState {
  creatingEvent: boolean,
  downloadingData: boolean
}

class EventSelection extends React.Component<IProps, IState> {
  private _validator: EventCreationValidator;

  constructor(props: IProps) {
    super(props);
    this.setTOAEventKey = this.setTOAEventKey.bind(this);
    this.setTOAKey = this.setTOAKey.bind(this);
    this.setPostQualConfig = this.setPostQualConfig.bind(this);
    this.setTeamsPerAlliance = this.setTeamsPerAlliance.bind(this);
    this.setPostQualTeamsPerAlliance = this.setPostQualTeamsPerAlliance.bind(this);
    this.setAllianceCaptainConfig = this.setAllianceCaptainConfig.bind(this);
    this.setRankingCutoff = this.setRankingCutoff.bind(this);
    this.setEventRegion = this.setEventRegion.bind(this);
    this.setEventType = this.setEventType.bind(this);
    this.setEventCode = this.setEventCode.bind(this);
    this.setEventName = this.setEventName.bind(this);
    this.setEventVenue = this.setEventVenue.bind(this);
    this.setEventCity = this.setEventCity.bind(this);
    this.setEventStateProv = this.setEventStateProv.bind(this);
    this.setEventCountry = this.setEventCountry.bind(this);
    this.setEventFields = this.setEventFields.bind(this);
    this.createEvent = this.createEvent.bind(this);
    this.downloadTOAData = this.downloadTOAData.bind(this);

    this.state = {
      creatingEvent: false,
      downloadingData: false
    };

    this._validator = new EventCreationValidator(this.props.eventConfig, this.props.event);
  }

  public componentDidMount() {
    this.setConfigurationPreset(this.props.eventConfig);
  }

  public render() {
    return (
      <div className="step-view">
        <EventSelectionSetupCard title={"1. Choose a Configuration Preset"} content={this.renderConfigCards()}/>
        <EventSelectionSetupCard title={"2. Data Download And Verification"} content={this.renderDownloadAndVerification()}/>
        <EventSelectionSetupCard title={"3. Basic Event Information"} content={this.renderBasicEventInformation()}/>
        <EventSelectionSetupCard title={"4. Post-Qualification Information"} content={this.renderPostQualInformation()}/>
        <EventSelectionSetupCard title={"5. Event Creation"} content={this.renderEventCreation()}/>
      </div>
    );
  }

  /* TOA Download Methods */
  private downloadTOAData() {
    this.setState({downloadingData: true});
    TOAProvider.initialize(this.props.toaConfig);
    TOAProvider.getEvent(this.props.toaConfig.eventKey).then((toaEvent: TOAEvent) => {
      if (toaEvent && toaEvent.eventKey && toaEvent.eventKey.length > 0) {
        this.props.setEvent(new EMSEventAdapter(toaEvent).get());
        this.props.toaConfig.enabled = true;
        this._validator.update(this.props.eventConfig, this.props.event);
        this.forceUpdate();
      } else {
        DialogManager.showInfoBox("TheOrangeAlliance", `The Orange Alliance does not contain any event info for "${this.props.toaConfig.eventKey}". Are you sure your event information is posted online?`);
      }
      this.setState({downloadingData: false});
    }).catch((error: HttpError) => {
      this.props.toaConfig.enabled = false;
      console.log(error);
      this.setState({downloadingData: false});
      DialogManager.showErrorBox(error);
    });
  }

  /* TOA Configuration Methods */
  private setTOAEventKey(event: SyntheticEvent, props: InputProps) {
    if (typeof props.value === "string") {
      this.props.toaConfig.eventKey = props.value;
      this.forceUpdate();
    }
  }

  private setTOAKey(event: SyntheticEvent, props: InputProps) {
    if (typeof props.value === "string") {
      this.props.toaConfig.apiKey = props.value;
      this.forceUpdate();
    }
  }

  /* Event Configuration Methods */
  private setConfigurationPreset(preset: EventConfiguration) {
    const seasonKey = SeasonData.getFromEventType(preset.eventType).value;
    this.props.selectConfigPreset(preset);
    this.props.event.season = SeasonData.getFromSeasonKey(seasonKey);
    this._validator.update(this.props.eventConfig, this.props.event);
    this.forceUpdate();
  }

  private setConfigRequiresTOA(requiresTOA: boolean) {
    this.props.eventConfig.requiresTOA = requiresTOA;
    this.props.selectConfigPreset(this.props.eventConfig);
    this.forceUpdate();
  }

  private setTeamsPerAlliance(newValue: number) {
    this.props.eventConfig.teamsPerAlliance = newValue;
    this.props.selectConfigPreset(this.props.eventConfig);
    this._validator.update(this.props.eventConfig, this.props.event);
    this.forceUpdate();
  }

  private setPostQualTeamsPerAlliance(newValue: number) {
    this.props.eventConfig.postQualTeamsPerAlliance = newValue;
    this.props.selectConfigPreset(this.props.eventConfig);
    this._validator.update(this.props.eventConfig, this.props.event);
    this.forceUpdate();
  }

  private setRankingCutoff(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(parseInt(props.value, 10))) {
      this.props.eventConfig.rankingCutoff = parseInt(props.value, 10);
      this.props.selectConfigPreset(this.props.eventConfig);
      this._validator.update(this.props.eventConfig, this.props.event);
      this.forceUpdate();
    }
  }

  private setPostQualConfig(event: SyntheticEvent, props: DropdownProps) {
    if (typeof props.value === "string") {
      this.props.eventConfig.playoffsConfig = props.value as PlayoffsType;
      this.props.selectConfigPreset(this.props.eventConfig);
      this._validator.update(this.props.eventConfig, this.props.event);
      this.forceUpdate();
    }
  }

  private setAllianceCaptainConfig(event: SyntheticEvent, props: DropdownProps) {
    const value: string = props.value.toString();
    if (!isNaN(parseInt(value, 10))) {
      this.props.eventConfig.allianceCaptains = parseInt(value, 10);
      this.props.selectConfigPreset(this.props.eventConfig);
      this._validator.update(this.props.eventConfig, this.props.event);
      this.forceUpdate();
    }
  }

  /* Event Information Methods */
  private setEventRegion(event: SyntheticEvent, props: DropdownProps) {
    if (typeof props.value === "string") {
      this.props.event.region = RegionData.getFromRegionKey(props.value);
      this.props.setEvent(this.props.event);
      this._validator.update(this.props.eventConfig, this.props.event);
      this.forceUpdate();
    }
  }

  private setEventType(event: SyntheticEvent, props: DropdownProps) {
    if (typeof props.value === "string") {
      this.props.event.eventType = props.value;
      this.props.setEvent(this.props.event);
      this._validator.update(this.props.eventConfig, this.props.event);
      this.forceUpdate();
    }
  }

  private setEventCode(event: SyntheticEvent, props: InputProps) {
    if (typeof props.value === "string") {
      this.props.event.eventCode = props.value.toString().toUpperCase();
      this.props.setEvent(this.props.event);
      this._validator.update(this.props.eventConfig, this.props.event);
      this.forceUpdate();
    }
  }

  private setEventName(event: SyntheticEvent, props: InputProps) {
    if (typeof props.value === "string") {
      this.props.event.eventName = props.value;
      this.props.setEvent(this.props.event);
      this._validator.update(this.props.eventConfig, this.props.event);
      this.forceUpdate();
    }
  }

  private setEventVenue(event: SyntheticEvent, props: InputProps) {
    if (typeof props.value === "string") {
      this.props.event.venue = props.value;
      this.props.setEvent(this.props.event);
      this._validator.update(this.props.eventConfig, this.props.event);
      this.forceUpdate();
    }
  }

  private setEventCity(event: SyntheticEvent, props: InputProps) {
    if (typeof props.value === "string") {
      this.props.event.city = props.value;
      this.props.setEvent(this.props.event);
      this._validator.update(this.props.eventConfig, this.props.event);
      this.forceUpdate();
    }
  }

  private setEventStateProv(event: SyntheticEvent, props: InputProps) {
    if (typeof props.value === "string") {
      this.props.event.stateProv = props.value;
      this.props.setEvent(this.props.event);
      this._validator.update(this.props.eventConfig, this.props.event);
      this.forceUpdate();
    }
  }

  private setEventCountry(event: SyntheticEvent, props: InputProps) {
    if (typeof props.value === "string") {
      this.props.event.country = props.value;
      this.props.setEvent(this.props.event);
      this._validator.update(this.props.eventConfig, this.props.event);
      this.forceUpdate();
    }
  }

  private setEventFields(newValue: number) {
    this.props.event.fieldCount = newValue;
    const fieldControl: number[] = [];
    if (this._validator.isValidFieldCount()) {
      for (let i = 0; i < this.props.event.fieldCount; i++) {
        fieldControl.push(i + 1);
      }
    }
    this.props.eventConfig.fieldsControlled = fieldControl;
    this.props.setEvent(this.props.event);
    this._validator.update(this.props.eventConfig, this.props.event);
    this.forceUpdate();
  }

  private canCreateEvent(): boolean {
    return this._validator.isValid;
  }

  private createEvent(): void {
    this.setState({creatingEvent: true});
    this.props.setNavigationDisabled(true);
    const toaConfig = (this.props.toaConfig.enabled && this.props.eventConfig.requiresTOA) ? this.props.toaConfig.toJSON() : undefined;
    CONFIG_STORE.setAll({event: this.props.event.toJSON(), eventConfig: this.props.eventConfig.toJSON(), toaConfig: toaConfig}).catch((err) => console.log(err));
    EventCreationManager.createEventDatabase(this.props.eventConfig.eventType, this.props.event).then(() => {
      this.setState({creatingEvent: false});
      this.props.setNavigationDisabled(false);
      this.props.onComplete();
    }).catch((error: HttpError) => {
      this.setState({creatingEvent: false});
      this.props.setNavigationDisabled(false);
      console.log(error);
      DialogManager.showErrorBox(error);
    });
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
    const {eventConfig, toaConfig} = this.props;
    const {downloadingData} = this.state;
    const downloadDisabled: boolean = !eventConfig.requiresTOA || toaConfig.eventKey.length <= 0 || toaConfig.apiKey.length <= 0;
    return (
      <Form>
        <Grid>
          <Grid.Row columns={16}>
            <Grid.Column width={8}>Would you like to live upload match results to The Orange Alliance?</Grid.Column>
            <Grid.Column width={2}><Radio label="Yes" checked={eventConfig.requiresTOA} onClick={this.setConfigRequiresTOA.bind(this, true)}/></Grid.Column>
            <Grid.Column width={2}><Radio label="No" checked={!eventConfig.requiresTOA} onClick={this.setConfigRequiresTOA.bind(this, false)}/></Grid.Column>
          </Grid.Row>
          {
            eventConfig.requiresTOA &&
            <Grid.Row columns="equal">
              <Grid.Column>
                <Form.Group widths="equal">
                  <Form.Input
                    label="TOA Event Code"
                    placeholder="####-###-####"
                    value={toaConfig.eventKey}
                    onChange={this.setTOAEventKey}
                    error={toaConfig.eventKey.length <= 0}
                  />
                  <Form.Input
                    label="TOA API Key"
                    placeholder="Encrypted API Key"
                    value={toaConfig.apiKey}
                    onChange={this.setTOAKey}
                    error={toaConfig.apiKey.length <= 0}
                  />
                </Form.Group>
              </Grid.Column>
            </Grid.Row>
          }
          <Grid.Row columns={16}>
            <Grid.Column width={4}><Button fluid={true} loading={downloadingData} color={getTheme().primary} disabled={downloadDisabled || downloadingData} onClick={this.downloadTOAData}>Download Event Data</Button></Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    );
  }

  private renderBasicEventInformation(): JSX.Element {
    const eventValidator = this._validator;
    const selectedRegion = typeof this.props.event.region === "undefined" ? new Region("", "").regionKey : this.props.event.region.regionKey;
    const selectedEventType = this.props.event.eventType;
    const {event, eventConfig} = this.props;
    const isValidRegion = typeof event.region === "undefined" ? false : event.region.regionKey.length > 0;
    const isValidEventType = typeof event.eventType === "undefined" ? false : event.eventType.length > 0;
    return (
      <Form>
        <Grid>
          <Grid.Row columns={16}>
            <Grid.Column width={4}><Form.Dropdown fluid={true} selection={true} options={SeasonData.SeasonItems} disabled={true} value={SeasonData.getFromEventType(this.props.eventConfig.eventType).value} label="Season"/></Grid.Column>
            <Grid.Column width={4}><Form.Dropdown fluid={true} selection={true} options={RegionData.RegionItems} value={selectedRegion} onChange={this.setEventRegion} error={!isValidRegion} label="Region"/></Grid.Column>
            {
              this.props.eventConfig.requiresTOA &&
               <Grid.Column width={4}><Form.Dropdown fluid={true} selection={true} options={[]} error={!eventValidator.isValidEventKey()} label="Event"/></Grid.Column>
            }
            {
              !this.props.eventConfig.requiresTOA &&
              <Grid.Column width={4}><Form.Input fluid={true} value={event.eventCode} onChange={this.setEventCode} error={!eventValidator.isValidEventKey()} label={<ExplanationIcon title={"Event Code"} content={"An event's code is a 3-4 letter combination that is used to represent the event. For example, Great Lakes Bay Region event could be coded into GLBR."}/>}/></Grid.Column>
            }
            <Grid.Column width={4}><Form.Dropdown fluid={true} selection={true} options={DropdownData.EventTypeItems} value={selectedEventType} onChange={this.setEventType} error={!isValidEventType} label="Event Type"/></Grid.Column>
          </Grid.Row>
          <Grid.Row columns={16}>
            <Grid.Column width={8}><Form.Input fluid={true} value={event.eventName} onChange={this.setEventName} error={!eventValidator.isValidEventName()} label="Event Name"/></Grid.Column>
            <Grid.Column width={8}><Form.Input fluid={true} value={event.venue} onChange={this.setEventVenue} error={!eventValidator.isValidEventVenue()} label="Event Venue"/></Grid.Column>
          </Grid.Row>
          <Grid.Row columns={16}>
            <Grid.Column width={4}><Form.Input fluid={true} value={event.city} onChange={this.setEventCity} error={!eventValidator.isValidCity()} label="City"/></Grid.Column>
            <Grid.Column width={4}><Form.Input fluid={true} value={event.stateProv} onChange={this.setEventStateProv} error={!eventValidator.isValidStateProv()} label="State/Province"/></Grid.Column>
            <Grid.Column width={4}><Form.Input fluid={true} value={event.country} onChange={this.setEventCountry} error={!eventValidator.isValidCountry()} label={<ExplanationIcon title={"Country"} content={"The full name of the event's country."}/>}/></Grid.Column>
            <Grid.Column width={4}><Form.Input fluid={true} value={event.website} error={!eventValidator.isValidWebsite()} label="Website (Optional)"/></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}><NumericInput value={event.fieldCount} onUpdate={this.setEventFields} error={!eventValidator.isValidFieldCount()} label={<ExplanationIcon title={"Field Count"} content={"Number of competition fields at the event. Usually between 1-4."}/>}/></Grid.Column>
            <Grid.Column width={4}><NumericInput value={eventConfig.teamsPerAlliance} onUpdate={this.setTeamsPerAlliance} error={!eventValidator.isValidTPA()} label={"Teams Per Alliance"}/></Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    );
  }

  private renderPostQualInformation(): JSX.Element {
    const {eventConfig} = this.props;
    const eventValidator = this._validator;
    const postQualLabel = eventConfig.playoffsConfig === "elims" ? "Eliminations" : "Finals";
    const isValidPlayoffConfig = typeof eventConfig.playoffsConfig === "undefined" ? false : eventConfig.playoffsConfig.length > 0;
    return (
      <Form>
        <Grid>
          <Grid.Row columns={16}>
            <Grid.Column width={4}><Form.Dropdown fluid={true} selection={true} options={DropdownData.PostQualItems} value={eventConfig.playoffsConfig} error={!isValidPlayoffConfig} onChange={this.setPostQualConfig} label="Post-Qualification Type"/></Grid.Column>
            {
              eventConfig.playoffsConfig === "elims" &&
              <Grid.Column width={4}><Form.Dropdown fluid={true} selection={true} options={DropdownData.AllianceCaptainItems} value={eventConfig.allianceCaptains} onChange={this.setAllianceCaptainConfig} error={!eventValidator.isValidAllianceCaptains()} label="Alliance Captains"/></Grid.Column>
            }
            {
              eventConfig.playoffsConfig === "finals" &&
              <Grid.Column width={4}><Form.Input fluid={true} value={eventConfig.rankingCutoff} onChange={this.setRankingCutoff} label={<ExplanationIcon title={"Ranking Cutoff"} content={"This configuration may be changed after the event is created in the 'Settings' tab."}/>}/></Grid.Column>
            }
            <Grid.Column width={4}><NumericInput value={eventConfig.postQualTeamsPerAlliance} onUpdate={this.setPostQualTeamsPerAlliance} error={!eventValidator.isValidPostQualTPA()} label={postQualLabel + " Teams Per Alliance"}/></Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    );
  }

  private renderEventCreation(): JSX.Element {
    const {creatingEvent} = this.state;
    return (
      <Grid>
        <Grid.Row columns={16}>
          <Grid.Column width={4}><Button fluid={true} color={getTheme().primary} disabled={!this.canCreateEvent() || creatingEvent} loading={creatingEvent} onClick={this.createEvent}>Create Event</Button></Grid.Column>
        </Grid.Row>
        <Grid.Row columns={16}>
          <Grid.Column width={8}><i>NOTE: Everything in the Event Manager can only be completed once! Make sure all of your information is correct.</i></Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

}

export function mapStateToProps({configState}: IApplicationState) {
  return {
    eventConfig: configState.eventConfiguration,
    event: configState.event,
    toaConfig: configState.toaConfig
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    selectConfigPreset: (preset: EventConfiguration) => dispatch(setEventConfiguration(preset)),
    setEvent: (event: Event) => dispatch(setEvent(event)),
    setNavigationDisabled: (disabled: boolean) => dispatch(disableNavigation(disabled))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventSelection);