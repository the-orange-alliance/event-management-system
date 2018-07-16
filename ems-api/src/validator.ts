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

const postRoutes = new Map<string, string[]>();

postRoutes.set("event", postEvent);

export function validate(req: Request, res: Response, next: NextFunction)  {
  const method = req.method.toString().toUpperCase();
  let routeMap: Map<string, string[]> = new Map<string, string[]>();
  let routeURL = req.path.replace("/api/", "");
  switch (method) {
    case "GET":
      next();
      break;
    case "DELETE":
      next();
      break;
    case "POST":
      routeMap = postRoutes;
      break;
    default:
      next(Errors.METHOD_NOT_FOUND);
  }

  if (!routeMap.has(routeURL)) {
    next(Errors.ROUTE_NOT_DEFINED);
  }

  if (!req.body.records) {
    next(Errors.INVALID_BODY_JSON);
  }

  if (!(req.body.records instanceof Array)) {
    next(Errors.INVALID_BODY_JSON);
  }

  const requiredFields: string[] = routeMap.get(routeURL) as string[]; // Normally not safe, but we know it won't be undefined from our checks up above.
  for (const record of req.body.records) {
    for (let i = 0; i < requiredFields.length; i++) {
      if (typeof record[requiredFields[i]] === "undefined") {
        next(Errors.MISSING_BODY_INFORMATION(requiredFields[i]));
      }
    }
  }

  /* After all of our validation, continue on to the rest of the routing. */
  next();
}