import AllianceMember from "../models/AllianceMember";
import {EliminationsFormats} from "../AppTypes";
import Match from "../models/Match";

interface IBracketOptions {
  allianceCaptains: number,
  allianceMembers: AllianceMember[],
  format: EliminationsFormats,
  eventKey: string,
  fields: number
}

class AllianceBracketManager {
  private static _instance: AllianceBracketManager;

  public static getInstance(): AllianceBracketManager {
    if (typeof AllianceBracketManager._instance === "undefined") {
      AllianceBracketManager._instance = new AllianceBracketManager();
    }
    return AllianceBracketManager._instance;
  }

  private constructor() {}

  public generateBracket(options: IBracketOptions): Promise<Match[]> {
    return new Promise<Match[]>((resolve, reject) => {
      const alliances: Map<number, AllianceMember[]> = this.getAllianceMap(options.allianceMembers);
      console.log(alliances);
      const results: Match[] = [];
      // Octofinal matches
      if (options.allianceCaptains === 16) {
        for (let i = 0; i < this.getMatchesFromFormat(options.format); i++) { // Matches
          for (let j = 0; j < 8; j++) { // Series
            let matchStr = "";
            if (this.getMatchesFromFormat(options.format) > 1 && i + 1 === this.getMatchesFromFormat(options.format)) {
              matchStr = "Tiebreaker";
            } else {
              matchStr = this.getMatchesFromFormat(options.format) > 1 ? "Match " + (i + 1) : "";
            }
            const match: Match = new Match();
            match.matchKey = options.eventKey + "-E0" + (results.length < 9 ? "0" + (results.length + 1) : (results.length + 1));
            match.matchDetailKey = options.eventKey + "-E0" + (results.length < 9 ? "0" + (results.length + 1) : (results.length + 1)) + "D";
            match.matchName = `Octofinal ${j + 1} ${matchStr}`;
            match.tournamentLevel = i + 10;
            match.fieldNumber = (j + 1) % options.fields === 0 ? options.fields : (j + 1) % options.fields;
            results.push(match);
          }
        }
      }
      // Quarterfinal matches
      if (options.allianceCaptains >= 8) {
        for (let i = 0; i < this.getMatchesFromFormat(options.format); i++) { // Matches
          for (let j = 0; j < 4; j++) { // Series
            let matchStr = "";
            if (this.getMatchesFromFormat(options.format) > 1 && i + 1 === this.getMatchesFromFormat(options.format)) {
              matchStr = "Tiebreaker";
            } else {
              matchStr = this.getMatchesFromFormat(options.format) > 1 ? "Match " + (i + 1) : "";
            }
            const match: Match = new Match();
            match.matchKey = options.eventKey + "-E0" + (results.length < 9 ? "0" + (results.length + 1) : (results.length + 1));
            match.matchDetailKey = options.eventKey + "-E0" + (results.length < 9 ? "0" + (results.length + 1) : (results.length + 1)) + "D";
            match.matchName = `Quarterfinal ${j + 1} ${matchStr}`;
            match.tournamentLevel = i + 20;
            match.fieldNumber = (j + 1) % options.fields === 0 ? options.fields : (j + 1) % options.fields;
            results.push(match);
          }
        }
      }
      // Semifinal matches
      if (options.allianceCaptains >= 4) {
        for (let i = 0; i < this.getMatchesFromFormat(options.format); i++) { // Matches
          for (let j = 0; j < 2; j++) { // Series
            let matchStr = "";
            if (this.getMatchesFromFormat(options.format) > 1 && i + 1 === this.getMatchesFromFormat(options.format)) {
              matchStr = "Tiebreaker";
            } else {
              matchStr = this.getMatchesFromFormat(options.format) > 1 ? "Match " + (i + 1) : "";
            }
            const match: Match = new Match();
            match.matchKey = options.eventKey + "-E0" + (results.length < 9 ? "0" + (results.length + 1) : (results.length + 1));
            match.matchDetailKey = options.eventKey + "-E0" + (results.length < 9 ? "0" + (results.length + 1) : (results.length + 1)) + "D";
            match.matchName = `Semifinal ${j + 1} ${matchStr}`;
            match.tournamentLevel = i + 30;
            match.fieldNumber = (j + 1) % options.fields === 0 ? options.fields : (j + 1) % options.fields;
            results.push(match);
          }
        }
      }
      // Finals Matches
      for (let i = 0; i < this.getMatchesFromFormat(options.format); i++) { // Matches
        const matchStr = this.getMatchesFromFormat(options.format) > 1 ? "Match " + (i + 1) : "";
        const match: Match = new Match();
        match.matchKey = options.eventKey + "-E0" + (results.length < 9 ? "0" + (results.length + 1) : (results.length + 1));
        match.matchDetailKey = options.eventKey + "-E0" + (results.length < 9 ? "0" + (results.length + 1) : (results.length + 1)) + "D";
        match.matchName = `Finals ${matchStr}`;
        match.tournamentLevel = i + 30;
        match.fieldNumber = 1;
        results.push(match);
      }
      resolve(results);
    });
  }

  private getAllianceMap(allianceMembers: AllianceMember[]): Map<number, AllianceMember[]> {
    const alliances: Map<number, AllianceMember[]> = new Map<number, AllianceMember[]>();
    for (const member of allianceMembers) {
      if (typeof alliances.get(member.allianceRank) === "undefined") {
        alliances.set(member.allianceRank, []);
      }
      alliances.get(member.allianceRank).push(member);
    }
    return alliances;
  }

  private getMatchesFromFormat(format: EliminationsFormats): number {
    switch (format) {
      case "bo1":
        return 1;
      case "bo3":
        return 3;
      case "bo5":
        return 5;
      default:
        return 3;
    }
  }
}

export default AllianceBracketManager.getInstance();