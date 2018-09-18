import MatchDetails from "./MatchDetails";

export default class RoverRuckusMatchDetails extends MatchDetails implements IPostableObject {
  private _redAutoRobotsLanded: number;
  private _redAutoRobotsParked: number;
  private _redAutoSuccessfulSamples: number;
  private _redAutoDepotMinerals: number;
  private _redAutoCargoGoldMinerals: number;
  private _redAutoCargoSilverMinerals: number;
  private _redTeleDepotMinerals: number;
  private _redTeleCargoGoldMinerals: number;
  private _redTeleCargoSilverMinerals: number;
  private _redEndRobotsLatched: number;
  private _redEndRobotsInCraterPartial: number;
  private _redEndRobotsInCraterFull: number;
  private _blueAutoRobotsLanded: number;
  private _blueAutoRobotsParked: number;
  private _blueAutoSuccessfulSamples: number;
  private _blueAutoDepotMinerals: number;
  private _blueAutoCargoGoldMinerals: number;
  private _blueAutoCargoSilverMinerals: number;
  private _blueTeleDepotMinerals: number;
  private _blueTeleCargoGoldMinerals: number;
  private _blueTeleCargoSilverMinerals: number;
  private _blueEndRobotsLatched: number;
  private _blueEndRobotsInCraterPartial: number;
  private _blueEndRobotsInCraterFull: number;

  constructor() {
    super();
    this._redAutoRobotsLanded = 0;
    this._redAutoRobotsParked = 0;
    this._redAutoSuccessfulSamples = 0;
    this._redAutoDepotMinerals = 0;
    this._redAutoCargoGoldMinerals = 0;
    this._redAutoCargoSilverMinerals = 0;
    this._redTeleDepotMinerals = 0;
    this._redTeleCargoGoldMinerals = 0;
    this._redTeleCargoSilverMinerals = 0;
    this._redEndRobotsLatched = 0;
    this._redEndRobotsInCraterPartial = 0;
    this._redEndRobotsInCraterFull = 0;
    this._blueAutoRobotsLanded = 0;
    this._blueAutoRobotsParked = 0;
    this._blueAutoSuccessfulSamples = 0;
    this._blueAutoDepotMinerals = 0;
    this._blueAutoCargoGoldMinerals = 0;
    this._blueAutoCargoSilverMinerals = 0;
    this._blueTeleDepotMinerals = 0;
    this._blueTeleCargoGoldMinerals = 0;
    this._blueTeleCargoSilverMinerals = 0;
    this._blueEndRobotsLatched = 0;
    this._blueEndRobotsInCraterPartial = 0;
    this._blueEndRobotsInCraterFull = 0;
  }

  public toJSON(): object {
    return {
      match_key: this.matchKey,
      match_detail_key: this.matchDetailKey,
      red_auto_robots_landed: this.redAutoRobotsLanded,
      red_auto_robots_parked: this.redAutoRobotsParked,
      red_auto_successful_samples: this.redAutoSuccessfulSamples,
      red_auto_depot_minerals: this.redAutoDepotMinerals,
      red_auto_cargo_gold_minerals: this.redAutoCargoGoldMinerals,
      red_auto_cargo_silver_minerals: this.redAutoCargoSilverMinerals,
      red_tele_depot_minerals: this.redTeleDepotMinerals,
      red_tele_cargo_gold_minerals: this.redTeleCargoGoldMinerals,
      red_tele_cargo_silver_minerals: this.redTeleCargoSilverMinerals,
      red_end_robots_latched: this.redEndRobotsLatched,
      red_end_robots_in_crater_partial: this.redEndRobotsInCraterPartial,
      red_end_robots_in_crater_full: this.redEndRobotsInCraterFull,
      blue_auto_robots_landed: this.blueAutoRobotsLanded,
      blue_auto_robots_parked: this.blueAutoRobotsParked,
      blue_auto_successful_samples: this.blueAutoSuccessfulSamples,
      blue_auto_depot_minerals: this.blueAutoDepotMinerals,
      blue_auto_cargo_gold_minerals: this.blueAutoCargoGoldMinerals,
      blue_auto_cargo_silver_minerals: this.blueAutoCargoSilverMinerals,
      blue_tele_depot_minerals: this.blueTeleDepotMinerals,
      blue_tele_cargo_gold_minerals: this.blueTeleCargoGoldMinerals,
      blue_tele_cargo_silver_minerals: this.blueTeleCargoSilverMinerals,
      blue_end_robots_latched: this.blueEndRobotsLatched,
      blue_end_robots_in_crater_partial: this.blueEndRobotsInCraterPartial,
      blue_end_robots_in_crater_full: this.blueEndRobotsInCraterFull
    };
  }

