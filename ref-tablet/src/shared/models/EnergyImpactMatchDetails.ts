import MatchDetails from "./MatchDetails";

export default class EnergyImpactMatchDetails extends MatchDetails implements IPostableObject {
  private _redSolarPanelOwnerships: number[];
  private _redWindTurbineOwnership: number;
  private _redNuclearReactorOwnership: number;
  private _redLowCombustionGoals: number;
  private _redHighCombustionGoals: number;
  private _redRobotsParked: number;
  private _redDidCoopertition: boolean;
  private _redWindTurbinePowerlineOn: boolean;
  private _redNuclearReactorPowerlineOn: boolean;
  private _redCombustionPowerlineOn: boolean;
  private _redWindTurbineCranked: boolean;

  private _blueSolarPanelOwnerships: number[];
  private _blueWindTurbineOwnership: number;
  private _blueNuclearReactorOwnership: number;
  private _blueLowCombustionGoals: number;
  private _blueHighCombustionGoals: number;
  private _blueRobotsParked: number;
  private _blueDidCoopertition: boolean;
  private _blueWindTurbinePowerlineOn: boolean;
  private _blueNuclearReactorPowerlineOn: boolean;
  private _blueCombustionPowerlineOn: boolean;
  private _blueWindTurbineCranked: boolean;

  private _sharedNuclearReactorCubes: number;

  constructor() {
    super();

    this._redSolarPanelOwnerships = [0, 0, 0, 0, 0];
    this._redWindTurbineOwnership = 0;
    this._redNuclearReactorOwnership = 0;
    this._redLowCombustionGoals = 0;
    this._redHighCombustionGoals = 0;
    this._redRobotsParked = 0;
    this._redDidCoopertition = false;
    this._redWindTurbinePowerlineOn = false;
    this._redNuclearReactorPowerlineOn = false;
    this._redWindTurbineCranked = false;

    this._blueSolarPanelOwnerships = [0, 0, 0, 0, 0];
    this._blueWindTurbineOwnership = 0;
    this._blueNuclearReactorOwnership = 0;
    this._blueLowCombustionGoals = 0;
    this._blueHighCombustionGoals = 0;
    this._blueRobotsParked = 0;
    this._blueDidCoopertition = false;
    this._blueWindTurbinePowerlineOn = false;
    this._blueNuclearReactorPowerlineOn = false;
    this._blueWindTurbineCranked = false;

    this._sharedNuclearReactorCubes = 0;
  }

  public toJSON(): object {
    return {
      match_key: this.matchKey,
      match_detail_key: this.matchDetailKey,
      red_solar_panel_one_ownership: this.redSolarPanelOwnerships[0],
      red_solar_panel_two_ownership: this.redSolarPanelOwnerships[1],
      red_solar_panel_three_ownership: this.redSolarPanelOwnerships[2],
      red_solar_panel_four_ownership: this.redSolarPanelOwnerships[3],
      red_solar_panel_five_ownership: this.redSolarPanelOwnerships[4],
      red_wind_turbine_ownership: this.redWindTurbineOwnership,
      red_nuclear_reactor_ownership: this.redNuclearReactorOwnership,
      red_combustion_low: this.redLowCombustionGoals,
      red_combustion_high: this.redHighCombustionGoals,
      red_robots_parked: this.redRobotsParked,
      red_coopertition_bonus: this.redDidCoopertition ? 1 : 0,
      red_wind_powerline_activated: this.redWindTurbinePowerlineOn ? 1 : 0,
      red_reactor_powerline: this.redNuclearReactorPowerlineOn ? 1 : 0,
      red_combustion_powerline: this.redCombustionPowerlineOn ? 1 : 0,
      red_wind_turbine_cranked: this.redWindTurbineCranked ? 1 : 0,
      blue_solar_panel_one_ownership: this.blueSolarPanelOwnerships[0],
      blue_solar_panel_two_ownership: this.blueSolarPanelOwnerships[1],
      blue_solar_panel_three_ownership: this.blueSolarPanelOwnerships[2],
      blue_solar_panel_four_ownership: this.blueSolarPanelOwnerships[3],
      blue_solar_panel_five_ownership: this.blueSolarPanelOwnerships[4],
      blue_wind_turbine_ownership: this.blueWindTurbineOwnership,
      blue_nuclear_reactor_ownership: this.blueNuclearReactorOwnership,
      blue_combustion_low: this.blueLowCombustionGoals,
      blue_combustion_high: this.blueHighCombustionGoals,
      blue_robots_parked: this.blueRobotsParked,
      blue_coopertition_bonus: this.blueDidCoopertition ? 1 : 0,
      blue_wind_powerline_activated: this.blueWindTurbinePowerlineOn ? 1 : 0,
      blue_reactor_powerline: this.blueNuclearReactorPowerlineOn ? 1 : 0,
      blue_combustion_powerline: this.blueCombustionPowerlineOn ? 1 : 0,
      blue_wind_turbine_cranked: this.blueWindTurbineCranked ? 1 : 0,
      reactor_cubes: this.sharedNuclearReactorCubes || 0
    };
  }

