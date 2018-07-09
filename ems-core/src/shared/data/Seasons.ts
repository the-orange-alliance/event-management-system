import Season from "../models/Season";

const seasonsList = [
  {
    "season_key": 2018,
    "season_desc": "FGC Energy Impact"
  },
  {
    "season_key": 1718,
    "season_desc": "FTC Relic Recovery"
  },
  {
    "season_key": 1819,
    "season_desc": "FTC Rover Ruckus"
  }
];

export const Seasons: Season[] = seasonsList.map(season => new Season(season.season_key, season.season_desc));