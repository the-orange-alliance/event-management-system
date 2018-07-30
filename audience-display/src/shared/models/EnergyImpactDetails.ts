export default class EnergyImpactDetails implements IPostableObject {
  private _windTurbinePoints: number;
  private _solarPanelPoints: number[];
  private _nuclearReactorPoints: number;
  private _lowCombustionPoints: number;
  private _highCombustionPoints: number;
  private _parkedRobotsPoints: number;
  private _coopertitionBonusPoints: number;
  private _windTurbinePowerlineOn: boolean;
  private _nuclearReactorPowerlineOn: boolean;
  private _combustionPowerlineOn: boolean;
  private _windTurbineCranked: boolean;
  private _nuclearReactorCubes: number;

  constructor() {
    this._windTurbinePoints = 0;
    this._solarPanelPoints = [0, 0, 0, 0, 0];
    this._nuclearReactorPoints = 0;
    this._lowCombustionPoints = 0;
    this._highCombustionPoints = 0;
    this._parkedRobotsPoints = 0;
    this._coopertitionBonusPoints = 0;
    this._windTurbinePowerlineOn = false;
    this._nuclearReactorPowerlineOn = false;
    this._combustionPowerlineOn = false;
    this._windTurbineCranked = false;
    this._nuclearReactorCubes = 0;
  }

  public toJSON(): object {
    return {
      wind_turbine_ownership: this.windTurbinePoints,
      solar_panel_one_ownership: this.solarPanelPoints[0],
      solar_panel_two_ownership: this.solarPanelPoints[1],
      solar_panel_three_ownership: this.solarPanelPoints[2],
      solar_panel_four_ownership: this.solarPanelPoints[3],
      solar_panel_five_ownership: this.solarPanelPoints[4],
      nuclear_reactor_ownership: this.nuclearReactorPoints,
      combustion_low: this.lowCombustionPoints,
      combustion_high: this.highCombustionPoints,
      robots_parked: this.parkedRobotsPoints,
      coopertition_bonus: this.coopertitionBonusPoints,
      wind_powerline_activated: this.windTurbinePowerlineOn ? 1 : 0,
      reactor_powerline: this.nuclearReactorPowerlineOn ? 1 : 0,
      combustion_powerline: this.combustionPowerlineOn ? 1 : 0,
      wind_turbine_cranked: this.windTurbineCranked ? 1 : 0
    };
  }

  public fromJSON(json: any): EnergyImpactDetails {
    const details: EnergyImpactDetails = new EnergyImpactDetails();
    details.windTurbinePoints = json.wind_turine_ownership;
    details.solarPanelPoints = [json.solar_panel_one_ownership, json.solar_panel_two_ownership, json.solar_panel_three_ownership, json.solar_panel_four_ownership, json.solar_panel_five_ownership];
    details.nuclearReactorPoints = json.nuclear_reactor_ownership;
    details.lowCombustionPoints = json.combustion_low;
    details.highCombustionPoints = json.combustion_high;
    details.parkedRobotsPoints = json.robots_parked;
    details.coopertitionBonusPoints = json.coopertition_bonus;
    details.windTurbinePowerlineOn = json.wind_powerline_activated === 1;
    details.nuclearReactorPowerlineOn = json.reactor_powerline === 1;
    details.combustionPowerlineOn = json.combustion_powerline === 1;
    details.windTurbineCranked = json.wind_turbine_cranked === 1;
    return details;
  }

  get windTurbinePoints(): number {
    return this._windTurbinePoints;
  }

  set windTurbinePoints(value: number) {
    this._windTurbinePoints = value;
  }

  get solarPanelPoints(): number[] {
    return this._solarPanelPoints;
  }

  set solarPanelPoints(value: number[]) {
    this._solarPanelPoints = value;
  }

  get nuclearReactorPoints(): number {
    return this._nuclearReactorPoints;
  }

  set nuclearReactorPoints(value: number) {
    this._nuclearReactorPoints = value;
  }

  get lowCombustionPoints(): number {
    return this._lowCombustionPoints;
  }

  set lowCombustionPoints(value: number) {
    this._lowCombustionPoints = value;
  }

  get highCombustionPoints(): number {
    return this._highCombustionPoints;
  }

  set highCombustionPoints(value: number) {
    this._highCombustionPoints = value;
  }

  get parkedRobotsPoints(): number {
    return this._parkedRobotsPoints;
  }

  set parkedRobotsPoints(value: number) {
    this._parkedRobotsPoints = value;
  }

  get coopertitionBonusPoints(): number {
    return this._coopertitionBonusPoints;
  }

  set coopertitionBonusPoints(value: number) {
    this._coopertitionBonusPoints = value;
  }

  get windTurbinePowerlineOn(): boolean {
    return this._windTurbinePowerlineOn;
  }

  set windTurbinePowerlineOn(value: boolean) {
    this._windTurbinePowerlineOn = value;
  }

  get nuclearReactorPowerlineOn(): boolean {
    return this._nuclearReactorPowerlineOn;
  }

  set nuclearReactorPowerlineOn(value: boolean) {
    this._nuclearReactorPowerlineOn = value;
  }

  get combustionPowerlineOn(): boolean {
    return this._combustionPowerlineOn;
  }

  set combustionPowerlineOn(value: boolean) {
    this._combustionPowerlineOn = value;
  }

  get windTurbineCranked(): boolean {
    return this._windTurbineCranked;
  }

  set windTurbineCranked(value: boolean) {
    this._windTurbineCranked = value;
  }

  get nuclearReactorCubes(): number {
    return this._nuclearReactorCubes;
  }

  set nuclearReactorCubes(value: number) {
    this._nuclearReactorCubes = value;
  }
}