  public fromJSON(json: any): EnergyImpactMatchDetails {
    const details: EnergyImpactMatchDetails = new EnergyImpactMatchDetails();
    details.matchKey = json.match_key;
    details.matchDetailKey = json.match_detail_key;
    details.redSolarPanelOwnerships = [json.red_solar_panel_one_ownership, json.red_solar_panel_two_ownership, json.red_solar_panel_three_ownership, json.red_solar_panel_four_ownership, json.red_solar_panel_five_ownership];
    details.redWindTurbineOwnership = json.red_wind_turbine_ownership;
    details.redNuclearReactorOwnership = json.red_nuclear_reactor_ownership;
    details.redLowCombustionGoals = json.red_combustion_low;
    details.redHighCombustionGoals = json.red_combustion_high;
    details.redRobotsParked = json.red_robots_parked;
    details.redDidCoopertition = json.red_coopertition_bonus === 1;
    details.redWindTurbinePowerlineOn = json.red_wind_powerline_activated === 1;
    details.redNuclearReactorPowerlineOn = json.red_reactor_powerline === 1;
    details.redCombustionPowerlineOn = json.red_combustion_powerline === 1;
    details.redWindTurbineCranked = json.red_wind_turbine_cranked === 1;
    details.blueSolarPanelOwnerships = [json.blue_solar_panel_one_ownership, json.blue_solar_panel_two_ownership, json.blue_solar_panel_three_ownership, json.blue_solar_panel_four_ownership, json.blue_solar_panel_five_ownership];
    details.blueWindTurbineOwnership = json.blue_wind_turbine_ownership;
    details.blueNuclearReactorOwnership = json.blue_nuclear_reactor_ownership;
    details.blueLowCombustionGoals = json.blue_combustion_low;
    details.blueHighCombustionGoals = json.blue_combustion_high;
    details.blueRobotsParked = json.blue_robots_parked;
    details.blueDidCoopertition = json.blue_coopertition_bonus === 1;
    details.blueWindTurbinePowerlineOn = json.blue_wind_powerline_activated === 1;
    details.blueNuclearReactorPowerlineOn = json.blue_reactor_powerline === 1;
    details.blueCombustionPowerlineOn = json.blue_combustion_powerline === 1;
    details.blueWindTurbineCranked = json.blue_wind_turbine_cranked === 1;
    details.sharedNuclearReactorCubes = json.reactor_cubes;
    return details;
  }

  public getBlueScore(minPen: number, majPen: number): number {
    let score = 0;
    for (const solarPanelPoints of this.blueSolarPanelOwnerships) {
      score += solarPanelPoints;
    }
    score += this.blueWindTurbineOwnership;
    score += (this.blueNuclearReactorOwnership * 3);
    score += this.blueCombustionPowerlineOn ? (this.blueLowCombustionGoals * 5) : 0;
    score += this.blueCombustionPowerlineOn ? (this.blueHighCombustionGoals * 20) : 0;
    score += this.blueRobotsParked === 3 ? 50 : this.blueRobotsParked * 15;
    score += this.redDidCoopertition && this.blueDidCoopertition ? 100 : 0;
    score += (minPen * 30);
    return score;
  }

  public getRedScore(minPen: number, majPen: number): number {
    let score = 0;
    for (const solarPanelPoints of this.redSolarPanelOwnerships) {
      score += solarPanelPoints;
    }
    score += this.redWindTurbineOwnership;
    score += (this.redNuclearReactorOwnership * 3);
    score += this.redCombustionPowerlineOn ? (this.redLowCombustionGoals * 5) : 0;
    score += this.redCombustionPowerlineOn ? (this.redHighCombustionGoals * 20) : 0;
    score += this.redRobotsParked === 3 ? 50 : this.redRobotsParked * 15;
    score += this.redDidCoopertition && this.blueDidCoopertition ? 100 : 0;
    score += (minPen * 30);
    return score;
  }

  get redSolarPanelOwnerships(): number[] {
    return this._redSolarPanelOwnerships;
  }

  set redSolarPanelOwnerships(value: number[]) {
    this._redSolarPanelOwnerships = value;
  }

