import * as React from "react";
import {Grid, Form, Radio, Button, DropdownProps, InputProps} from "semantic-ui-react";
import EventSelectionSetupCard from "../../../components/EventSelectionSetupCard";
import EventConfigurationCard from "../../../components/EventConfigurationCard";
import fgc_2019 from "../../../resources/FGC_oo.png";
import ftc_1718 from "../../../resources/FTC_rr.png";
import ftc_1819 from "../../../resources/FTC_roverruckus.png";
import ftc_logo from "../../../resources/FTC_logo.png";
import frc_ir from "../../../resources/FRC_ir.png";
import frc_rr from "../../../resources/FRC_rr.svg";
import {ISetEvent, ISetEventConfiguration} from "../../../stores/config/types";
import {ApplicationActions, IApplicationState} from "../../../stores";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {setEvent, setEventConfiguration} from "../../../stores/config/actions";
import {getTheme} from "../../../AppTheme";
import ExplanationIcon from "../../../components/ExplanationIcon";
import {SyntheticEvent} from "react";
import EventCreationValidator from "../../../validators/EventCreationValidator";
import {CONFIG_STORE} from "../../../AppStore";
import {IDisableNavigation, ISetTestMatches} from "../../../stores/internal/types";
import {disableNavigation, setTestMatches} from "../../../stores/internal/actions";
import DialogManager from "../../../managers/DialogManager";
import EventCreationManager from "../../../managers/EventCreationManager";
import {
  DropdownData, Event, EventConfiguration, HttpError, Match, PlayoffsType, Region, RegionData,
  SeasonData,
  DEFAULT_RESET, FTC_RELIC_PRESET, FGC_PRESET, FTC_ROVER_PRESET, FRC_IR_PRESET, FRC_RR_PRESET,
  EliminationMatchesFormat, RankingMatchesFormat, RoundRobinFormat, SeriesType, ROUND_ROBIN_PRESET, RANKING_PRESET,
  ELIMINATIONS_PRESET, AppError, TournamentRound, UploadConfig
} from "@the-orange-alliance/lib-ems";
import NumericInput from "../../../components/NumericInput";
import MatchManager from "../../../managers/MatchManager";
import TournamentValidator from "../../../validators/TournamentValidator";
import UploadManager from "../../../managers/UploadManager";
import {Providers} from "@the-orange-alliance/lib-ems/dist/models/ems/EventConfiguration";

interface IProps {
  onComplete: () => void,
  eventConfig?: EventConfiguration,
  event?: Event,
  uploadConfig?: UploadConfig,
  selectConfigPreset?: (preset: EventConfiguration) => ISetEventConfiguration
  setEvent?: (event: Event) => ISetEvent,
  setTestMatches?: (matches: Match[]) => ISetTestMatches,
  setNavigationDisabled?: (disabled: boolean) => IDisableNavigation
}

interface IState {
  creatingEvent: boolean,
  downloadingData: boolean
}

const uploadOptions = [
  {
    key: Providers.TOA,
    text: 'The Orange Alliance (FTC Only)',
    value: Providers.TOA,
  },
  {
    key: Providers.TBA,
    text: 'The Blue Alliance (FRC 2022+ Only)',
    value: Providers.TBA,
  },
  {
    key: Providers.FGA,
    text: 'The Global Alliance (FGC Only)',
    value: Providers.FGA,
  },
  {
    key: Providers.FCA,
    text: 'The Collegiate Alliance (FRC Only)',
    value: Providers.FCA,
  },
  {
    key: Providers.CUSTOM,
    text: 'Custom Provider',
    value: Providers.CUSTOM,
  },
]

class EventSelection extends React.Component<IProps, IState> {
  private _validator: EventCreationValidator;
  private _tournamentValidator: TournamentValidator;

