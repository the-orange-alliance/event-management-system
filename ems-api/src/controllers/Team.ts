import {Router, Request, Response, NextFunction} from 'express';
import DatabaseManager from "../database-manager";
import * as Errors from "../errors";
import logger from "../logger";

const router: Router = Router();

function cleanWPAs(list: any[]): any[] {
  for(let i = 0; i < list.length; i++) {
    list[i].wpa_key = undefined;
  }
  return list;
}

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  DatabaseManager.selectAll("team").then((rows: any[]) => {
    res.send({payload: cleanWPAs(rows)});
  }).catch((error: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  });
});

router.get("/cards/reset", (req: Request, res: Response, next: NextFunction) => {
  DatabaseManager.updateAll("team", {card_status: 0}).then((data: any) => {
    logger.warn("RESET ALL TEAM CARD STATUSES.");
    res.send(data);
  }).catch((error: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  });
});

router.get("/wpakeys", async (req: Request, res: Response, next: NextFunction) => {
  // Get all teams, generate WPA keys for those without them and return team and WPA key
  try {
    const teams = await DatabaseManager.selectAll("team");
    const results = [];
    for (const team of teams) {
      // No WPA Key generated, let's make it and put in in DB
      if (!team.wpa_key || team.wpa_key.length < 8) {
        // Generate a random WPA key that is 8 characters long:
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        team.wpa_key = '';
        for (let i = 0; i < 8; i++) team.wpa_key += possible.charAt(Math.floor(Math.random() * possible.length));
        await DatabaseManager.updateWhere("team", team, `\`team_key\` = '${team.team_key}'`);
      }
      results.push({team_key: team.team_key, wpa_key: team.wpa_key})
    }

    res.send({payload: results});
  } catch (error) {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  }
});

router.post("/", (req: Request, res: Response, next: NextFunction) => {
  DatabaseManager.insertValues("team", req.body.records).then((data: any) => {
    logger.info("Created " + req.body.records.length + " teams in the database.");
    res.send({payload: "Created " + req.body.records.length + " teams in the database."});
  }).catch((error: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  })
});

router.put("/:team_key", (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.team_key || !parseInt(req.params.team_key)) {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY("Unable to parse team key as a number."));
  }
  DatabaseManager.updateWhere("team", req.body.records[0], `team_key=${req.params.team_key}`).then((data: any) => {
    res.send(data);
  }).catch((error: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  });
});

export const TeamController: Router = router;
