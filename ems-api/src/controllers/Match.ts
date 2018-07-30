import {Router, Request, Response, NextFunction} from 'express';
import DatabaseManager from "../database-manager";
import * as Errors from "../errors";
import logger from "../logger";

const router: Router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  if (req.query.active) {
    DatabaseManager.selectAllWhere("match", "active=\"" + req.query.active + "\"").then((rows: any[]) => {
      res.send({payload: rows});
    }).catch((error: any) => {
      next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
    });
  } else if (req.query.level) {
    DatabaseManager.getMatchAndParticipants(req.query.level).then((rows: any[]) => {
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

router.get("/:match_key", (req: Request, res: Response, next: NextFunction) => {
  DatabaseManager.selectAllWhere("match", "match_key=\"" + req.params.match_key + "\"").then((rows: any[]) => {
    res.send({payload: rows});
  }).catch((error: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  });
});

router.get("/:match_key/details", (req: Request, res: Response, next: NextFunction) => {
  DatabaseManager.selectAllWhere("match_detail", "match_key=\"" + req.params.match_key + "\"").then((rows: any[]) => {
    res.send({payload: rows});
  }).catch((error: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  });
});

router.get("/:match_key/participants", (req: Request, res: Response, next: NextFunction) => {
  DatabaseManager.selectAllWhere("match_participant", "match_key=\"" + req.params.match_key + "\"").then((rows: any[]) => {
    res.send({payload: rows});
  }).catch((error: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  });
});

router.get("/:match_key/teams", (req: Request, res: Response, next: NextFunction) => {
  DatabaseManager.selectAllFromJoinWhere("match_participant", "team", "team_key", "\"match_participant\".match_key=\"" + req.params.match_key + "\"").then((rows: any[]) => {
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
  DatabaseManager.updateWhere("match", {active: 0}, "active=" + req.body.records[0].active).then(() => {
    setTimeout(() => {
      DatabaseManager.updateWhere("match", req.body.records[0], "match_key=\"" + req.params.match_key + "\"").then((row: any) => {
        res.send({payload: row});
      }).catch((error: any) => {
        next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
      });
    }, 250);
  }).catch((error: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  });
});

router.put("/:match_key/results", (req: Request, res: Response, next: NextFunction) => {
  DatabaseManager.updateWhere("match", req.body.records[0], "match_key=\"" + req.params.match_key + "\"").then((row: any) => {
    res.send({payload: row});
  }).catch((error: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  });
});

router.put("/:match_key/details", (req: Request, res: Response, next: NextFunction) => {
  DatabaseManager.updateWhere("match_detail", req.body.records[0], "match_key=\"" + req.params.match_key + "\"").then((row: any) => {
    res.send({payload: row});
  }).catch((error: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  });
});

router.put("/:match_key/participants", (req: Request, res: Response, next: NextFunction) => {
  const promises: Promise<any>[] = [];
  for (const record of req.body.records) {
    promises.push(DatabaseManager.updateWhere("match_participant", record, "match_participant_key=\"" + record.match_participant_key + "\""));
  }
  Promise.all(promises).then((values: any[]) => {
    res.send({payload: values});
  }).catch((reason: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(reason));
  });
});

export const MatchController: Router = router;