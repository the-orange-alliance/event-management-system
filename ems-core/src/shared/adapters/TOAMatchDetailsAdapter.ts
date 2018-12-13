import MatchDetails from "../models/MatchDetails";
import TOAMatchDetails from "../models/toa/TOAMatchDetails";
import Match from "../models/Match";
import TOARoverRuckusDetails from "../models/toa/TOARoverRuckusDetails";
import RoverRuckusMatchDetails from "../models/RoverRuckusMatchDetails";

export default class TOAMatchDetailsAdapter {
  private _match: Match;
  private _matchDetails: MatchDetails;

  constructor(match: Match, details: MatchDetails) {
    this._match = match;
    this._matchDetails = details;
  }

  public get(): TOAMatchDetails {
    const details: TOAMatchDetails = this.getSeasonDetails();
    details.matchKey = this._match.matchKey + "-1";
    details.matchDetailKey = this._match.matchKey + "-1-DTL";
    details.redMinPen = this._match.redMinPen;
    details.redMajPen = this._match.redMajPen;
    details.blueMinPen = this._match.blueMinPen;
    details.blueMajPen = this._match.blueMajPen;
    this.assignDetails(details);
    return details;
  }

  private getSeasonDetails(): TOAMatchDetails {
    if (this._matchDetails instanceof RoverRuckusMatchDetails) {
      return new TOARoverRuckusDetails();
    } else {
      return new TOAMatchDetails();
    }
  }

  private assignDetails(details: TOAMatchDetails) {
    if (this._matchDetails instanceof RoverRuckusMatchDetails) {
      const redAutoLands = (this._matchDetails.redPreRobotOneStatus === 3 ? 1 : 0) + (this._matchDetails.redPreRobotTwoStatus === 3 ? 1 : 0);
      const redAutoClaims = (this._matchDetails.redAutoRobotOneClaimed ? 1 : 0) + (this._matchDetails.redAutoRobotTwoClaimed ? 1 : 0);
      const redAutoParks = (this._matchDetails.redAutoRobotOneStatus === 1 ? 1 : 0) + (this._matchDetails.redAutoRobotTwoStatus === 1 ? 1 : 0);
      const redEndLatches = (this._matchDetails.redEndRobotOneStatus === 1 ? 1 : 0) + (this._matchDetails.redEndRobotTwoStatus === 1 ? 1 : 0);
      const redEndComp = (this._matchDetails.redEndRobotOneStatus === 3 ? 1 : 0) + (this._matchDetails.redEndRobotTwoStatus === 3 ? 1 : 0);
      const redEndIn = (this._matchDetails.redEndRobotOneStatus === 2 ? 1 : 0) + (this._matchDetails.redEndRobotTwoStatus === 2 ? 1 : 0);
      (details as TOARoverRuckusDetails).redAutoLand = redAutoLands;
      (details as TOARoverRuckusDetails).redAutoClaim = redAutoClaims;
      (details as TOARoverRuckusDetails).redAutoSamp = this._matchDetails.redAutoSuccessfulSamples;
      (details as TOARoverRuckusDetails).redAutoPark = redAutoParks;
      (details as TOARoverRuckusDetails).redDriverDepot = this._matchDetails.redAutoDepotMinerals + this._matchDetails.redTeleDepotMinerals;
      (details as TOARoverRuckusDetails).redDriverSilver = this._matchDetails.redAutoCargoSilverMinerals + this._matchDetails.redTeleCargoSilverMinerals;
      (details as TOARoverRuckusDetails).redDriverGold = this._matchDetails.redAutoCargoGoldMinerals + this._matchDetails.redTeleCargoGoldMinerals;
      (details as TOARoverRuckusDetails).redEndLatch = redEndLatches;
      (details as TOARoverRuckusDetails).redEndIn = redEndIn;
      (details as TOARoverRuckusDetails).redEndComp = redEndComp;

      const blueAutoLands = (this._matchDetails.bluePreRobotOneStatus === 3 ? 1 : 0) + (this._matchDetails.bluePreRobotTwoStatus === 3 ? 1 : 0);
      const blueAutoClaims = (this._matchDetails.blueAutoRobotOneClaimed ? 1 : 0) + (this._matchDetails.blueAutoRobotTwoClaimed ? 1 : 0);
      const blueAutoParks = (this._matchDetails.blueAutoRobotOneStatus === 1 ? 1 : 0) + (this._matchDetails.blueAutoRobotTwoStatus === 1 ? 1 : 0);
      const blueEndLatches = (this._matchDetails.blueEndRobotOneStatus === 1 ? 1 : 0) + (this._matchDetails.blueEndRobotTwoStatus === 1 ? 1 : 0);
      const blueEndComp = (this._matchDetails.blueEndRobotOneStatus === 3 ? 1 : 0) + (this._matchDetails.blueEndRobotTwoStatus === 3 ? 1 : 0);
      const blueEndIn = (this._matchDetails.blueEndRobotOneStatus === 2 ? 1 : 0) + (this._matchDetails.blueEndRobotTwoStatus === 2 ? 1 : 0);
      (details as TOARoverRuckusDetails).blueAutoLand = blueAutoLands;
      (details as TOARoverRuckusDetails).blueAutoClaim = blueAutoClaims;
      (details as TOARoverRuckusDetails).blueAutoSamp = this._matchDetails.blueAutoSuccessfulSamples;
      (details as TOARoverRuckusDetails).blueAutoPark = blueAutoParks;
      (details as TOARoverRuckusDetails).blueDriverDepot = this._matchDetails.blueAutoDepotMinerals + this._matchDetails.blueTeleDepotMinerals;
      (details as TOARoverRuckusDetails).blueDriverSilver = this._matchDetails.blueAutoCargoSilverMinerals + this._matchDetails.blueTeleCargoSilverMinerals;
      (details as TOARoverRuckusDetails).blueDriverGold = this._matchDetails.blueAutoCargoGoldMinerals + this._matchDetails.blueTeleCargoGoldMinerals;
      (details as TOARoverRuckusDetails).blueEndLatch = blueEndLatches;
      (details as TOARoverRuckusDetails).blueEndIn = blueEndIn;
      (details as TOARoverRuckusDetails).blueEndComp = blueEndComp;
    }
  }
}