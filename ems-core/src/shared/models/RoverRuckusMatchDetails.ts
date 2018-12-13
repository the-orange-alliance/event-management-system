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

  // Essentially Metadata
  private _redPreRobotOneStatus: number;
  private _redPreRobotTwoStatus: number;
  private _redAutoRobotOneStatus: number;
  private _redAutoRobotTwoStatus: number;
  private _redAutoRobotOneClaimed: boolean;
  private _redAutoRobotTwoClaimed: boolean;
  private _redEndRobotOneStatus: number;
  private _redEndRobotTwoStatus: number;
  private _bluePreRobotOneStatus: number;
  private _bluePreRobotTwoStatus: number;
  private _blueAutoRobotOneStatus: number;
  private _blueAutoRobotTwoStatus: number;
  private _blueAutoRobotOneClaimed: boolean;
  private _blueAutoRobotTwoClaimed: boolean;
  private _blueEndRobotOneStatus: number;
  private _blueEndRobotTwoStatus: number;

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

    // Metadata stuff done
    this._redPreRobotOneStatus = 0;
    this._redPreRobotTwoStatus = 0;
    this._redAutoRobotOneStatus = 0;
    this._redAutoRobotTwoStatus = 0;
    this._redAutoRobotOneClaimed = false;
    this._redAutoRobotTwoClaimed = false;
    this._redEndRobotOneStatus = 0;
    this._redEndRobotTwoStatus = 0;
    this._bluePreRobotOneStatus = 0;
    this._bluePreRobotTwoStatus = 0;
    this._blueAutoRobotOneStatus = 0;
    this._blueAutoRobotTwoStatus = 0;
    this._blueAutoRobotOneClaimed = false;
    this._blueAutoRobotTwoClaimed = false;
    this._blueEndRobotOneStatus = 0;
    this._blueEndRobotTwoStatus = 0;
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
      blue_end_robots_in_crater_full: this.blueEndRobotsInCraterFull,
      red_pre_robot_one_status: this.redPreRobotOneStatus,
      red_pre_robot_two_status: this.redPreRobotTwoStatus,
      red_auto_robot_one_status: this.redAutoRobotOneStatus,
      red_auto_robot_two_status: this.redAutoRobotTwoStatus,
      red_auto_robot_one_claimed: this.redAutoRobotOneClaimed ? 1 : 0,
      red_auto_robot_two_claimed: this.redAutoRobotTwoClaimed ? 1 : 0,
      red_end_robot_one_status: this.redEndRobotOneStatus,
      red_end_robot_two_status: this.redEndRobotTwoStatus,
      blue_pre_robot_one_status: this.bluePreRobotOneStatus,
      blue_pre_robot_two_status: this.bluePreRobotTwoStatus,
      blue_auto_robot_one_status: this.blueAutoRobotOneStatus,
      blue_auto_robot_two_status: this.blueAutoRobotTwoStatus,
      blue_auto_robot_one_claimed: this.blueAutoRobotOneClaimed ? 1 : 0,
      blue_auto_robot_two_claimed: this.blueAutoRobotTwoClaimed ? 1 : 0,
      blue_end_robot_one_status: this.blueEndRobotOneStatus,
      blue_end_robot_two_status: this.blueEndRobotTwoStatus
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
    details.redPreRobotOneStatus = json.red_pre_robot_one_status;
    details.redPreRobotTwoStatus = json.red_pre_robot_two_status;
    details.redAutoRobotOneStatus = json.red_auto_robot_one_status;
    details.redAutoRobotTwoStatus = json.red_auto_robot_two_status;
    details.redAutoRobotOneClaimed = json.red_auto_robot_one_claimed === 1;
    details.redAutoRobotTwoClaimed = json.red_auto_robot_two_claimed === 1;
    details.redEndRobotOneStatus = json.red_end_robot_one_status;
    details.redEndRobotTwoStatus = json.red_end_robot_two_status;
    details.bluePreRobotOneStatus = json.blue_pre_robot_one_status;
    details.bluePreRobotTwoStatus = json.blue_pre_robot_two_status;
    details.blueAutoRobotOneStatus = json.blue_auto_robot_one_status;
    details.blueAutoRobotTwoStatus = json.blue_auto_robot_two_status;
    details.blueAutoRobotOneClaimed = json.blue_auto_robot_one_claimed === 1;
    details.blueAutoRobotTwoClaimed = json.blue_auto_robot_two_claimed === 1;
    details.blueEndRobotOneStatus = json.blue_end_robot_one_status;
    details.blueEndRobotTwoStatus = json.blue_end_robot_two_status;
    return details;
  }

  public getRedAutoScore(): number {
    let redSum: number = 0;
    redSum += this.redPreRobotOneStatus === 3 ? 30 : 0;
    redSum += this.redPreRobotTwoStatus === 3 ? 30 : 0;
    redSum += this.redAutoRobotOneClaimed ? 15: 0;
    redSum += this.redAutoRobotTwoClaimed ? 15 : 0;
    redSum += this.redAutoRobotOneStatus === 1 ? 10 : 0;
    redSum += this.redAutoRobotTwoStatus === 1 ? 10 : 0;
    redSum += this.redAutoSuccessfulSamples * 25;
    redSum += this.redAutoCargoSilverMinerals * 5;
    redSum += this.redAutoCargoGoldMinerals * 5;
    redSum += this.redAutoDepotMinerals * 2;
    return redSum;
  }

  public getRedTeleScore(): number {
    let redSum: number = 0;
    redSum += this.redTeleCargoSilverMinerals * 5;
    redSum += this.redTeleCargoGoldMinerals * 5;
    redSum += this.redTeleDepotMinerals * 2;
    return redSum;
  }

  public getRedEndScore(): number {
    let redSum: number = 0;
    switch (this.redEndRobotOneStatus) {
      case 1:
        redSum += 50;
        break;
      case 2:
        redSum += 15;
        break;
      case 3:
        redSum += 25;
        break;
      default:
        redSum += 0;
    }
    switch (this.redEndRobotTwoStatus) {
      case 1:
        redSum += 50;
        break;
      case 2:
        redSum += 15;
        break;
      case 3:
        redSum += 25;
        break;
      default:
        redSum += 0;
    }
    return redSum;
  }

  public getRedPenalty(minPen: number, majPen: number): number {
    return minPen * 10 + majPen * 40;
  }

  public getRedScore(blueMinPen: number, blueMajPen: number): number {
    let redSum: number = 0;
    redSum += this.redPreRobotOneStatus === 3 ? 30 : 0;
    redSum += this.redPreRobotTwoStatus === 3 ? 30 : 0;
    redSum += this.redAutoRobotOneClaimed ? 15: 0;
    redSum += this.redAutoRobotTwoClaimed ? 15 : 0;
    redSum += this.redAutoRobotOneStatus === 1 ? 10 : 0;
    redSum += this.redAutoRobotTwoStatus === 1 ? 10 : 0;
    redSum += this.redAutoSuccessfulSamples * 25;
    redSum += this.redAutoCargoSilverMinerals * 5;
    redSum += this.redAutoCargoGoldMinerals * 5;
    redSum += this.redAutoDepotMinerals * 2;
    redSum += this.redTeleCargoSilverMinerals * 5;
    redSum += this.redTeleCargoGoldMinerals * 5;
    redSum += this.redTeleDepotMinerals * 2;
    switch (this.redEndRobotOneStatus) {
      case 1:
        redSum += 50;
        break;
      case 2:
        redSum += 15;
        break;
      case 3:
        redSum += 25;
        break;
      default:
        redSum += 0;
    }
    switch (this.redEndRobotTwoStatus) {
      case 1:
        redSum += 50;
        break;
      case 2:
        redSum += 15;
        break;
      case 3:
        redSum += 25;
        break;
      default:
        redSum += 0;
    }
    redSum += blueMinPen * 10;
    redSum += blueMajPen * 40;
    return redSum;
  }

  public getBlueAutoScore(): number {
    let blueSum: number = 0;
    blueSum += this.bluePreRobotOneStatus === 3 ? 30 : 0;
    blueSum += this.bluePreRobotTwoStatus === 3 ? 30 : 0;
    blueSum += this.blueAutoRobotOneClaimed ? 15: 0;
    blueSum += this.blueAutoRobotTwoClaimed ? 15 : 0;
    blueSum += this.blueAutoRobotOneStatus === 1 ? 10 : 0;
    blueSum += this.blueAutoRobotTwoStatus === 1 ? 10 : 0;
    blueSum += this.blueAutoSuccessfulSamples * 25;
    blueSum += this.blueAutoCargoSilverMinerals * 5;
    blueSum += this.blueAutoCargoGoldMinerals * 5;
    blueSum += this.blueAutoDepotMinerals * 2;
    return blueSum;
  }

  public getBlueTeleScore(): number {
    let blueSum: number = 0;
    blueSum += this.blueTeleCargoSilverMinerals * 5;
    blueSum += this.blueTeleCargoGoldMinerals * 5;
    blueSum += this.blueTeleDepotMinerals * 2;
    return blueSum;
  }

  public getBlueEndScore(): number {
    let blueSum: number = 0;
    switch (this.blueEndRobotOneStatus) {
      case 1:
        blueSum += 50;
        break;
      case 2:
        blueSum += 15;
        break;
      case 3:
        blueSum += 25;
        break;
      default:
        blueSum += 0;
    }
    switch (this.blueEndRobotTwoStatus) {
      case 1:
        blueSum += 50;
        break;
      case 2:
        blueSum += 15;
        break;
      case 3:
        blueSum += 25;
        break;
      default:
        blueSum += 0;
    }
    return blueSum;
  }

  public getBluePenalty(minPen: number, majPen: number): number {
    return minPen * 10 + majPen * 40;
  }

  public getBlueScore(redMinPen: number, redMajPen: number): number {
    let blueSum: number = 0;
    blueSum += this.bluePreRobotOneStatus === 3 ? 30 : 0;
    blueSum += this.bluePreRobotTwoStatus === 3 ? 30 : 0;
    blueSum += this.blueAutoRobotOneClaimed ? 15: 0;
    blueSum += this.blueAutoRobotTwoClaimed ? 15 : 0;
    blueSum += this.blueAutoRobotOneStatus === 1 ? 10 : 0;
    blueSum += this.blueAutoRobotTwoStatus === 1 ? 10 : 0;
    blueSum += this.blueAutoSuccessfulSamples * 25;
    blueSum += this.blueAutoCargoSilverMinerals * 5;
    blueSum += this.blueAutoCargoGoldMinerals * 5;
    blueSum += this.blueAutoDepotMinerals * 2;
    blueSum += this.blueTeleCargoSilverMinerals * 5;
    blueSum += this.blueTeleCargoGoldMinerals * 5;
    blueSum += this.blueTeleDepotMinerals * 2;
    switch (this.blueEndRobotOneStatus) {
      case 1:
        blueSum += 50;
        break;
      case 2:
        blueSum += 15;
        break;
      case 3:
        blueSum += 25;
        break;
      default:
        blueSum += 0;
    }
    switch (this.blueEndRobotTwoStatus) {
      case 1:
        blueSum += 50;
        break;
      case 2:
        blueSum += 15;
        break;
      case 3:
        blueSum += 25;
        break;
      default:
        blueSum += 0;
    }
    blueSum += redMinPen * 10;
    blueSum += redMajPen * 40;
    return blueSum;
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

  get redPreRobotOneStatus(): number {
    return this._redPreRobotOneStatus;
  }

  set redPreRobotOneStatus(value: number) {
    this._redPreRobotOneStatus = value;
  }

  get redPreRobotTwoStatus(): number {
    return this._redPreRobotTwoStatus;
  }

  set redPreRobotTwoStatus(value: number) {
    this._redPreRobotTwoStatus = value;
  }

  get redAutoRobotOneStatus(): number {
    return this._redAutoRobotOneStatus;
  }

  set redAutoRobotOneStatus(value: number) {
    this._redAutoRobotOneStatus = value;
  }

  get redAutoRobotTwoStatus(): number {
    return this._redAutoRobotTwoStatus;
  }

  set redAutoRobotTwoStatus(value: number) {
    this._redAutoRobotTwoStatus = value;
  }

  get redEndRobotOneStatus(): number {
    return this._redEndRobotOneStatus;
  }

  set redEndRobotOneStatus(value: number) {
    this._redEndRobotOneStatus = value;
  }

  get redEndRobotTwoStatus(): number {
    return this._redEndRobotTwoStatus;
  }

  set redEndRobotTwoStatus(value: number) {
    this._redEndRobotTwoStatus = value;
  }

  get bluePreRobotOneStatus(): number {
    return this._bluePreRobotOneStatus;
  }

  set bluePreRobotOneStatus(value: number) {
    this._bluePreRobotOneStatus = value;
  }

  get bluePreRobotTwoStatus(): number {
    return this._bluePreRobotTwoStatus;
  }

  set bluePreRobotTwoStatus(value: number) {
    this._bluePreRobotTwoStatus = value;
  }

  get blueAutoRobotOneStatus(): number {
    return this._blueAutoRobotOneStatus;
  }

  set blueAutoRobotOneStatus(value: number) {
    this._blueAutoRobotOneStatus = value;
  }

  get blueAutoRobotTwoStatus(): number {
    return this._blueAutoRobotTwoStatus;
  }

  set blueAutoRobotTwoStatus(value: number) {
    this._blueAutoRobotTwoStatus = value;
  }

  get blueEndRobotOneStatus(): number {
    return this._blueEndRobotOneStatus;
  }

  set blueEndRobotOneStatus(value: number) {
    this._blueEndRobotOneStatus = value;
  }

  get blueEndRobotTwoStatus(): number {
    return this._blueEndRobotTwoStatus;
  }

  set blueEndRobotTwoStatus(value: number) {
    this._blueEndRobotTwoStatus = value;
  }

  get redAutoRobotOneClaimed(): boolean {
    return this._redAutoRobotOneClaimed;
  }

  set redAutoRobotOneClaimed(value: boolean) {
    this._redAutoRobotOneClaimed = value;
  }

  get redAutoRobotTwoClaimed(): boolean {
    return this._redAutoRobotTwoClaimed;
  }

  set redAutoRobotTwoClaimed(value: boolean) {
    this._redAutoRobotTwoClaimed = value;
  }

  get blueAutoRobotOneClaimed(): boolean {
    return this._blueAutoRobotOneClaimed;
  }

  set blueAutoRobotOneClaimed(value: boolean) {
    this._blueAutoRobotOneClaimed = value;
  }

  get blueAutoRobotTwoClaimed(): boolean {
    return this._blueAutoRobotTwoClaimed;
  }

  set blueAutoRobotTwoClaimed(value: boolean) {
    this._blueAutoRobotTwoClaimed = value;
  }
}