  public fromJSON(json: any): RoverRuckusMatchDetails {
    const details: RoverRuckusMatchDetails = new RoverRuckusMatchDetails();
    details.matchKey = json.match_key;
    details.matchDetailKey = json.match_detail_key;
    details.redAutoRobotsLanded = json.red_auto_robots_landed;
    details.redAutoRobotsParked = json.red_auto_robots_parked;
    details.redAutoSuccessfulSamples = json.red_auto_successful_samples;
    details.redAutoDepotMinerals = json.red_auto_depot_minerals;
    details.redAutoCargoGoldMinerals = json.red_auto_cargo_gold_minerals;
    details.redAutoCargoSilverMinerals = json.red_auto_cargo_silver_minerals;
    details.redTeleDepotMinerals = json.red_tele_depot_minerals;
    details.redTeleCargoGoldMinerals = json.red_tele_cargo_gold_minerals;
    details.redTeleCargoSilverMinerals = json.red_tele_cargo_silver_minerals;
    details.redEndRobotsLatched = json.red_end_robots_latched;
    details.redEndRobotsInCraterPartial = json.red_end_robots_in_crater_partial;
    details.redEndRobotsInCraterFull = json.red_end_robots_in_crater_full;
    details.blueAutoRobotsLanded = json.blue_auto_robots_landed;
    details.blueAutoRobotsParked = json.blue_auto_robots_parked;
    details.blueAutoSuccessfulSamples = json.blue_auto_successful_samples;
    details.blueAutoDepotMinerals = json.blue_auto_depot_minerals;
    details.blueAutoCargoGoldMinerals = json.blue_auto_cargo_gold_minerals;
    details.blueAutoCargoSilverMinerals = json.blue_auto_cargo_silver_minerals;
    details.blueTeleDepotMinerals = json.blue_tele_depot_minerals;
    details.blueTeleCargoGoldMinerals = json.blue_tele_cargo_gold_minerals;
    details.blueTeleCargoSilverMinerals = json.blue_tele_cargo_silver_minerals;
    details.blueEndRobotsLatched = json.blue_end_robots_latched;
    details.blueEndRobotsInCraterPartial = json.blue_end_robots_in_crater_partial;
    details.blueEndRobotsInCraterFull = json.blue_end_robots_in_crater_full;
    return details;
  }

  get redAutoRobotsLanded(): number {
    return this._redAutoRobotsLanded;
  }

  set redAutoRobotsLanded(value: number) {
    this._redAutoRobotsLanded = value;
  }

  get redAutoRobotsParked(): number {
    return this._redAutoRobotsParked;
  }

  set redAutoRobotsParked(value: number) {
    this._redAutoRobotsParked = value;
  }

  get redAutoSuccessfulSamples(): number {
    return this._redAutoSuccessfulSamples;
  }

  set redAutoSuccessfulSamples(value: number) {
    this._redAutoSuccessfulSamples = value;
  }

  get redAutoDepotMinerals(): number {
    return this._redAutoDepotMinerals;
  }

  set redAutoDepotMinerals(value: number) {
    this._redAutoDepotMinerals = value;
  }

  get redAutoCargoGoldMinerals(): number {
    return this._redAutoCargoGoldMinerals;
  }

  set redAutoCargoGoldMinerals(value: number) {
    this._redAutoCargoGoldMinerals = value;
  }

  get redAutoCargoSilverMinerals(): number {
    return this._redAutoCargoSilverMinerals;
  }

