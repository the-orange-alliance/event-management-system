import EnergyImpactRank from "./EnergyImpactRank";

class EnergyImpactRanker implements IMatchRanker {
  private static _instance: EnergyImpactRanker;

  public static getInstance(): EnergyImpactRanker {
    if (typeof EnergyImpactRanker._instance == "undefined") {
      EnergyImpactRanker._instance = new EnergyImpactRanker();
    }
    return EnergyImpactRanker._instance;
  }

  private constructor() {}

  public execute(matchJSON: any[]): IPostableObject[] {
    const rankingData = Array.from(this.prepare(matchJSON).values());
    const sortedRanks: EnergyImpactRank[] = this.sort(rankingData, 0, rankingData.length - 1);
    for (let i = 0; i < sortedRanks.length; i++) {
      sortedRanks[i].rank = (i + 1);
    }
    return sortedRanks;
  }

  public prepare(matchJSON: any[]): Map<number, EnergyImpactRank> {
    const rankingsMap: Map<number, EnergyImpactRank> = new Map<number, EnergyImpactRank>();
    for (const match of matchJSON) {
      const redWin = match.red_score > match.blue_score;
      const tie = match.red_score === match.blue_score;
      const coop_bonus = match.red_coopertition_bonus === 1 && match.blue_coopertition_bonus === 1;
      const participants = match.participants.split(",");
      for (let i = 0; i < participants.length; i++) {
        if (typeof rankingsMap.get(parseInt(participants[i])) === "undefined") {
          const ranking: EnergyImpactRank = new EnergyImpactRank();
          const eventKey = match.match_key.substring(0, match.match_key.length - 4);
          ranking.teamKey = parseInt(participants[i]);
          ranking.rankKey = eventKey + "R" + ranking.teamKey;
          rankingsMap.set(parseInt(participants[i]), ranking);
        }
        const isSurrogate: boolean = JSON.parse("[" + match.surrogates + "]")[i] === 1;
        const cardStatus: number = JSON.parse("[" + match.cards + "]")[i];
        const isDisqualified: boolean = JSON.parse("[" + match.disqualifieds + "]")[i] === 1;
        const ranking = rankingsMap.get(parseInt(participants[i])) as EnergyImpactRank;
        if (!isSurrogate && cardStatus <= 1 && !isDisqualified && match.red_score !== null && match.blue_score !== null) {
          const redTeam = i < (participants.length / 2);

          const rp = redTeam && redWin ? 2 : tie ? 1 : !redTeam && !redWin ? 2 : 0;
          const points = redTeam ? match.red_score : match.blue_score;
          const coop_points = coop_bonus ? 100 : 0;
          const parks = redTeam ? match.red_robots_parked : match.blue_robots_parked;
          const park_points = parks === 3 ? 50 : parks * 15;
          ranking.rankingPoints += rp;
          ranking.totalPoints += points;
          ranking.coopertitionPoints += coop_points;
          ranking.parkingPoints += park_points;
        }
        if (match.red_score !== null && match.blue_score !== null) {
          ranking.played++;
        }
      }
    }
    return rankingsMap;
  }

  public sort(items: EnergyImpactRank[], left: number, right: number): EnergyImpactRank[] {
    let pivot, partitionIndex;

    if (left < right) {
      pivot = right;
      partitionIndex = this.partition(items, pivot, left, right);

      this.sort(items, left, partitionIndex - 1);
      this.sort(items, partitionIndex + 1, right);
    }

    return items;
  }

  private partition(items: EnergyImpactRank[], pivot: number, left: number, right: number): number {
    const pivotValue = items[pivot];
    let partitionIndex = left;

    for (let i = left; i < right; i++) {
      // -1 means items[i] < pivotValue, 1 means items[i] > pivotValue
      if (this.shouldSwap(items[i], pivotValue) === 1) {
        this.swap(items, i, partitionIndex);
        partitionIndex++;
      }
    }
    this.swap(items, right, partitionIndex);
    return partitionIndex;
  }

  private shouldSwap(rank1: EnergyImpactRank, rank2: EnergyImpactRank): number {
    if (rank2.rankingPoints === null) {
      return 1;
    }

    if (rank2.totalPoints === null) {
      return 1;
    }

    if (rank2.coopertitionPoints === null) {
      return 1;
    }

    if (rank1.rankingPoints < rank2.rankingPoints) {
      return -1;
    } else {
      if (rank1.rankingPoints > rank2.rankingPoints) {
        return 1;
      } else {
        if (rank1.totalPoints < rank2.totalPoints) {
          return -1;
        } else {
          if (rank1.totalPoints > rank2.totalPoints) {
            return 1;
          } else {
            if (rank1.coopertitionPoints < rank2.coopertitionPoints) {
              return -1;
            } else {
              if (rank1.coopertitionPoints > rank2.coopertitionPoints) {
                return 1;
              } else {
                if (rank1.parkingPoints < rank2.parkingPoints) {
                  return -1;
                } else {
                  if (rank1.parkingPoints > rank2.parkingPoints) {
                    return 1;
                  } else {
                    if (rank1.played < rank2.played) {
                      return -1;
                    } else {
                      return 1;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  private swap(items: EnergyImpactRank[], index1: number, index2: number) {
    const temp = items[index1];
    items[index1] = items[index2];
    items[index2] = temp;
  }

}

export default EnergyImpactRanker.getInstance();