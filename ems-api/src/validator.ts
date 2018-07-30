import {NextFunction, Request, Response} from "express";
import * as Errors from "./errors";

const postEvent = [
  "season_key",
  "region_key",
  "event_key",
  "event_name",
  "venue",
  "city",
  "country",
  "field_count"
];

const postTeam = [
  "team_key",
  "event_participant_key",
  "team_name_short",
  "city",
  "country",
  "country_code"
];

const postSchedule = [
  "schedule_item_key",
  "schedule_item_type",
  "schedule_item_name",
  "schedule_day",
  "start_time",
  "duration",
  "is_match"
];

const postMatch = [
  "match_key",
  "match_detail_key",
  "match_name",
  "tournament_level",
  "scheduled_time",
  "field_number"
];

const postMatchParticipants = [
  "match_participant_key",
  "match_key",
  "team_key",
  "station"
];

const putActiveMatch = ["match_key", "active"];
const putMatchScores = ["match_key", "red_score", "blue_score"];
const putMatchDetails = ["match_detail_key"];
const putMatchParticipants = ["match_participant_key", "card_status"];

const postRoutes = new Map<string, string[]>();
const putRoutes = new Map<string, string[]>();

postRoutes.set("event", postEvent);
postRoutes.set("team", postTeam);
postRoutes.set("schedule", postSchedule);
postRoutes.set("match", postMatch);
postRoutes.set("match/participants", postMatchParticipants);

putRoutes.set("match", putActiveMatch);
putRoutes.set("match/results", putMatchScores);
putRoutes.set("match/details", putMatchDetails);
putRoutes.set("match/participants", putMatchParticipants);

export function validate(req: Request, res: Response, next: NextFunction)  {
  const method = req.method.toString().toUpperCase();
  let routeMap: Map<string, string[]> = new Map<string, string[]>();
  let routeURL = req.baseUrl.replace("/api/", "");
  if (method === "GET" || method === "DELETE") {
    next();
    return;
  } else if (method === "POST") {
    routeMap = postRoutes;
  } else if (method === "PUT") {
    routeURL = routeURL.replace(routeURL.split("/")[1], "").replace("//", "/");
    if (routeURL[routeURL.length - 1] === "/") {
      routeURL = routeURL.replace("/", "");
    }
    routeMap = putRoutes;
  } else {
    next(Errors.METHOD_NOT_FOUND);
    return;
  }

  if (!routeMap.has(routeURL)) {
    next(Errors.ROUTE_NOT_DEFINED);
    return;
  }

  if (!req.body.records) {
    next(Errors.INVALID_BODY_JSON);
    return;
  }

  if (!(req.body.records instanceof Array)) {
    next(Errors.INVALID_BODY_JSON);
    return;
  }

  console.log(routeMap.get(routeURL));

  const requiredFields: string[] = routeMap.get(routeURL) as string[]; // Normally not safe, but we know it won't be undefined from our checks up above.
  for (const record of req.body.records) {
    for (let i = 0; i < requiredFields.length; i++) {
      if (typeof record[requiredFields[i]] === "undefined") {
        next(Errors.MISSING_BODY_INFORMATION(requiredFields[i]));
        return;
      }
    }
  }

  /* After all of our validation, continue on to the rest of the routing. */
  next();
}