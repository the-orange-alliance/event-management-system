import EnergyImpactDetails from "./EnergyImpactDetails";
import EnergyImpactMatchDetails from "../EnergyImpactMatchDetails";
import IMatchDetailsAdapter from "./IMatchDetailsAdapter";
import MatchDetails from "../MatchDetails";

export type SocketMatchDetails = EnergyImpactDetails;

export default class SocketMatch implements IPostableObject, IMatchDetailsAdapter {
  private _redScore: number;
  private _redMinPen: number;
  private _redMajPen: number;
  private _redDetails: SocketMatchDetails;
  private _blueScore: number;
  private _blueMinPen: number;
  private _blueMajPen: number;
  private _blueDetails: SocketMatchDetails;
  private _cardStatuses: number[];
  private _shared: any;

  constructor() {
    this._redScore = 0;
    this._redMinPen = 0;
    this._redMajPen = 0;
    this._redDetails = new EnergyImpactDetails();
    this._blueScore = 0;
    this._blueMinPen = 0;
    this._blueMajPen = 0;
    this._blueDetails = new EnergyImpactDetails();
    this._cardStatuses = [0, 0, 0, 0, 0, 0];
    this._shared = {};
  }

  public toMatchDetails(): MatchDetails {
    if (this.redDetails instanceof EnergyImpactDetails && this.blueDetails instanceof EnergyImpactDetails) {
      const details: EnergyImpactMatchDetails = new EnergyImpactMatchDetails();
      details.redSolarPanelOwnerships = this.redDetails.solarPanelPoints;
      details.redWindTurbineOwnership = this.redDetails.windTurbinePoints;
      details.redNuclearReactorOwnership = this.redDetails.nuclearReactorPoints;
      details.redLowCombustionGoals = this.redDetails.lowCombustionPoints;
      details.redHighCombustionGoals = this.redDetails.highCombustionPoints;
      details.redRobotsParked = this.redDetails.parkedRobotsPoints;
      details.redDidCoopertition = this.redDetails.coopertitionBonusPoints === 1;
      details.redWindTurbinePowerlineOn = this.redDetails.windTurbinePowerlineOn;
      details.redNuclearReactorPowerlineOn = this.redDetails.nuclearReactorPowerlineOn;
      details.redCombustionPowerlineOn = this.redDetails.combustionPowerlineOn;
      details.redWindTurbineCranked = this.redDetails.windTurbineCranked;
      details.blueSolarPanelOwnerships = this.blueDetails.solarPanelPoints;
      details.blueWindTurbineOwnership = this.blueDetails.windTurbinePoints;
      details.blueNuclearReactorOwnership = this.blueDetails.nuclearReactorPoints;
      details.blueLowCombustionGoals = this.blueDetails.lowCombustionPoints;
      details.blueHighCombustionGoals = this.blueDetails.highCombustionPoints;
      details.blueRobotsParked = this.blueDetails.parkedRobotsPoints;
      details.blueDidCoopertition = this.blueDetails.coopertitionBonusPoints === 1;
      details.blueWindTurbinePowerlineOn = this.blueDetails.windTurbinePowerlineOn;
      details.blueNuclearReactorPowerlineOn = this.blueDetails.nuclearReactorPowerlineOn;
      details.blueCombustionPowerlineOn = this.blueDetails.combustionPowerlineOn;
      details.blueWindTurbineCranked = this.blueDetails.windTurbineCranked;
      details.sharedNuclearReactorCubes = this.shared.reactor_cubes;
      return details;
    } else {
      return undefined;
    }
  }

  public toJSON(): object {
    return {
      red: {
        score: this.redScore,
        minPen: this.redMinPen,
        majPen: this.redMajPen,
        details: this.redDetails.toJSON()
      },
      blue: {
        score: this.blueScore,
        minPen: this.blueMinPen,
        majPen: this.blueMajPen,
        details: this.blueDetails.toJSON()
      },
      cardStatus: this.cardStatuses,
      shared: this.shared
    };
  }

  public fromJSON(json: any, details?: SocketMatchDetails): SocketMatch {
    const match: SocketMatch = new SocketMatch();
    match.redScore = json.red.score;
    match.redMinPen = json.red.minPen;
    match.redMajPen = json.red.majPen;
    match.redDetails = details.fromJSON(json.red.details);
    match.blueScore = json.blue.score;
    match.blueMinPen = json.blue.minPen;
    match.blueMajPen = json.blue.majPen;
    match.blueDetails = details.fromJSON(json.blue.details);
    match.cardStatuses = json.cardStatus;
    match.shared = json.shared;
    return match;
  }

  get redScore(): number {
    return this._redScore;
  }

  set redScore(value: number) {
    this._redScore = value;
  }

  get redMinPen(): number {
    return this._redMinPen;
  }

  set redMinPen(value: number) {
    this._redMinPen = value;
  }

  get redMajPen(): number {
    return this._redMajPen;
  }

  set redMajPen(value: number) {
    this._redMajPen = value;
  }

  get redDetails(): SocketMatchDetails {
    return this._redDetails;
  }

  set redDetails(value: SocketMatchDetails) {
    this._redDetails = value;
  }

  get blueScore(): number {
    return this._blueScore;
  }

  set blueScore(value: number) {
    this._blueScore = value;
  }

  get blueMinPen(): number {
    return this._blueMinPen;
  }

  set blueMinPen(value: number) {
    this._blueMinPen = value;
  }

  get blueMajPen(): number {
    return this._blueMajPen;
  }

  set blueMajPen(value: number) {
    this._blueMajPen = value;
  }

  get blueDetails(): SocketMatchDetails {
    return this._blueDetails;
  }

  set blueDetails(value: SocketMatchDetails) {
    this._blueDetails = value;
  }

  get cardStatuses(): number[] {
    return this._cardStatuses;
  }

  set cardStatuses(value: number[]) {
    this._cardStatuses = value;
  }

  get shared(): any {
    return this._shared;
  }

  set shared(value: any) {
    this._shared = value;
  }
}