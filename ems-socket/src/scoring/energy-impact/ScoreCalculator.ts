import ScoreManager from "../ScoreManager";
import EIScoreTable from "./ScoreTable";

const RED = "red";
const BLUE = "blue";

export default class ScoreCalculator {

  public static getRedSum() {
    let solar_time = ScoreManager.getDetails(RED).solarPanelPoints[0] +  ScoreManager.getDetails(RED).solarPanelPoints[1] + ScoreManager.getDetails(RED).solarPanelPoints[2] + ScoreManager.getDetails(RED).solarPanelPoints[3] + ScoreManager.getDetails(RED).solarPanelPoints[4];
    let time_dependent_score = EIScoreTable.getSolarPts(solar_time) + EIScoreTable.getWindPts(ScoreManager.getDetails(RED).windTurbinePoints) + EIScoreTable.getReactorPts(ScoreManager.getDetails(RED).nuclearReactorPoints);
    let time_independent_score = EIScoreTable.getParkedPoints(ScoreManager.getDetails(RED).parkedRobotsPoints) + EIScoreTable.getCoopPoints(ScoreManager.getDetails(RED).coopertitionBonusPoints && ScoreManager.getDetails(BLUE).coopertitionBonusPoints);
    // console.log( EIScoreTable.getSolarPts(solar_time), EIScoreTable.getWindPts(ScoreManager.getDetails(RED).windTurbinePoints), EIScoreTable.getReactorPts(ScoreManager.getDetails(RED).nuclearReactorPoints));
    if(ScoreManager.getDetails(RED).combustionPowerlineOn) {
      time_independent_score += EIScoreTable.getLowPoints(ScoreManager.getDetails(RED).lowCombustionPoints) + EIScoreTable.getHighPoints(ScoreManager.getDetails(RED).highCombustionPoints);
    }

    let penalty_score = EIScoreTable.getYellowCardPoints(ScoreManager.match.blueMinPen); //get other team's penalties and add to this team's score
    return time_dependent_score + time_independent_score + penalty_score;
  }

  public static getBlueSum() {
    let solar_time = ScoreManager.getDetails(BLUE).solarPanelPoints[0] + ScoreManager.getDetails(BLUE).solarPanelPoints[1] +  ScoreManager.getDetails(BLUE).solarPanelPoints[2] + ScoreManager.getDetails(BLUE).solarPanelPoints[3] + ScoreManager.getDetails(BLUE).solarPanelPoints[4];
    let time_dependent_score = EIScoreTable.getSolarPts(solar_time) + EIScoreTable.getWindPts(ScoreManager.getDetails(BLUE).windTurbinePoints) + EIScoreTable.getReactorPts(ScoreManager.getDetails(BLUE).nuclearReactorPoints);
    let time_independent_score = EIScoreTable.getParkedPoints(ScoreManager.getDetails(BLUE).parkedRobotsPoints) + EIScoreTable.getCoopPoints(ScoreManager.getDetails(BLUE).coopertitionBonusPoints && ScoreManager.getDetails(RED).coopertitionBonusPoints);
    if(ScoreManager.getDetails(BLUE).combustionPowerlineOn) {
      time_independent_score += EIScoreTable.getLowPoints(ScoreManager.getDetails(BLUE).lowCombustionPoints) + EIScoreTable.getHighPoints(ScoreManager.getDetails(BLUE).highCombustionPoints);
    }
    // console.log( EIScoreTable.getSolarPts(solar_time), EIScoreTable.getWindPts(ScoreManager.getDetails(BLUE).windTurbinePoints), EIScoreTable.getReactorPts(ScoreManager.getDetails(BLUE).nuclearReactorPoints));
    let penalty_score = EIScoreTable.getYellowCardPoints(ScoreManager.match.redMinPen); //get other team's penalties and add to this team's score
    return time_dependent_score + time_independent_score + penalty_score;
  }
}