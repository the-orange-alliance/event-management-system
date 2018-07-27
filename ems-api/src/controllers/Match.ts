import {Router, Request, Response, NextFunction} from 'express';
import DatabaseManager from "../database-manager";
import * as Errors from "../errors";
import logger from "../logger";

const router: Router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.active) {
    DatabaseManager.selectAllWhere("match", "active=\"" + req.query.active + "\"").then((rows: any[]) => {
      res.send({payload: rows});
    }).catch((error: any) => {
      next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
    });
  } else {
    DatabaseManager.selectAllWhere("match", "active>\"0\"").then((rows: any[]) => {
      res.send({payload: rows});
    }).catch((error: any) => {
      next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
    });
  }
});

router.get("/:tournament_level", (req: Request, res: Response, next: NextFunction) => {
  const tournament_level = req.params.tournament_level;
  DatabaseManager.getMatchAndParticipants(tournament_level).then((rows: any[]) => {
    res.send({payload: rows});
  }).catch((error: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  });
});

router.post("/", (req: Request, res: Response, next: NextFunction) => {
  DatabaseManager.insertValues("match", req.body.records).then((data: any) => {
    logger.info("Created " + req.body.records.length + " matches in the database.");
    setTimeout(() => {
      const minimalDetailJSON = req.body.records.map((match: any) => {return {match_key: match.match_key, match_detail_key: match.match_detail_key}});
      DatabaseManager.insertValues("match_detail", minimalDetailJSON).then((data: any) => {
        logger.info("Created " + minimalDetailJSON.length + " match details in the database.");
        res.send({payload: "Created " + req.body.records.length + " matches and " + minimalDetailJSON.length + " match details in the database."});
      }).catch((error: any) => {
        next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
      });
    }, 500); // Small delay to make sure the previous query finishes before we do another one.
  }).catch((error: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  })
});

router.post("/participants", (req: Request, res: Response, next: NextFunction) => {
  DatabaseManager.insertValues("match_participant", req.body.records).then((data: any) => {
    logger.info("Created " + req.body.records.length + " match participants in the database.");
    res.send({payload: "Created " + req.body.records.length + " match participants in the database."});
  }).catch((error: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  })
});

router.put("/:match_key", (req: Request, res: Response, next: NextFunction) => {
  DatabaseManager.updateWhere("match", req.body.records, "match_key=\"" + req.params.match_key + "\"").then((row: any) => {
    res.send({payload: row});
  }).catch((error: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  });
});

export const MatchController: Router = router;