  get redWindTurbineOwnership(): number {
    return this._redWindTurbineOwnership;
  }

  set redWindTurbineOwnership(value: number) {
    this._redWindTurbineOwnership = value;
  }

  get redNuclearReactorOwnership(): number {
    return this._redNuclearReactorOwnership;
  }

  set redNuclearReactorOwnership(value: number) {
    this._redNuclearReactorOwnership = value;
  }

  get redLowCombustionGoals(): number {
    return this._redLowCombustionGoals;
  }

  set redLowCombustionGoals(value: number) {
    this._redLowCombustionGoals = value;
  }

  get redHighCombustionGoals(): number {
    return this._redHighCombustionGoals;
  }

  set redHighCombustionGoals(value: number) {
    this._redHighCombustionGoals = value;
  }

  get redRobotsParked(): number {
    return this._redRobotsParked;
  }

  set redRobotsParked(value: number) {
    this._redRobotsParked = value;
  }

  get redDidCoopertition(): boolean {
    return this._redDidCoopertition;
  }

  set redDidCoopertition(value: boolean) {
    this._redDidCoopertition = value;
  }

  get redWindTurbinePowerlineOn(): boolean {
    return this._redWindTurbinePowerlineOn;
  }

  set redWindTurbinePowerlineOn(value: boolean) {
    this._redWindTurbinePowerlineOn = value;
  }

  get redNuclearReactorPowerlineOn(): boolean {
    return this._redNuclearReactorPowerlineOn;
  }

  set redNuclearReactorPowerlineOn(value: boolean) {
    this._redNuclearReactorPowerlineOn = value;
  }

  get redCombustionPowerlineOn(): boolean {
    return this._redCombustionPowerlineOn;
  }

  set redCombustionPowerlineOn(value: boolean) {
    this._redCombustionPowerlineOn = value;
  }

  get redWindTurbineCranked(): boolean {
    return this._redWindTurbineCranked;
  }

  set redWindTurbineCranked(value: boolean) {
    this._redWindTurbineCranked = value;
  }

  get blueSolarPanelOwnerships(): number[] {
    return this._blueSolarPanelOwnerships;
  }

  set blueSolarPanelOwnerships(value: number[]) {
    this._blueSolarPanelOwnerships = value;
  }

  get blueWindTurbineOwnership(): number {
    return this._blueWindTurbineOwnership;
  }

  set blueWindTurbineOwnership(value: number) {
    this._blueWindTurbineOwnership = value;
  }

  get blueNuclearReactorOwnership(): number {
    return this._blueNuclearReactorOwnership;
  }

  set blueNuclearReactorOwnership(value: number) {
    this._blueNuclearReactorOwnership = value;
  }

  get blueLowCombustionGoals(): number {
    return this._blueLowCombustionGoals;
  }

  set blueLowCombustionGoals(value: number) {
    this._blueLowCombustionGoals = value;
  }

  get blueHighCombustionGoals(): number {
    return this._blueHighCombustionGoals;
  }

  set blueHighCombustionGoals(value: number) {
    this._blueHighCombustionGoals = value;
  }

  get blueRobotsParked(): number {
    return this._blueRobotsParked;
  }

  set blueRobotsParked(value: number) {
    this._blueRobotsParked = value;
  }

  get blueDidCoopertition(): boolean {
    return this._blueDidCoopertition;
  }

  set blueDidCoopertition(value: boolean) {
    this._blueDidCoopertition = value;
  }

  get blueWindTurbinePowerlineOn(): boolean {
    return this._blueWindTurbinePowerlineOn;
  }

  set blueWindTurbinePowerlineOn(value: boolean) {
    this._blueWindTurbinePowerlineOn = value;
  }

  get blueNuclearReactorPowerlineOn(): boolean {
    return this._blueNuclearReactorPowerlineOn;
  }

  set blueNuclearReactorPowerlineOn(value: boolean) {
    this._blueNuclearReactorPowerlineOn = value;
  }

  get blueCombustionPowerlineOn(): boolean {
    return this._blueCombustionPowerlineOn;
  }

  set blueCombustionPowerlineOn(value: boolean) {
    this._blueCombustionPowerlineOn = value;
  }

  get blueWindTurbineCranked(): boolean {
    return this._blueWindTurbineCranked;
  }

  set blueWindTurbineCranked(value: boolean) {
    this._blueWindTurbineCranked = value;
  }

  get sharedNuclearReactorCubes(): number {
    return this._sharedNuclearReactorCubes;
  }

  set sharedNuclearReactorCubes(value: number) {
    this._sharedNuclearReactorCubes = value;
  }
}