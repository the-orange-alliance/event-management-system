import {Server, Socket} from "socket.io";
import MatchTimer from "../MatchTimer";
import ScoreCalculator from "./ScoreCalculator";
import ScoreManager from "../ScoreManager";
import ScoringTimerContainer from "../ScoringTimerContainer";

const WIND = 0;
const SOLAR_1 = 1;
const SOLAR_2 = 2;
const SOLAR_3 = 3;
const SOLAR_4 = 4;
const SOLAR_5 = 5;
const REACTOR = 6;

export default class RefereeEvents {

  private static _prevReactor = [[false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false]];
  private static _prevYellowCards = [[0, 0, 0], [0, 0, 0]];
  private static _prevRedCards = [[0, 0, 0], [0, 0, 0]];
  private static _prevBotsParked = [[false, false, false], [false, false, false]];

  public static initialize(server: Server, client: Socket, timer: MatchTimer) {
    /* Load ref tablet data */
    client.on("freshTablet", () => {
      const details: object = {
        red: ScoreManager.getDetails("red").toJSON(),
        blue: ScoreManager.getDetails("blue").toJSON()
      };
      client.emit("onFreshTablet", {scores: [ScoreCalculator.getRedSum(), ScoreCalculator.getBlueSum()], md: details, prevReactor: this._prevReactor, prevYellowCards: this._prevYellowCards, prevRedCards: this._prevRedCards, prevBotsParked: this._prevBotsParked, status: "PRESTART"});
    });

    client.on("reactorCubes", (obj) => {
      if (timer.inProgress()) {
        let alliance_str = obj.alliance;
        let alliance_index = (alliance_str === "red") ? 0 : 1;
        let opposite_alliance_index = (alliance_str === "red") ? 1 : 0;

        this._prevReactor[alliance_index] = obj.cubes;
        this._prevReactor[opposite_alliance_index] = [obj.cubes[3], obj.cubes[2], obj.cubes[1], obj.cubes[0], obj.cubes[7], obj.cubes[6], obj.cubes[5], obj.cubes[4]];
        ScoreManager.match.shared.reactor_cubes = this.countCubesInGrid(obj.cubes);
        server.to("referee").emit("onReactorCubes", {cubes: obj.cubes, alliance: alliance_str});

        if(ScoreManager.match.shared.reactor_cubes === 8) {
          server.to("referee").emit("reactorFull");
        }

        if(ScoreManager.match.shared.reactor_cubes === 8 && ScoreManager.getDetails(alliance_str).nuclearReactorPowerlineOn && ScoringTimerContainer.isStopped(alliance_index, REACTOR)) { //check this logic brain not working rn
          // console.log("Starting reactor timer.");
          ScoringTimerContainer.start(alliance_index, REACTOR);
        } else if(ScoreManager.match.shared.reactor_cubes === 8 && ScoreManager.getDetails(alliance_str).nuclearReactorPowerlineOn && !ScoringTimerContainer.isStopped(alliance_index, REACTOR)) {
          // console.log("reactor timer already running.");

        } else if(!ScoringTimerContainer.isStopped(alliance_index, REACTOR)) {
          // console.log("Stopping reactor timer.");
          ScoringTimerContainer.stop(alliance_index, REACTOR);
        }
      }
    });

    client.on("solar", (obj) => {
      if (timer.inProgress()) {
        let alliance_str = obj.alliance;
        let alliance_index = (alliance_str === "red") ? 0 : 1;

        server.to("referee").emit("onSolar", {alliance_index: alliance_index, value: obj.add, panel_index: obj.index});
        if(obj.add) {
          // console.log("solar. ", "alliance: ", alliance_str);
          if(ScoringTimerContainer.isStopped(alliance_index, obj.index + 1)) {/*add one because index is 0-4 and solar indices are 1-5*/
            // console.log("Starting solar panel ", obj.index + 1, " timer.");
            ScoringTimerContainer.start(alliance_index, obj.index + 1);
          }
        }  else if(!ScoringTimerContainer.isStopped(alliance_index, obj.index + 1)) {
          // console.log("Stopping solar ", obj.index + 1, " timer.");
          ScoringTimerContainer.stop(alliance_index, obj.index + 1);
        }
      }
    });

    client.on("windLine", (obj) => {
      if (timer.inProgress()) {
        // console.log("Got wind.");
        let alliance_str = obj.alliance;
        let alliance_index = (alliance_str === "red") ? 0 : 1;

        server.to("referee").emit("onPowerlineUpdate", {resource: 0, value: obj.val, alliance_index: alliance_index});
        if(obj.val) {
          // console.log("wind powerline.", "alliance: ", alliance_str);
          ScoreManager.getDetails(alliance_str).windTurbinePowerlineOn = true;
          if(ScoreManager.getDetails(alliance_str).windTurbineCranked) {
            // console.log("Starting wind timer.");
            ScoringTimerContainer.start(alliance_index, WIND);
          }
          console.log("Emitting 'setLED'");
          server.to("referee").emit("setLED", {alliance: alliance_str, type: "wind", mode: "active"});
        } else {
          ScoreManager.getDetails(alliance_str).windTurbinePowerlineOn = false;
          if(!ScoringTimerContainer.isStopped(alliance_index, WIND)) {
            // console.log("Stopping wind timer.");
            ScoringTimerContainer.stop(alliance_index, WIND);
          }
        }
      }
    });

    client.on("combustionLine", (obj) => {
      if (timer.inProgress()) {
        let alliance_str = obj.alliance;
        let alliance_index = (alliance_str === "red") ? 0 : 1;

        server.to("referee").emit("onPowerlineUpdate", {resource: 2, value: obj.val, alliance_index: alliance_index});
        if(obj.val) {
          // console.log("combustion powerline.", "alliance: ", alliance_str);
          ScoreManager.getDetails(alliance_str).combustionPowerlineOn = true;
          server.to("referee").emit("setLED", {alliance: alliance_str, type: "combustion", mode: "active"});
        } else {
          ScoreManager.getDetails(alliance_str).combustionPowerlineOn = false;
        }

        let score;
        if(alliance_str === "red") {
          score = ScoreCalculator.getRedSum();
          ScoreManager.match.redScore = score;
        } else {
          score = ScoreCalculator.getBlueSum();
          ScoreManager.match.blueScore = score;
        }
        server.to("scoring").emit("score-update", ScoreManager.match.toJSON());
      }
    });

    client.on("reactorLine", (obj) => {
      if (timer.inProgress()) {
        let alliance_str = obj.alliance;
        let alliance_index = (alliance_str === "red") ? 0 : 1;

        server.to("referee").emit("onPowerlineUpdate", {resource: 1, value: obj.val, alliance_index: alliance_index});
        if(obj.val) {
          // console.log("reactor powerline.", "alliance: ", alliance_str);
          ScoreManager.getDetails(alliance_str).nuclearReactorPowerlineOn = true;
          server.to("referee").emit("setLED", {alliance: alliance_str, type: "reactor", mode: "active"});
          if(ScoreManager.match.shared.reactor_cubes === 8) {
            // console.log("Starting reactor timer.");
            ScoringTimerContainer.start(alliance_index, REACTOR);
            server.to("referee").emit("reactorFull");
          }
        } else {
          ScoreManager.getDetails(alliance_str).nuclearReactorPowerlineOn = false;
          if(!ScoringTimerContainer.isStopped(alliance_index, REACTOR)) {
            // console.log("Stopping reactor timer.");
            ScoringTimerContainer.stop(alliance_index, REACTOR);
          }
        }
      }
    });

    client.on("coopLine", (obj) => {
      if (timer.inProgress()) {
        let alliance_str = obj.alliance;
        let alliance_index = (alliance_str === "red") ? 0 : 1;

        server.to("referee").emit("onPowerlineUpdate", {resource: 3, value: obj.val, alliance_index: alliance_index});
        server.to("referee").emit("setLED", {alliance: alliance_str, type: "coop", mode: "active"});
        if(obj.val) {
          ScoreManager.getDetails(alliance_str).coopertitionBonusPoints = 1;
        } else {
          ScoreManager.getDetails(alliance_str).coopertitionBonusPoints = 0;
        }

        ScoreManager.match.blueScore = ScoreCalculator.getBlueSum();
        ScoreManager.match.redScore = ScoreCalculator.getRedSum();
        console.log("Red score: ", ScoreManager.match.redScore);
        console.log("Blue score: ", ScoreManager.match.blueScore);
        server.to("scoring").emit("score-update", ScoreManager.match.toJSON());
      }
    });

    client.on("enableRedRotor", () => {
      server.to("referee").emit("onWindCrank", {value: true, alliance_index: 0});
      console.log("Cranking red rotor");
      ScoreManager.getDetails("red").windTurbineCranked = true;
      if(ScoreManager.getDetails("red").windTurbinePowerlineOn) {
        ScoringTimerContainer.start(0, WIND);
      }
    });

    client.on("enableBlueRotor", () => {
      server.to("referee").emit("onWindCrank", {value: true, alliance_index: 1});
      console.log("Cranking blue rotor");
      ScoreManager.getDetails("blue").windTurbineCranked = false;
      if(ScoreManager.getDetails("blue").windTurbinePowerlineOn) {
        ScoringTimerContainer.start(1, WIND);
      }
    });

    client.on("windCrank", (obj) => {
      if (timer.inProgress()) {
        let alliance_str = obj.alliance;
        let alliance_index = (alliance_str === "red") ? 0 : 1;
        server.to("referee").emit("onWindCrank", {value: obj.val, alliance_index: alliance_index});
        if(obj.val) {
          // console.log("wind crank.", "alliance: ", alliance_str);
          ScoreManager.getDetails(alliance_str).windTurbineCranked = true;
          if(ScoreManager.getDetails(alliance_str).windTurbinePowerlineOn) {
            // console.log("Starting wind timer.");
            ScoringTimerContainer.start(alliance_index, WIND);
          }
        }  else {
          ScoreManager.getDetails(alliance_str).windTurbineCranked = false;
          if(!ScoringTimerContainer.isStopped(alliance_index, WIND)) {
            // console.log("Stopping wind timer.");
            ScoringTimerContainer.stop(alliance_index, WIND);
          }
        }
      }
    });

    client.on("lowCoal", (obj) => {
      if (timer.inProgress()) {
        let alliance_str = obj.alliance;
        let alliance_index = (alliance_str === "red") ? 0 : 1;

        server.to("referee").emit("onLowCoal", {add: obj.add, alliance_index: alliance_index});
        if(obj.add) {
          // console.log("low combustion.", "alliance: ", obj.alliance);
          ScoreManager.getDetails(alliance_str).lowCombustionPoints++;
          server.to("referee").emit("combustionScored", {alliance_index: alliance_index});
          // console.log("Low combustion scored: ", EIMatchDetails[alliance_str].combustion_low);
        } else {
          ScoreManager.getDetails(alliance_str).lowCombustionPoints--;
          // console.log("Low combustion scored: ", EIMatchDetails[alliance_str].combustion_low);
        }

        let score;
        if(alliance_str === "red") {
          score = ScoreCalculator.getRedSum();
          ScoreManager.match.redScore = score;
        } else {
          score = ScoreCalculator.getBlueSum();
          ScoreManager.match.blueScore = score;
        }
        console.log("Red score: ", ScoreManager.match.redScore);
        console.log("Blue score: ", ScoreManager.match.blueScore);
        server.to("scoring").emit("score-update", ScoreManager.match.toJSON());
      }
    });

    client.on("highCoal", (obj) => {
      if (timer.inProgress()) {
        let alliance_str = obj.alliance;
        let alliance_index = (alliance_str === "red") ? 0 : 1;

        server.to("referee").emit("onHighCoal", {add: obj.add, alliance_index: alliance_index});
        if(obj.add) {
          // console.log("high combustion.", "alliance: ", obj.alliance);
          ScoreManager.getDetails(alliance_str).highCombustionPoints++;
          server.to("referee").emit("combustionScored", {alliance_index: alliance_index});
        } else {
          ScoreManager.getDetails(alliance_str).highCombustionPoints--;
        }

        let score;
        if(alliance_str === "red") {
          score = ScoreCalculator.getRedSum();
          ScoreManager.match.redScore = score;
        } else {
          score = ScoreCalculator.getBlueSum();
          ScoreManager.match.blueScore = score;
        }
        console.log("Red score: ", ScoreManager.match.redScore);
        console.log("Blue score: ", ScoreManager.match.blueScore);
        server.to("scoring").emit("score-update", ScoreManager.match.toJSON());
      }
    });

    client.on("parked", (obj) => {
      if (timer.inProgress()) {
        let alliance_str = obj.alliance;
        let alliance_index = (alliance_str === "red") ? 0 : 1;

        server.to("referee").emit("onParked", {alliance_index: alliance_index, botsParked: obj.botsParked});
        this._prevBotsParked[alliance_index] = obj.botsParked;
        // console.log("bots parked status changed by the ", obj.alliance, " alliance.");
        if(obj.add) {
          ScoreManager.getDetails(alliance_str).parkedRobotsPoints++;
        } else {
          ScoreManager.getDetails(alliance_str).parkedRobotsPoints--;
        }

        let score;
        if(alliance_str === "red") {
          score = ScoreCalculator.getRedSum();
          ScoreManager.match.redScore = score;
        } else {
          score = ScoreCalculator.getBlueSum();
          ScoreManager.match.blueScore = score;
        }
        console.log("Red score: ", ScoreManager.match.redScore);
        console.log("Blue score: ", ScoreManager.match.blueScore);
        server.to("scoring").emit("score-update", ScoreManager.match.toJSON());
      }
    });

    client.on("modifyFoul", (obj) => {
      if (timer.inProgress()) {
        console.log("alliance_str: ", obj.alliance_str);
        if (obj.alliance_str !== "red" && obj.alliance_str !== "blue") return;
        let score;
        if(obj.alliance_str === "red") { //swapped on purpose since opposite alliance is affected on penalties
          ScoreManager.match.redMinPen += obj.value;
          score = ScoreCalculator.getBlueSum();
          ScoreManager.match.blueScore = score;
          console.log("blue score: ", score);
        } else {
          ScoreManager.match.blueMinPen += obj.value;
          score = ScoreCalculator.getRedSum();
          ScoreManager.match.redScore = score;
          console.log("red score: ", score);
        }
        server.to("scoring").emit("score-update", ScoreManager.match.toJSON());
      }
    });

    client.on("modifyTechFoul", (obj) => {
      if (timer.inProgress()) {
        if (obj.alliance_str !== "red" && obj.alliance_str !== "blue") return;
        // console.log("Adding major penalty to ", alliance_str);

        let score;
        if(obj.alliance_str === "red") { //swapped on purpose since opposite alliance is affected on penalties
          ScoreManager.match.redMajPen += obj.value;
          score = ScoreCalculator.getBlueSum();
          ScoreManager.match.blueScore = score;
        } else {
          ScoreManager.match.blueMajPen += obj.value;
          score = ScoreCalculator.getRedSum();
          ScoreManager.match.redScore = score;
        }
        server.to("scoring").emit("score-update", ScoreManager.match.toJSON());
      }
    });

    client.on("modifyCard", (obj) => {
      if (timer.inProgress()) {
        if ((obj.team < 0 || obj.team > 5) && (obj.cardId < 0 || obj.cardId > 2)) return;
        // console.log("Penalty going to team ", obj.team);
        ScoreManager.match.cardStatuses[obj.team] = obj.cardId;
        server.to("scoring").emit("score-update", ScoreManager.match.toJSON());

        if(obj.team < 3) {
          server.to("referee").emit("onModifyCard", {alliance_index: obj.alliance_index, team_index: obj.team, cardId: obj.cardId});
          if(obj.cardId === 1) {
            this._prevYellowCards[0][obj.team]++;
          } else {
            this._prevRedCards[0][obj.team]++;
          }
        } else {
          console.log("Why is there a team index > 2?");
        }
      }
    });

  }

  public static resetVariables() {
    this._prevReactor = [[false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false]];
    this._prevYellowCards = [[0, 0, 0], [0, 0, 0]];
    this._prevRedCards = [[0, 0, 0], [0, 0, 0]];
    this._prevBotsParked = [[false, false, false], [false, false, false]];
  }

  static get prevReactor(): boolean[][] {
    return this._prevReactor;
  }

  static get prevYellowCards(): number[][] {
    return this._prevYellowCards;
  }

  static get prevRedCards(): number[][] {
    return this._prevRedCards;
  }

  static get prevBotsParked(): boolean[][] {
    return this._prevBotsParked;
  }

  private static countCubesInGrid(filled: any): any {
    let count = 0;
    for(let i = 0; i <8; i++) {
      if(filled[i]) {
        count++;
      }
    }
    return count;
  }
}
