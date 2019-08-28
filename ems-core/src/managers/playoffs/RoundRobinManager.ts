import {AllianceMember, Match, MatchParticipant} from "@the-orange-alliance/lib-ems";
import PlayoffsMatchManager from "./PlayoffsMatchManager";

export interface IRoundRobinOptions {
  allianceCaptains: number;
  allianceMembers: AllianceMember[];
  eventKey: string;
  fields: number;
}

class RoundRobinManager {
  private static _instance: RoundRobinManager;

  public static getInstance(): RoundRobinManager {
    if (typeof RoundRobinManager._instance === "undefined") {
      RoundRobinManager._instance = new RoundRobinManager();
    }
    return RoundRobinManager._instance;
  }

  private constructor() {}

  public generateMatches(playoffsMatchesLength: number, options: IRoundRobinOptions): Promise<Match[]> {
    return new Promise<Match[]>((resolve, reject) => {
      const alliances: Map<number, AllianceMember[]> = PlayoffsMatchManager.getAllianceMap(options.allianceMembers);
      const rounds: number = options.allianceCaptains - 1;
      const totalMatches: number = (options.allianceCaptains / 2) * (options.allianceCaptains - 1);
      const matchesPerRound: number = totalMatches / rounds;

      // Teams
      const upperTeams: AllianceMember[][] = [];
      const lowerTeams: AllianceMember[][] = [];
      for (let i = 0; i < options.allianceCaptains / 2; i++) {
        upperTeams.push(alliances.get(i + 1));
        lowerTeams.push(alliances.get((options.allianceCaptains / 2) + i + 1));
      }
      const matches: Match[] = [];
      for (let i = 0; i < options.allianceCaptains - 1; i++) {
        // console.log(upperTeams.map((a: AllianceMember[]) => a[0].allianceRank), lowerTeams.map((a: AllianceMember[]) => a[0].allianceRank)); // DEBUG - Makes sure each cycle was successful.
        for (let j = 0; j < matchesPerRound; j++) {
          const num: number = playoffsMatchesLength + matches.length + 1;
          const key: string = `${options.eventKey}-E${num.toString().padStart(3, '0')}`;
          const match: Match = new Match();
          const participants: MatchParticipant[] = [];
          let station: number = 0;
          for (const member of upperTeams[j]) {
            const participant: MatchParticipant = new MatchParticipant();
            participant.teamKey = member.teamKey;
            participant.matchKey = key;
            participant.matchParticipantKey = `${key}-T${participants.length + 1}`;
            participant.station = MatchParticipant.RED_ALLIANCE_ONE + station;
            participants.push(participant);
            station++;
          }
          station = 0;
          for (const member of lowerTeams[j]) {
            const participant: MatchParticipant = new MatchParticipant();
            participant.teamKey = member.teamKey;
            participant.matchKey = key;
            participant.matchParticipantKey = `${key}-T${participants.length + 1}`;
            participant.station = MatchParticipant.BLUE_ALLIANCE_ONE + station;
            participants.push(participant);
            station++;
          }
          match.matchKey = key;
          match.matchDetailKey = `${key}D`;
          match.tournamentLevel = Match.ROUND_ROBIN_LEVEL;
          match.matchName = `Round ${i + 1} Match ${j + 1}`;
          match.fieldNumber = (matches.length + 1) % options.fields === 0 ? options.fields : (matches.length + 1) % options.fields;
          match.participants = participants;
          matches.push(match);
        }
        // Perform circle scheduling algorithm
        const upperE: AllianceMember[] = upperTeams.pop();
        const lowerE: AllianceMember[] = lowerTeams.shift();
        upperTeams.splice(1, 0, lowerE);
        lowerTeams.push(upperE);
      }
      resolve(matches);
    });
  }
}

export default RoundRobinManager.getInstance();