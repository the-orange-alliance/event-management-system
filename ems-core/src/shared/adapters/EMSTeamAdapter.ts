import TOATeam from "../models/toa/TOATeam";
import Team from "../models/Team";

export default class EMSTeamAdapter {
  private _toaTeam: TOATeam;

  constructor(toaTeam: TOATeam) {
    this._toaTeam = toaTeam;
  }

  public get(): Team {
    const team: Team = new Team();
    team.teamKey = this._toaTeam.teamNumber;
    team.teamNameShort = this._toaTeam.teamNameShort;
    team.teamNameLong = this._toaTeam.teamNameLong;
    team.country = this._toaTeam.country;
    team.city = this._toaTeam.city;
    team.stateProv = this._toaTeam.stateProv;
    team.robotName = this._toaTeam.robotName || "";
    team.countryCode = this._toaTeam.country;
    return team;
  }
}