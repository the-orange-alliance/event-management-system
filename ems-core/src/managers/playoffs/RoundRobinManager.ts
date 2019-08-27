import {AllianceMember, Match} from "@the-orange-alliance/lib-ems";
import PlayoffsMatchManager from "./PlayoffsMatchManager";

export interface IRoundRobinOptions {
  allianceCaptains: number;
  allianceMembers: AllianceMember[];
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

  public generateMatches(playoffsMatchesLength: number, options: IRoundRobinOptions): Promise<Match> {
    return new Promise<Match>((resolve, reject) => {
      const alliances: Map<number, AllianceMember[]> = PlayoffsMatchManager.getAllianceMap(options.allianceMembers);
      // const rounds: number = options.allianceCaptains - 1;
      // const totalMatches: number = (options.allianceCaptains / 2) * (options.allianceCaptains - 1);
      // const matchesPerRound: number = totalMatches / rounds;

      // Teams
      const upperTeams: any[] = [];
      const lowerTeams: any[] = [];
      for (let i = 0; i < options.allianceCaptains / 2; i++) {
        upperTeams.push(alliances.get(i + 1));
        lowerTeams.push(alliances.get((options.allianceCaptains / 2) + i));
      }
      console.log(`${upperTeams}\n${lowerTeams}`);
      // for (let i = 0; i < options.allianceCaptains - 1; i++) {
      //
      // }
      resolve();
    });
  }
}

export default RoundRobinManager.getInstance();