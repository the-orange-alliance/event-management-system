import {EliminationsFormats, EMSEventTypes, PostQualConfig, TeamIdentifier} from "../AppTypes";

export default class EventConfiguration implements IPostableObject {
  private _eventType: EMSEventTypes;
  private _postQualConfig: PostQualConfig;
  private _teamIdentifier: TeamIdentifier;
  private _requiresTOA: boolean;
  private _teamsPerAlliance: number;
  private _postQualTeamsPerAlliance: number;

  // Variables that are post-qual specific
  private _allianceCaptains: number;
  private _rankingCutoff: number;
  private _elimsFormat: EliminationsFormats;

  // Variables that aren't necessary in standard mode
  private _fieldsControlled: number[];

  constructor() {
    this._elimsFormat = "bo3";
  }


  public toJSON(): object {
    return {
      event_type: this.eventType,
      post_qual_config: this.postQualConfig,
      team_identifier: this.teamIdentifier,
      requires_toa: this.requiresTOA,
      teams_per_alliance: this.teamsPerAlliance,
      post_qual_teams_per_alliance: this.postQualTeamsPerAlliance,
      alliance_captains: this.allianceCaptains,
      ranking_cutoff: this.rankingCutoff,
      fields_controlled: this.fieldsControlled,
      elims_format: this.elimsFormat
    };
  }

  public fromJSON(json: any): EventConfiguration {
    const config: EventConfiguration = new EventConfiguration();
    config.eventType = json.event_type;
    config.postQualConfig = json.post_qual_config;
    config.teamIdentifier = json.team_identifier;
    config.requiresTOA = json.requires_toa;
    config.teamsPerAlliance = json.teams_per_alliance;
    config.postQualTeamsPerAlliance = json.post_qual_teams_per_alliance;
    config.allianceCaptains = json.alliance_captains;
    config.rankingCutoff = json.ranking_cutoff;
    config.fieldsControlled = json.fields_controlled;
    config.elimsFormat = json.elims_format;
    return config;
  }

  get eventType(): EMSEventTypes {
    return this._eventType;
  }

  set eventType(value: EMSEventTypes) {
    this._eventType = value;
  }

  get postQualConfig(): PostQualConfig {
    return this._postQualConfig;
  }

  set postQualConfig(value: PostQualConfig) {
    this._postQualConfig = value;
  }

  get teamIdentifier(): TeamIdentifier {
    return this._teamIdentifier;
  }

  set teamIdentifier(value: TeamIdentifier) {
    this._teamIdentifier = value;
  }

  get requiresTOA(): boolean {
    return this._requiresTOA;
  }

  set requiresTOA(value: boolean) {
    this._requiresTOA = value;
  }

  get teamsPerAlliance(): number {
    return this._teamsPerAlliance;
  }

  set teamsPerAlliance(value: number) {
    this._teamsPerAlliance = value;
  }

  get postQualTeamsPerAlliance(): number {
    return this._postQualTeamsPerAlliance;
  }

  set postQualTeamsPerAlliance(value: number) {
    this._postQualTeamsPerAlliance = value;
  }

  get allianceCaptains(): number {
    return this._allianceCaptains;
  }

  set allianceCaptains(value: number) {
    this._allianceCaptains = value;
  }

  get rankingCutoff(): number {
    return this._rankingCutoff;
  }

  set rankingCutoff(value: number) {
    this._rankingCutoff = value;
  }

  get fieldsControlled(): number[] {
    return this._fieldsControlled;
  }

  set fieldsControlled(value: number[]) {
    this._fieldsControlled = value;
  }

  get elimsFormat(): EliminationsFormats {
    return this._elimsFormat;
  }

  set elimsFormat(value: EliminationsFormats) {
    this._elimsFormat = value;
  }
}

export const FGC_EI_PRESET = new EventConfiguration();
FGC_EI_PRESET.eventType = "fgc_2018";
FGC_EI_PRESET.postQualConfig = "finals";
FGC_EI_PRESET.teamIdentifier = "country";
FGC_EI_PRESET.requiresTOA = false;
FGC_EI_PRESET.teamsPerAlliance = 3;
FGC_EI_PRESET.postQualTeamsPerAlliance = 3;
FGC_EI_PRESET.rankingCutoff = 32;

export const FTC_RELIC_PRESET = new EventConfiguration();
FTC_RELIC_PRESET.eventType = "ftc_1718";
FTC_RELIC_PRESET.postQualConfig = "elims";
FTC_RELIC_PRESET.teamIdentifier = "team_key";
FTC_RELIC_PRESET.requiresTOA = true;
FTC_RELIC_PRESET.allianceCaptains = 4;
FTC_RELIC_PRESET.teamsPerAlliance = 2;
FTC_RELIC_PRESET.postQualTeamsPerAlliance = 3;

export const FTC_ROVER_PRESET = new EventConfiguration();
FTC_ROVER_PRESET.eventType = "ftc_1819";
FTC_ROVER_PRESET.postQualConfig = "elims";
FTC_ROVER_PRESET.teamIdentifier = "team_key";
FTC_ROVER_PRESET.requiresTOA = true;
FTC_RELIC_PRESET.allianceCaptains = 4;
FTC_ROVER_PRESET.teamsPerAlliance = 2;
FTC_ROVER_PRESET.postQualTeamsPerAlliance = 3;

export const DEFAULT_RESET = new EventConfiguration();
DEFAULT_RESET.eventType = "ftc_1819";
DEFAULT_RESET.postQualConfig = "elims";
DEFAULT_RESET.teamIdentifier = "team_key";
DEFAULT_RESET.requiresTOA = true;
DEFAULT_RESET.allianceCaptains = 4;
DEFAULT_RESET.teamsPerAlliance = 2;
DEFAULT_RESET.postQualTeamsPerAlliance = 3;