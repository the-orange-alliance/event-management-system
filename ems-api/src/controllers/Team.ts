import {Router, Request, Response, NextFunction} from 'express';
import DatabaseManager from "../database-manager";
import * as Errors from "../errors";
import logger from "../logger";

const router: Router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  DatabaseManager.selectAll("team").then((rows: any[]) => {
    res.send({payload: rows});
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

router.post("/", (req: Request, res: Response, next: NextFunction) => {
  DatabaseManager.insertValues("team", req.body.records).then((data: any) => {
    logger.info("Created " + req.body.records.length + " teams in the database.");
    res.send({payload: "Created " + req.body.records.length + " teams in the database."});
  }).catch((error: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  })
});

router.put("/:team_key", (req: Request, res: Response, next: NextFunction) => {
  if (isNaN(req.params.team_key) || !parseInt(req.params.team_key)) {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY("Unable to parse team key as a number."));
  }
  DatabaseManager.updateWhere("team", req.body.records[0], `team_key=${req.params.team_key}`).then((data: any) => {
    res.send(data);
  }).catch((error: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  });
});

export const TeamController: Router = router;