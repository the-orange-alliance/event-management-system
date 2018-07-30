const rates = { /*in kJ/s */
  solar: 1,
  wind: 1,
  reactor: 3,
};

const chunks = { /*in kJ */
  lowFuel: 5,
  highFuel: 20,
  coop: 100,
  parked: 15,
  parked_bonus: 5,
  yellow_card: 30
};

export default class EIScoreTable {
  public static getSolarPts(time: number): number {
    return time*rates.solar;
  }
  public static getWindPts(time: number): number {
    return time*rates.wind;
  }
  public static getReactorPts(time: number): number {
    return time*rates.reactor;
  }
  public static getHighPoints(cubes: number): number {
    return cubes*chunks.highFuel;
  }
  public static getLowPoints(cubes: number): number {
    return cubes*chunks.lowFuel;
  }
  public static getCoopPoints(linesActive: number): number {
    if(linesActive) {
      return chunks.coop;
    }
    return 0;
  }
  public static getParkedPoints(numParked: number): number {
    if(numParked === 3) {
      return 50;
    }
    return numParked*chunks.parked;
  }
  public static getYellowCardPoints(cards: number): number {
    return cards*chunks.yellow_card;
  }
}