  constructor(props: IProps) {
    super(props);
    this.setLiveEventKey = this.setLiveEventKey.bind(this);
    this.setApiKey = this.setApiKey.bind(this);
    this.setSecret = this.setSecret.bind(this);
    this.setClientId = this.setClientId.bind(this);
    this.setTeamsPerAlliance = this.setTeamsPerAlliance.bind(this);
    this.setAdvancementConfig = this.setAdvancementConfig.bind(this);
    this.setAdvancementTeamsPerAlliance = this.setAdvancementTeamsPerAlliance.bind(this);
    this.setAdvancementEliminationsAlliances = this.setAdvancementEliminationsAlliances.bind(this);
    this.setAdvancementEliminationsSeries = this.setAdvancementEliminationsSeries.bind(this);
    this.setAdvancementRankingCutoff = this.setAdvancementRankingCutoff.bind(this);
    this.setAdvancementRoundRobinAlliances = this.setAdvancementRoundRobinAlliances.bind(this);
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

    this.openFileChooser = this.openFileChooser.bind(this);

    this.state = {
      creatingEvent: false,
      downloadingData: false
    };

    this._validator = new EventCreationValidator(this.props.eventConfig, this.props.event);
    this._tournamentValidator = new TournamentValidator(this.props.eventConfig);
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
        <EventSelectionSetupCard title={"4. Post-Qualification Information"} content={this.renderTournamentInformation()}/>
        <EventSelectionSetupCard title={"5. Event Creation"} content={this.renderEventCreation()}/>
      </div>
    );
  }

  private renderConfigCards(): JSX.Element {
    return (
      <Grid columns={15}>
        <Grid.Row>
          <Grid.Column width={3}>
            <EventConfigurationCard title={"FIRST Global Ocean Opportunities"} color={"green"} imgUrl={fgc_2019} onClick={this.setConfigurationPreset.bind(this, FGC_PRESET)}/>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={3}>
            <EventConfigurationCard title={"Standard FIRST Tech Challenge Relic Recovery Event"} color={"brown"} imgUrl={ftc_1718} onClick={this.setConfigurationPreset.bind(this, FTC_RELIC_PRESET)}/>
          </Grid.Column>
          <Grid.Column width={3}>
            <EventConfigurationCard title={"Standard FIRST Tech Challenge Rover Ruckus Event"} color={"orange"} imgUrl={ftc_1819} onClick={this.setConfigurationPreset.bind(this, FTC_ROVER_PRESET)}/>
          </Grid.Column>
          <Grid.Column width={3}>
            <EventConfigurationCard title={"Custom FTC Event"} color={"black"} imgUrl={ftc_logo} onClick={this.setConfigurationPreset.bind(this, DEFAULT_RESET)}/>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={3}>
            <EventConfigurationCard title={"FRC Infinite Recharge"} color={"black"} imgUrl={frc_ir} onClick={this.setConfigurationPreset.bind(this, FRC_IR_PRESET)}/>
          </Grid.Column>
          <Grid.Column width={3}>
            <EventConfigurationCard title={"FRC Rapid React"} color={"black"} imgUrl={frc_rr} onClick={this.setConfigurationPreset.bind(this, FRC_RR_PRESET)}/>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  private renderDownloadAndVerification(): JSX.Element {
    const {eventConfig, uploadConfig} = this.props;
    const {downloadingData} = this.state;
    const toaNotReady = eventConfig.uploadType === Providers.TOA && uploadConfig.toaConfig.apiKey.length <= 0;
    const tbaNotReady = eventConfig.uploadType === Providers.TBA && (uploadConfig.tbaConfig.secret.length <= 0 || uploadConfig.tbaConfig.clientId.length <= 0)
    const downloadDisabled: boolean = !eventConfig.uploadLive || uploadConfig.eventKey.length <= 0 || toaNotReady || tbaNotReady ;
    return (
      <Form>
        <Grid>
          <Grid.Row columns={16}>
            <Grid.Column width={8}>Would you like to live upload match results?</Grid.Column>
            <Grid.Column width={2}><Radio label="Yes" checked={eventConfig.uploadLive} onClick={this.setConfigUploadLive.bind(this, true)}/></Grid.Column>
            <Grid.Column width={2}><Radio label="No" checked={!eventConfig.uploadLive} onClick={this.setConfigUploadLive.bind(this, false)}/></Grid.Column>
          </Grid.Row>
          {
            eventConfig.uploadLive &&
            <>
              <Grid.Row columns={"equal"}>
                <Grid.Column widths={"equal"}>
                  <Form.Dropdown
                    placeholder={'Select Provider'}
                    fluid
                    selection
                    options={uploadOptions}
                    value={eventConfig.uploadType}
                    onChange={(e, p) => this.setConfigUploadProvider(p.value as number)}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns="equal">
                <Grid.Column>
                  <Form.Group widths="equal">
                    <Form.Input
                      label="Event Code"
                      placeholder="####-###-#### (TOA) | ##-##-### (FCC, FGC) | ######### (TBA)"
                      value={uploadConfig.eventKey}
                      onChange={this.setLiveEventKey}
                      error={uploadConfig.eventKey.length <= 0}
                    />
                    {eventConfig.uploadType === Providers.TBA &&
                      <>
                        <Form.Input
                          label="TBA Secret Key"
                          placeholder="Secret Key"
                          value={uploadConfig.tbaConfig.secret}
                          onChange={this.setSecret}
                          error={uploadConfig.tbaConfig.secret.length <= 0}
                        />
                        <Form.Input
                          label="TBA Client ID"
                          placeholder="Client ID"
                          value={uploadConfig.tbaConfig.clientId}
                          onChange={this.setClientId}
                          error={uploadConfig.tbaConfig.clientId.length <= 0}
                        />
                      </>
                    }
                    {eventConfig.uploadType === Providers.TOA &&
                      <Form.Input
                        label="TOA API Key"
                        placeholder="Encrypted API Key"
                        value={uploadConfig.toaConfig.apiKey}
                        onChange={this.setApiKey}
                        error={uploadConfig.toaConfig.apiKey.length <= 0}
                      />
                    }
                  </Form.Group>
                </Grid.Column>
              </Grid.Row>
            </>
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
    const selectedEventType = this.props.event.eventTypeKey;
    const {event, eventConfig} = this.props;
    const isValidRegion = typeof event.region === "undefined" ? false : event.region.regionKey.length > 0;
    const isValidEventType = typeof event.eventTypeKey === "undefined" ? false : event.eventTypeKey.length > 0;
    return (
      <Form>
        <Grid>
          <Grid.Row columns={16}>
            <Grid.Column width={4}><Form.Dropdown fluid={true} selection={true} options={SeasonData.SeasonItems} disabled={true} value={SeasonData.getFromEventType(this.props.eventConfig.eventType).value} label="Season"/></Grid.Column>
            <Grid.Column width={4}><Form.Dropdown fluid={true} selection={true} options={RegionData.RegionItems} value={selectedRegion} onChange={this.setEventRegion} error={!isValidRegion} label="Region"/></Grid.Column>
            <Grid.Column width={4}><Form.Input fluid={true} value={event.eventCode} onChange={this.setEventCode} error={!eventValidator.isValidEventKey()} label={<ExplanationIcon title={"Event Code"} content={"An event's code is a 3-4 letter combination that is used to represent the event. For example, Great Lakes Bay Region event could be coded into GLBR."}/>}/></Grid.Column>
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

  private renderTournamentInformation(): JSX.Element {
    const {eventConfig} = this.props;
    const tournamentValidator = this._tournamentValidator;
    const validConfig = typeof eventConfig.tournamentConfig === "undefined" ? false : eventConfig.tournamentConfig.length > 0;
    const tournamentRound = Array.isArray(eventConfig.tournament) ? eventConfig.tournament[0] : eventConfig.tournament;

    let advancementView;

    if (!validConfig) {
      advancementView = (
        <Grid.Column width={4}>
          <Form.Dropdown fluid={true} selection={true} options={[]} error={true} label=""/>
        </Grid.Column>
      );
    } else {
      switch (eventConfig.tournamentConfig) {
        case "rr":
          const rrAlliances = (tournamentRound.format as RoundRobinFormat).alliances;
          advancementView = (
            <Grid.Column width={4}>
              <NumericInput value={rrAlliances} onUpdate={this.setAdvancementRoundRobinAlliances} error={!tournamentValidator.isValidRounds()} label="Alliance Captains"/>
            </Grid.Column>
          );
          break;
        case "ranking":
          const rCutoff = (tournamentRound.format as RankingMatchesFormat).rankingCutoff;
          advancementView = (
            <Grid.Column width={4}>
              <Form.Input fluid={true} value={rCutoff} onChange={this.setAdvancementRankingCutoff} label={<ExplanationIcon title={"Ranking Cutoff"} content={"This configuration may be changed after the event is created in the 'Settings' tab."}/>}/>
            </Grid.Column>
          );
          break;
        case "elims":
          const elimsAlliances = (tournamentRound.format as EliminationMatchesFormat).alliances;
          const elimsSeries = (tournamentRound.format as EliminationMatchesFormat).seriesType;
          advancementView = [
            (
              <Grid.Column key={"key#1"} width={4}>
                <Form.Dropdown fluid={true} selection={true} options={DropdownData.AllianceCaptainItems} value={elimsAlliances} onChange={this.setAdvancementEliminationsAlliances} error={!tournamentValidator.isValidRounds()} label="Alliance Captains"/>
              </Grid.Column>
            ),
            (
              <Grid.Column key={"key#2"} width={4}>
                <Form.Dropdown fluid={true} selection={true} options={DropdownData.SeriesTypeItems} value={elimsSeries} onChange={this.setAdvancementEliminationsSeries} error={!tournamentValidator.isValidRounds()} label="Series Type"/>
              </Grid.Column>
            )
          ];
          break;
        case "custom":
          advancementView = (
            <Grid.Column width={4}>
              <Form.Button fluid={true} label="Upload Config" color={getTheme().secondary} onClick={this.openFileChooser}>Choose Config</Form.Button>
            </Grid.Column>
          );
      }
    }

    return (
      <Form>
        <Grid>
          <Grid.Row columns={16}>
            <Grid.Column width={4}><Form.Dropdown fluid={true} selection={true} options={DropdownData.PostQualItems} value={eventConfig.tournamentConfig} error={!tournamentValidator.isValidConfig()} onChange={this.setAdvancementConfig} label="Advancement Config"/></Grid.Column>
            {advancementView}
            {
              eventConfig.tournamentConfig !== 'custom' &&
              <Grid.Column width={4}><NumericInput value={tournamentRound.format.teamsPerAlliance} onUpdate={this.setAdvancementTeamsPerAlliance} error={!tournamentValidator.isValidRounds()} label={"Advancement Teams Per Alliance"}/></Grid.Column>
            }
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

  /* Tournament config methods */
  private openFileChooser() {
    DialogManager.showOpenDialog({
      files: true,
      title: "EMS Tournament Config",
      filters: [{name: "JSON Files", extensions: ["json"]}],
      sendData: true
    }).then((data: any) => {
      try {
        this.props.eventConfig.tournament = JSON.parse(data.toString()).tournament.map((tJSON: any) => new TournamentRound().fromJSON(tJSON));
        this._validator.update(this.props.eventConfig, this.props.event);
        DialogManager.showInfoBox("EMS Tournament Manager", "Successfully imported tournament configuration.");
      } catch (e) {
        DialogManager.showErrorBox(new AppError(200, "Error while parsing JSON file.", e));
      }
    });
  }

  /* Online Download Methods */
  private downloadTOAData() {
    this.setState({downloadingData: true});
    UploadManager.initialize(this.props.eventConfig.uploadType, this.props.uploadConfig);
    UploadManager.getEvent(this.props.uploadConfig.eventKey).then((event: Event) => {
      if (event && event.eventKey && event.eventKey.length > 0) {
        this.props.setEvent(event);
        this.props.uploadConfig.enabled = true;
        this._validator.update(this.props.eventConfig, this.props.event);
        this.forceUpdate();
      } else {
        DialogManager.showInfoBox("Event Management System - Data Download", `Your Live Provider does not contain any event info for "${this.props.uploadConfig.eventKey}". Are you sure your event information is posted online?`);
      }
      this.setState({downloadingData: false});
    }).catch((error: HttpError) => {
      this.props.uploadConfig.enabled = false;
      console.log(error);
      this.setState({downloadingData: false});
      DialogManager.showErrorBox(error);
    });
  }

  /* TOA Configuration Methods */
  private setLiveEventKey(event: SyntheticEvent, props: InputProps) {
    if (typeof props.value === "string") {
      this.props.uploadConfig.eventKey = props.value;
      this.forceUpdate();
    }
  }

  private setApiKey(event: SyntheticEvent, props: InputProps) {
    if (typeof props.value === "string") {
      this.props.uploadConfig.toaConfig.apiKey = props.value;
      this.forceUpdate();
    }
  }

  private setSecret(event: SyntheticEvent, props: InputProps) {
    if (typeof props.value === "string") {
      this.props.uploadConfig.tbaConfig.secret = props.value;
      this.forceUpdate();
    }
  }

  private setClientId(event: SyntheticEvent, props: InputProps) {
    if (typeof props.value === "string") {
      this.props.uploadConfig.tbaConfig.clientId = props.value;
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

  private setConfigUploadLive(uploadLive: boolean) {
    this.props.eventConfig.uploadLive = uploadLive;
    this.props.selectConfigPreset(this.props.eventConfig);
    this.forceUpdate();
  }

  private setConfigUploadProvider(provider: number) {
    console.log('Updating Live Provider: ' + provider);
    this.props.eventConfig.uploadType = provider;
    UploadManager.initialize(provider, this.props.uploadConfig)
    this.props.selectConfigPreset(this.props.eventConfig);
    this.forceUpdate();
  }

  private setTeamsPerAlliance(newValue: number) {
    this.props.eventConfig.teamsPerAlliance = newValue;
    this.props.selectConfigPreset(this.props.eventConfig);
    this._validator.update(this.props.eventConfig, this.props.event);
    this.forceUpdate();
  }

  private setAdvancementTeamsPerAlliance(newValue: number) {
    const tournamentRound = Array.isArray(this.props.eventConfig.tournament) ? this.props.eventConfig.tournament[0] : this.props.eventConfig.tournament;
    tournamentRound.format.teamsPerAlliance = newValue;
    this.props.selectConfigPreset(this.props.eventConfig);
    this._validator.update(this.props.eventConfig, this.props.event);
    this.forceUpdate();
  }

  private setAdvancementRankingCutoff(event: SyntheticEvent, props: InputProps) {
    if (!isNaN(parseInt(props.value, 10))) {
      const tournamentRound = Array.isArray(this.props.eventConfig.tournament) ? this.props.eventConfig.tournament[0] : this.props.eventConfig.tournament;
      (tournamentRound.format as RankingMatchesFormat).rankingCutoff = parseInt(props.value, 10);
      this.props.selectConfigPreset(this.props.eventConfig);
      this._validator.update(this.props.eventConfig, this.props.event);
      this._tournamentValidator.update(this.props.eventConfig);
      this.forceUpdate();
    }
  }

  private setAdvancementConfig(event: SyntheticEvent, props: DropdownProps) {
    if (typeof props.value === "string") {
      this.props.eventConfig.tournamentConfig = props.value as PlayoffsType;
      if (props.value as PlayoffsType === "rr") {
        this.props.eventConfig.tournament = ROUND_ROBIN_PRESET;
      } else if (props.value as PlayoffsType === "ranking") {
        this.props.eventConfig.tournament = RANKING_PRESET;
      } else if (props.value as PlayoffsType === "elims") {
        this.props.eventConfig.tournament = ELIMINATIONS_PRESET;
      }
      this.props.selectConfigPreset(this.props.eventConfig);
      this._validator.update(this.props.eventConfig, this.props.event);
      this._tournamentValidator.update(this.props.eventConfig);
      this.forceUpdate();
    }
  }

  private setAdvancementEliminationsAlliances(event: SyntheticEvent, props: DropdownProps) {
    const value: string = props.value.toString();
    if (!isNaN(parseInt(value, 10))) {
      const tournamentRound = Array.isArray(this.props.eventConfig.tournament) ? this.props.eventConfig.tournament[0] : this.props.eventConfig.tournament;
      (tournamentRound.format as EliminationMatchesFormat).alliances = parseInt(value, 10);
      this.props.selectConfigPreset(this.props.eventConfig);
      this._validator.update(this.props.eventConfig, this.props.event);
      this._tournamentValidator.update(this.props.eventConfig);
      this.forceUpdate();
    }
  }

  private setAdvancementEliminationsSeries(event: SyntheticEvent, props: DropdownProps) {
    const value: string = props.value.toString();
    if (!isNaN(parseInt(value, 10))) {
      const tournamentRound = Array.isArray(this.props.eventConfig.tournament) ? this.props.eventConfig.tournament[0] : this.props.eventConfig.tournament;
      (tournamentRound.format as EliminationMatchesFormat).seriesType = value as SeriesType;
      this.props.selectConfigPreset(this.props.eventConfig);
      this._validator.update(this.props.eventConfig, this.props.event);
      this._tournamentValidator.update(this.props.eventConfig);
      this.forceUpdate();
    }
  }

  private setAdvancementRoundRobinAlliances(newValue: number) {
    const tournamentRound = Array.isArray(this.props.eventConfig.tournament) ? this.props.eventConfig.tournament[0] : this.props.eventConfig.tournament;
    (tournamentRound.format as RoundRobinFormat).alliances = newValue;
    this.props.selectConfigPreset(this.props.eventConfig);
    this._validator.update(this.props.eventConfig, this.props.event);
    this._tournamentValidator.update(this.props.eventConfig);
    this.forceUpdate();
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
      this.props.event.eventTypeKey = props.value;
      this.props.setEvent(this.props.event);
      this._validator.update(this.props.eventConfig, this.props.event);
      this.forceUpdate();
    }
  }

  private setEventCode(event: SyntheticEvent, props: InputProps) {
    if (typeof props.value === "string") {
      this.props.event.eventCode = props.value.toString().toUpperCase();
      console.log(this.props.event.eventKey)
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
    this.props.event.eventType = this.props.eventConfig.eventType;
    const uploadConfig = (this.props.eventConfig.uploadLive) ? this.props.uploadConfig.toJSON() : undefined;
    CONFIG_STORE.setAll({event: this.props.event.toJSON(), eventConfig: this.props.eventConfig.toJSON(), uploadConfig: uploadConfig}).catch((err) => console.log(err));
    EventCreationManager.createEventDatabase(this.props.eventConfig.eventType, this.props.event).then(() => {
      console.log(this.props.event);
      console.log(this.props.eventConfig);
      MatchManager.createTestMatch(this.props.event, this.props.eventConfig).then((match: Match) => {
        this.setState({creatingEvent: false});
        this.props.setNavigationDisabled(false);
        this.props.setTestMatches([match]);
        this.props.onComplete();
      }).catch((error: HttpError) => {
        this.setState({creatingEvent: false});
        this.props.setNavigationDisabled(false);
        console.log(error);
        DialogManager.showErrorBox(error);
      });
    }).catch((error: HttpError) => {
      this.setState({creatingEvent: false});
      this.props.setNavigationDisabled(false);
      console.log(error);
      DialogManager.showErrorBox(error);
    });
  }

}

export function mapStateToProps({configState}: IApplicationState) {
  return {
    eventConfig: configState.eventConfiguration,
    event: configState.event,
    uploadConfig: configState.uploadConfig
  };
}

export function mapDispatchToProps(dispatch: Dispatch<ApplicationActions>) {
  return {
    selectConfigPreset: (preset: EventConfiguration) => dispatch(setEventConfiguration(preset)),
    setEvent: (event: Event) => dispatch(setEvent(event)),
    setTestMatches: (matches: Match[]) => dispatch(setTestMatches(matches)),
    setNavigationDisabled: (disabled: boolean) => dispatch(disableNavigation(disabled))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EventSelection);
