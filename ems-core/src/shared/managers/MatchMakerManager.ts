import AppError from "../models/AppError";
import Team from "../models/Team";
import {EliminationsFormats, TournamentLevels} from "../AppTypes";
import Match from "../models/Match";
import MatchParticipant from "../models/MatchParticipant";
import AllianceMember from "../models/AllianceMember";

const ipcRenderer = (window as any).require("electron").ipcRenderer;

interface IMatchMakerOptions {
  teams: number,
  rounds: number,
  quality: string,
  teamsPerAlliance: number,
  fields: number,
  eventKey: string,
  type: TournamentLevels
}

interface IBracketOptions {
  allianceCaptains: number,
  allianceMembers: AllianceMember[],
  format: EliminationsFormats,
  eventKey: string,
  fields: number
}

class MatchMakerManager {
  private static _instance: MatchMakerManager;

  public static getInstance(): MatchMakerManager {
    if (typeof MatchMakerManager._instance === "undefined") {
      MatchMakerManager._instance = new MatchMakerManager();
    }
    return MatchMakerManager._instance;
  }

  private constructor() {}

  public execute(options: IMatchMakerOptions): Promise<Match[]> {
    return new Promise<any>((resolve, reject) => {
      ipcRenderer.once("match-maker-success", (event: any, data: any) => {
        const matches: Match[] = [];
        for (const matchJSON of data) {
          const match = new Match().fromJSON(matchJSON);
          const participants: MatchParticipant[] = [];
          for (const participantJSON of matchJSON.participants) {
            participants.push(new MatchParticipant().fromJSON(participantJSON));
          }
          match.participants = participants;
          matches.push(match);
        }
        resolve(matches);
      });
      ipcRenderer.once("match-maker-error", (event: any, error: any) => {
        reject(new AppError(1500, "MATCH_MAKER_RUN", error));
      });
      ipcRenderer.send("match-maker", options);
    });
  }

  public createTeamList(teamList: Team[]): Promise<any[]> {
    return new Promise((resolve, reject) => {
      ipcRenderer.once("match-maker-teams-success", (event: any, data: any) => {
        resolve(data);
      });
      ipcRenderer.once("match-maker-teams-error", (event: any, error: any) => {
        reject(new AppError(1501, "MATCH_MAKER_TEAMS", error));
      });
      ipcRenderer.send("match-maker-teams", teamList.map(team => team.teamKey));
    });
  }

