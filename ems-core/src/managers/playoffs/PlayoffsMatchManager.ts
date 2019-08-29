import {AllianceMember} from "@the-orange-alliance/lib-ems";

class PlayoffsMatchManager {
  public static getAllianceMap(allianceMembers: AllianceMember[]): Map<number, AllianceMember[]> {
    const alliances: Map<number, AllianceMember[]> = new Map<number, AllianceMember[]>();
    for (const member of allianceMembers) {
      if (typeof alliances.get(member.allianceRank) === "undefined") { // TODO - Get rank by key, as that's more reliable.
        alliances.set(member.allianceRank, []);
      }
      alliances.get(member.allianceRank).push(member);
    }
    return alliances;
  }
}

export default PlayoffsMatchManager;