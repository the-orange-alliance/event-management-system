import Season from "../models/Season";
import {DropdownItemProps} from "semantic-ui-react";
import {EMSEventTypes} from "../AppTypes";

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
export const SeasonItems: DropdownItemProps[] = Seasons.map(season => ({text: season.seasonDesc, value: season.seasonKey}));

export function getFromEMSEventType(eventType: EMSEventTypes): DropdownItemProps {
  switch (eventType) {
    case "fgc_2018":
      return SeasonItems[0];
    case "ftc_1718":
      return SeasonItems[1];
    case "ftc_1819":
      return SeasonItems[2];
    default:
      return SeasonItems[2];
  }
}

export function getFromSeasonKey(seasonKey: number | string | boolean): Season {
  for (const season of Seasons) {
    if (season.seasonKey === seasonKey) {
      return season;
    }
  }
  return null;
}