  set redAutoCargoSilverMinerals(value: number) {
    this._redAutoCargoSilverMinerals = value;
  }

  get redTeleDepotMinerals(): number {
    return this._redTeleDepotMinerals;
  }

  set redTeleDepotMinerals(value: number) {
    this._redTeleDepotMinerals = value;
  }

  get redTeleCargoGoldMinerals(): number {
    return this._redTeleCargoGoldMinerals;
  }

  set redTeleCargoGoldMinerals(value: number) {
    this._redTeleCargoGoldMinerals = value;
  }

  get redTeleCargoSilverMinerals(): number {
    return this._redTeleCargoSilverMinerals;
  }

  set redTeleCargoSilverMinerals(value: number) {
    this._redTeleCargoSilverMinerals = value;
  }

  get redEndRobotsLatched(): number {
    return this._redEndRobotsLatched;
  }

  set redEndRobotsLatched(value: number) {
    this._redEndRobotsLatched = value;
  }

  get redEndRobotsInCraterPartial(): number {
    return this._redEndRobotsInCraterPartial;
  }

  set redEndRobotsInCraterPartial(value: number) {
    this._redEndRobotsInCraterPartial = value;
  }

  get redEndRobotsInCraterFull(): number {
    return this._redEndRobotsInCraterFull;
  }

  set redEndRobotsInCraterFull(value: number) {
    this._redEndRobotsInCraterFull = value;
  }

  get blueAutoRobotsLanded(): number {
    return this._blueAutoRobotsLanded;
  }

  set blueAutoRobotsLanded(value: number) {
    this._blueAutoRobotsLanded = value;
  }

  get blueAutoRobotsParked(): number {
    return this._blueAutoRobotsParked;
  }

  set blueAutoRobotsParked(value: number) {
    this._blueAutoRobotsParked = value;
  }

  get blueAutoSuccessfulSamples(): number {
    return this._blueAutoSuccessfulSamples;
  }

  set blueAutoSuccessfulSamples(value: number) {
    this._blueAutoSuccessfulSamples = value;
  }

  get blueAutoDepotMinerals(): number {
    return this._blueAutoDepotMinerals;
  }

  set blueAutoDepotMinerals(value: number) {
    this._blueAutoDepotMinerals = value;
  }

  get blueAutoCargoGoldMinerals(): number {
    return this._blueAutoCargoGoldMinerals;
  }

  set blueAutoCargoGoldMinerals(value: number) {
    this._blueAutoCargoGoldMinerals = value;
  }

  get blueAutoCargoSilverMinerals(): number {
    return this._blueAutoCargoSilverMinerals;
  }

  set blueAutoCargoSilverMinerals(value: number) {
    this._blueAutoCargoSilverMinerals = value;
  }

  get blueTeleDepotMinerals(): number {
    return this._blueTeleDepotMinerals;
  }

  set blueTeleDepotMinerals(value: number) {
    this._blueTeleDepotMinerals = value;
  }

  get blueTeleCargoGoldMinerals(): number {
    return this._blueTeleCargoGoldMinerals;
  }

  set blueTeleCargoGoldMinerals(value: number) {
    this._blueTeleCargoGoldMinerals = value;
  }

  get blueTeleCargoSilverMinerals(): number {
    return this._blueTeleCargoSilverMinerals;
  }

  set blueTeleCargoSilverMinerals(value: number) {
    this._blueTeleCargoSilverMinerals = value;
  }

  get blueEndRobotsLatched(): number {
    return this._blueEndRobotsLatched;
  }

  set blueEndRobotsLatched(value: number) {
    this._blueEndRobotsLatched = value;
  }

  get blueEndRobotsInCraterPartial(): number {
    return this._blueEndRobotsInCraterPartial;
  }

  set blueEndRobotsInCraterPartial(value: number) {
    this._blueEndRobotsInCraterPartial = value;
  }

  get blueEndRobotsInCraterFull(): number {
    return this._blueEndRobotsInCraterFull;
  }

  set blueEndRobotsInCraterFull(value: number) {
    this._blueEndRobotsInCraterFull = value;
  }
}