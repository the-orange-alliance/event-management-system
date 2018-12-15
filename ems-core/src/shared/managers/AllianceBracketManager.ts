import AllianceMember from "../models/AllianceMember";
import {EliminationsFormats} from "../AppTypes";
import Match from "../models/Match";
import MatchParticipant from "../models/MatchParticipant";

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
      const results: Match[] = [];
      // Octofinal matches
      if (options.allianceCaptains >= 16) {
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
            match.tournamentLevel = j + 10;
            match.fieldNumber = (j + 1) % options.fields === 0 ? options.fields : (j + 1) % options.fields;
            results.push(match);
            if (options.allianceCaptains === 16) {
              match.participants = this.getOctofinalTeams(j + 1, alliances);
              for (let k = 0; k < match.participants.length; k++) {
                match.participants[k].matchKey = match.matchKey;
                match.participants[k].matchParticipantKey = match.matchKey + "-T" + (k + 1);
              }
            }
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
            match.tournamentLevel = j + 20;
            match.fieldNumber = (j + 1) % options.fields === 0 ? options.fields : (j + 1) % options.fields;
            results.push(match);
            if (options.allianceCaptains === 8) {
              match.participants = this.getQuarterfinalTeams(j + 1, alliances);
              for (let k = 0; k < match.participants.length; k++) {
                match.participants[k].matchKey = match.matchKey;
                match.participants[k].matchParticipantKey = match.matchKey + "-T" + (k + 1);
              }
            }
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
            match.tournamentLevel = j + 30;
            match.fieldNumber = (j + 1) % options.fields === 0 ? options.fields : (j + 1) % options.fields;
            results.push(match);
            if (options.allianceCaptains === 4) {
              match.participants = this.getSemifinalTeams(j + 1, alliances);
              for (let k = 0; k < match.participants.length; k++) {
                match.participants[k].matchKey = match.matchKey;
                match.participants[k].matchParticipantKey = match.matchKey + "-T" + (k + 1);
              }
            }
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
        match.tournamentLevel = 40;
        match.fieldNumber = 1;
        results.push(match);
        if (options.allianceCaptains === 2) {
          match.participants = this.getFinalsTeams(i + 1, alliances);
          for (let k = 0; k < match.participants.length; k++) {
            match.participants[k].matchKey = match.matchKey;
            match.participants[k].matchParticipantKey = match.matchKey + "-T" + (k + 1);
          }
        }
      }
      resolve(results);
    });
  }

  private getOctofinalTeams(series: number, alliances: Map<number, AllianceMember[]>): MatchParticipant[] {
    let redAlliance: AllianceMember[] = [];
    let blueAlliance: AllianceMember[] = [];
    switch (series) {
      case 1:
        redAlliance = alliances.get(1);
        blueAlliance = alliances.get(16);
        break;
      case 2:
        redAlliance = alliances.get(8);
        blueAlliance = alliances.get(9);
        break;
      case 3:
        redAlliance = alliances.get(2);
        blueAlliance = alliances.get(15);
        break;
      case 4:
        redAlliance = alliances.get(7);
        blueAlliance = alliances.get(10);
        break;
      case 5:
        redAlliance = alliances.get(3);
        blueAlliance = alliances.get(14);
        break;
      case 6:
        redAlliance = alliances.get(6);
        blueAlliance = alliances.get(11);
        break;
      case 7:
        redAlliance = alliances.get(4);
        blueAlliance = alliances.get(13);
        break;
      case 8:
        redAlliance = alliances.get(5);
        blueAlliance = alliances.get(12);
        break;
    }
    return this.getParticipantsFromAlliance(redAlliance, blueAlliance);
  }

  private getQuarterfinalTeams(series: number, alliances: Map<number, AllianceMember[]>): MatchParticipant[] {
    let redAlliance: AllianceMember[] = [];
    let blueAlliance: AllianceMember[] = [];
    switch (series) {
      case 1:
        redAlliance = alliances.get(1);
        blueAlliance = alliances.get(8);
        break;
      case 2:
        redAlliance = alliances.get(4);
        blueAlliance = alliances.get(5);
        break;
      case 3:
        redAlliance = alliances.get(2);
        blueAlliance = alliances.get(7);
        break;
      case 4:
        redAlliance = alliances.get(3);
        blueAlliance = alliances.get(6);
        break;
    }
    return this.getParticipantsFromAlliance(redAlliance, blueAlliance);
  }

  private getSemifinalTeams(series: number, alliances: Map<number, AllianceMember[]>): MatchParticipant[] {
    let redAlliance: AllianceMember[] = [];
    let blueAlliance: AllianceMember[] = [];
    switch (series) {
      case 1:
        redAlliance = alliances.get(1);
        blueAlliance = alliances.get(4);
        break;
      case 2:
        redAlliance = alliances.get(2);
        blueAlliance = alliances.get(3);
        break;
    }
    return this.getParticipantsFromAlliance(redAlliance, blueAlliance);
  }

  private getFinalsTeams(series: number, alliances: Map<number, AllianceMember[]>): MatchParticipant[] {
    return this.getParticipantsFromAlliance(alliances.get(1), alliances.get(2));
  }

  private getParticipantsFromAlliance(redAlliance: AllianceMember[], blueAlliance: AllianceMember[]): MatchParticipant[] {
    const participants: MatchParticipant[] = [];
    for (let i = 0; i < redAlliance.length; i++) {
      const participant: MatchParticipant = new MatchParticipant();
      participant.allianceKey = redAlliance[i].allianceKey;
      participant.teamKey = redAlliance[i].teamKey;
      participant.surrogate = false;
      participant.station = 10 + i;
      participants.push(participant);
    }
    for (let i = 0; i < blueAlliance.length; i++) {
      const participant: MatchParticipant = new MatchParticipant();
      participant.allianceKey = blueAlliance[i].allianceKey;
      participant.teamKey = blueAlliance[i].teamKey;
      participant.surrogate = false;
      participant.station = 20 + i;
      participants.push(participant);
    }
    return participants;
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