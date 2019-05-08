import {Team} from "@the-orange-alliance/lib-ems";

class TeamValidator {
  private _team: Team;
  private _isValid: boolean;

  constructor(team: Team) {
    this._team = team;
    this._isValid = false;
  }

  public update(team: Team): void {
    this._team = team;
    this.checkIfValid();
  }

  public isValidTeamKey(): boolean {
    if (typeof this._team.teamKey === "undefined") {
      return false;
    }
    return this.isSafe(this._team.teamKey.toString()) && this._team.teamKey > 0;
  }

  public isValidTeamNameShort(): boolean {
    if (typeof this._team.teamNameShort === "undefined") {
      return false;
    }
    return this.isSafe(this._team.teamNameShort) && this._team.teamNameShort.length > 0;
  }

  public isValidTeamNameLong(): boolean {
    return this.isSafe(this._team.teamNameLong);
  }

  public isValidCountryCode(): boolean {
    if (typeof this._team.countryCode === "undefined") {
      return false;
    }
    return this.isSafe(this._team.countryCode) && this._team.countryCode.length === 2;
  }

  public isValidCity(): boolean {
    if (typeof this._team.city === "undefined") {
      return false;
    }
    return this.isSafe(this._team.city) && this._team.city.length > 0;
  }

  public isValidStateProv(): boolean {
    return this.isSafe(this._team.stateProv);
  }

  public isValidCountry(): boolean {
    if (typeof this._team.country === "undefined") {
      return false;
    }
    return this.isSafe(this._team.country) && this._team.country.length > 0;
  }

  public isValidRobotName(): boolean {
    return this.isSafe(this._team.robotName);
  }

  public checkIfValid(): void {
    this._isValid = this.isValidTeamKey() && this.isValidTeamNameShort() && this.isValidTeamNameLong()
    && this.isValidCountryCode() && this.isValidCity() && this.isValidStateProv() && this.isValidCountry()
    && this.isValidRobotName();
  }

  private isSafe(str: string): boolean {
    if (typeof str === "undefined") {
      return true;
    }
    return str.match(/[\t\r\n]|(--[^\r\n]*)|(\/\*[\w\W]*?(?=\*)\*\/)/gi) === null;
  }

  get isValid(): boolean {
    return this._isValid;
  }

}

export default TeamValidator;