  // TODO - One day... One day, this should be cleaned.
  public createBracket(options: IBracketOptions): Promise<Match[]> {
    return new Promise<Match[]>((resolve, reject) => {
      const alliances: Map<number, AllianceMember[]> = new Map<number, AllianceMember[]>();
      for (const member of options.allianceMembers) {
        if (typeof alliances.get(member.allianceRank) === "undefined") {
          alliances.set(member.allianceRank, []);
        }
        alliances.get(member.allianceRank).push(member);
      }
      const results: Match[] = [];
      if (options.allianceCaptains === 8) { // We need to generate base alliance bracket
        // Begin quarterfinals
        for (let i = 0; i < 12; i++) {
          const match: Match = new Match();
          const series = i % 4 === 0 ? 1 : (i % 4) + 1;
          const matchNumber = Math.floor(i / 4) + 1;
          const matchStr = matchNumber === 3 ? "Tiebreaker" : `Match ${matchNumber}`;
          match.matchKey = options.eventKey + "-E0" + (results.length < 9 ? "0" + (results.length + 1) : (results.length + 1));
          match.matchDetailKey = options.eventKey + "-E0" + (results.length < 9 ? "0" + (results.length + 1) : (results.length + 1)) + "D";
          match.matchName = `Quarterfinal ${series} ${matchStr}`;
          match.fieldNumber = series % options.fields === 0 ? options.fields : series % options.fields;
          match.tournamentLevel = series + 20;
          const redAlliance: MatchParticipant[] = this.getRedAllianceFromSeries(series, alliances);
          for (let j = 0; j < redAlliance.length; j++) {
            redAlliance[j].matchKey = match.matchKey;
            redAlliance[j].matchParticipantKey = match.matchKey + "-T" + (j + 1);
          }
          const blueAlliance: MatchParticipant[] = this.getBlueAllianceFromSeries(series, alliances);
          for (let j = 0; j < blueAlliance.length; j++) {
            blueAlliance[j].matchKey = match.matchKey;
            blueAlliance[j].matchParticipantKey = match.matchKey + "-T" + (j + 1 + redAlliance.length);
          }
          match.participants = redAlliance.concat(blueAlliance);
          results.push(match);
        }
        // Begin semifinals
        for (let i = 0; i < 6; i++) {
          const match: Match = new Match();
          const series = i % 2 === 1 ? 2 : (i % 2) + 1;
          const matchNumber = Math.floor(i / 2) + 1;
          const matchStr = matchNumber === 3 ? "Tiebreaker" : `Match ${matchNumber}`;
          match.matchKey = options.eventKey + "-E0" + (results.length < 9 ? "0" + (results.length + 1) : (results.length + 1));
          match.matchDetailKey = options.eventKey + "-E0" + (results.length < 9 ? "0" + (results.length + 1) : (results.length + 1)) + "D";
          match.matchName = `Semifinal ${series} ${matchStr}`;
          match.fieldNumber = series % options.fields === 0 ? options.fields : series % options.fields;
          match.tournamentLevel = series + 30;
          results.push(match);
        }
      } else if (options.allianceCaptains === 4) { // We need to generate base alliance bracket
        for (let i = 0; i < 6; i++) {
          const match: Match = new Match();
          const series = i % 2 === 1 ? 2 : (i % 2) + 1;
          const matchNumber = Math.floor(i / 2) + 1;
          const matchStr = matchNumber === 3 ? "Tiebreaker" : `Match ${matchNumber}`;
          match.matchKey = options.eventKey + "-E0" + (results.length < 9 ? "0" + (results.length + 1) : (results.length + 1));
          match.matchDetailKey = options.eventKey + "-E0" + (results.length < 9 ? "0" + (results.length + 1) : (results.length + 1)) + "D";
          match.matchName = `Semifinal ${series} ${matchStr}`;
          match.fieldNumber = series % options.fields === 0 ? options.fields : series % options.fields;
          match.tournamentLevel = series + 30;
          const redAlliance: MatchParticipant[] = this.getRedAllianceFromSeries(series, alliances);
          for (let j = 0; j < redAlliance.length; j++) {
            redAlliance[j].matchKey = match.matchKey;
            redAlliance[j].matchParticipantKey = match.matchKey + "-T" + (j + 1);
          }
          const blueAlliance: MatchParticipant[] = this.getBlueAllianceFromSeries(series, alliances);
          for (let j = 0; j < blueAlliance.length; j++) {
            blueAlliance[j].matchKey = match.matchKey;
            blueAlliance[j].matchParticipantKey = match.matchKey + "-T" + (j + 1 + redAlliance.length);
          }
          match.participants = redAlliance.concat(blueAlliance);
          results.push(match);
        }
      }
      for (let i = 0; i < 3; i++) {
        const match: Match = new Match();
        match.matchKey = options.eventKey + "-E0" + (results.length < 9 ? "0" + (results.length + 1) : (results.length + 1));
        match.matchDetailKey = options.eventKey + "-E0" + (results.length < 9 ? "0" + (results.length + 1) : (results.length + 1)) + "D";
        match.matchName = `Finals Match ${i + 1}`;
        match.fieldNumber = 1;
        match.tournamentLevel = 40;
        results.push(match);
      }
      resolve(results);
    });
  }

  // Right now only works up to quarterfinals (8 alliances)
  private getRedAllianceFromSeries(series: number, members: Map<number, AllianceMember[]>): MatchParticipant[] {
    let alliance: AllianceMember[] = [];
    switch (series) {
      case 1:
        alliance = members.get(1);
        break;
      case 2:
        alliance = members.get(4);
        break;
      case 3:
        alliance = members.get(2);
        break;
      case 4:
        alliance = members.get(3);
        break;
    }
    const participants: MatchParticipant[] = [];
    for (let i = 0; i < alliance.length; i++) {
      const participant: MatchParticipant = new MatchParticipant();
      participant.allianceKey = alliance[i].allianceKey;
      participant.teamKey = alliance[i].teamKey;
      participant.surrogate = false;
      participant.station = 10 + i;
      participants.push(participant);
    }
    return participants;
  }


  private getBlueAllianceFromSeries(series: number, members: Map<number, AllianceMember[]>): MatchParticipant[] {
    let alliance: AllianceMember[] = [];
    switch (series) {
      case 1:
        alliance = members.get(8);
        break;
      case 2:
        alliance = members.get(5);
        break;
      case 3:
        alliance = members.get(7);
        break;
      case 4:
        alliance = members.get(6);
        break;
    }
    const participants: MatchParticipant[] = [];
    for (let i = 0; i < alliance.length; i++) {
      const participant: MatchParticipant = new MatchParticipant();
      participant.allianceKey = alliance[i].allianceKey;
      participant.teamKey = alliance[i].teamKey;
      participant.surrogate = false;
      participant.station = 20 + i;
      participants.push(participant);
    }
    return participants;
  }

}

export default MatchMakerManager.getInstance();