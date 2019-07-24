import {
  EliminationMatchesFormat, EventConfiguration, RankingMatchesFormat,
  RoundRobinFormat, TournamentRound
} from "@the-orange-alliance/lib-ems";

export default class TournamentValidator {
  private _eventConfig: EventConfiguration;
  private _isValid: boolean;

  constructor(eventConfig: EventConfiguration) {
    this._eventConfig = eventConfig;
    this._isValid = false;
  }

  public update(eventConfig: EventConfiguration) {
    this._eventConfig = eventConfig;
    this.updateValidity();
  }

  public isValidConfig(): boolean {
    const config = this._eventConfig.tournamentConfig;
    return typeof config !== "undefined" && config.length > 0;
  }

  public isValidRounds(): boolean {
    try {
      const tournament = this._eventConfig.tournament;
      let valid = true;

      if (Array.isArray(tournament)) {
        for (const round of tournament) {
          if (!this.isValidRound(round)) {
            valid = false;
          }
        }
      } else {
        if (!this.isValidRound(tournament)) {
          valid = false;
        }
      }

      return valid;
    } catch {
      return false;
    }
  }

  public updateValidity(): void {
    this._isValid = this.isValidConfig() && this.isValidRounds();
  }

  private isValidRound(round: TournamentRound): boolean {
    try {
      let valid = true;

      const type = round.type;
      if (typeof type === "undefined" || type.length < 2) {
        valid = false;
      }
      if (round.id < 0) {
        valid = false;
      }

      if (typeof round.format === "undefined") {
        valid = false;
      }

      switch (round.format.type) {
        case "rr":
          const rrAlliances = (round.format as RoundRobinFormat).alliances;
          if (rrAlliances <= 2) {
            valid = false;
          }
          break;
        case "ranking":
          const rCutoff = (round.format as RankingMatchesFormat).rankingCutoff;
          if (rCutoff <= 2) {
            valid = false;
          }
          break;
        case "elims":
          const elimsAlliances = (round.format as EliminationMatchesFormat).alliances;
          const elimsSeries = (round.format as EliminationMatchesFormat).seriesType;
          if (elimsAlliances < 2) {
            valid = false;
          }
          if (typeof elimsSeries === "undefined" || elimsSeries.length <= 2) {
            valid = false;
          }
          break;
        default:
          return false;
      }

      return valid;
    } catch {
      return false;
    }
  }

  get isValid(): boolean {
    return this._isValid;
  }
}