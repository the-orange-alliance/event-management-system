import {Router, Request, Response, NextFunction} from 'express';
import DatabaseManager from "../database-manager";
import * as Errors from "../errors";
import logger from "../logger";
import {Match, MatchDetails} from "@the-orange-alliance/lib-ems";
import {Permissions} from "../errors";

const router: Router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  if (req.query.active) {
    DatabaseManager.selectAllWhere("match", "active=\"" + req.query.active + "\"").then((rows: any[]) => {
      res.send({payload: rows});
    }).catch((error: any) => {
      next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
    });
  } else if (req.query.match_key_partial) {
    const promises: Array<Promise<any>> = [];
    const tournamentClause: string = req.query.tournament_level ? ` AND tournament_level=${req.query.tournament_level}` : ``;
    promises.push(DatabaseManager.selectAllWhere("match", `match_key LIKE "${req.query.match_key_partial}%"${tournamentClause}`));
    promises.push(DatabaseManager.selectAllWhere("match_participant", `match_key LIKE "${req.query.match_key_partial}%"`));
    Promise.all(promises).then((values: any) => {
      const participantMap: Map<string, object[]> = new Map<string, object[]>();
      const matches: object[] = [];
      for (const participant of values[1]) {
        if (typeof participantMap.get(participant.match_key) === "undefined") {
          participantMap.set(participant.match_key, []);
        }
        (participantMap.get(participant.match_key) as object[]).push(participant);
      }
      for (const match of values[0]) {
        match.participants = (participantMap.get(match.match_key) as object[]);
        matches.push(match);
      }
      res.send({payload: matches});
    });
  } else if (req.query.tournament_level) {
    DatabaseManager.selectAllWhere("match", "tournament_level=\"" + req.query.tournament_level + "\"").then((rows: any[]) => {
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

router.get("/:match_key/teamranks", (req: Request, res: Response, next: NextFunction) => {
  DatabaseManager.selectAllFromThreeJoinWhere("match_participant", "team", "ranking", "team_key", "\"match_participant\".match_key=\"" + req.params.match_key + "\"").then((rows: any[]) => {
    res.send({payload: rows});
  }).catch((error: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  });
});

router.post("/", (req: Request, res: Response, next: NextFunction) => {
  if(res.get('Can-Control-Match') === '0') return next(Errors.INVALID_PERMISSIONS(Permissions.match));
  DatabaseManager.insertValues("match", req.body.records).then((data: any) => {
    logger.info("Created " + req.body.records.length + " matches in the database.");
    setTimeout(() => {
      const seasonKey: string = req.body.records[0].match_key.split("-")[0];
      const matchDetails: MatchDetails[] = [];
      for (const matchJSON of req.body.records) {
        const matchDetail: MatchDetails = Match.getDetailsFromSeasonKey(seasonKey);
        matchDetail.matchKey = matchJSON.match_key;
        matchDetail.matchDetailKey = matchJSON.match_detail_key;
        matchDetails.push(matchDetail);
      }
      DatabaseManager.insertValues("match_detail", matchDetails.map((details: MatchDetails) => details.toJSON())).then((data: any) => {
        logger.info("Created " + matchDetails.length + " match details in the database.");
        res.send({payload: "Created " + req.body.records.length + " matches and " + matchDetails.length + " match details in the database."});
      }).catch((error: any) => {
        next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
      });
    }, 500); // Small delay to make sure the previous query finishes before we do another one.
  }).catch((error: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  })
});

router.post("/participants", (req: Request, res: Response, next: NextFunction) => {
  if(res.get('Can-Control-Match') === '0') return next(Errors.INVALID_PERMISSIONS(Permissions.match));
  DatabaseManager.insertValues("match_participant", req.body.records).then((data: any) => {
    logger.info("Created " + req.body.records.length + " match participants in the database.");
    res.send({payload: "Created " + req.body.records.length + " match participants in the database."});
  }).catch((error: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  })
});

router.put("/:match_key", (req: Request, res: Response, next: NextFunction) => {
  if(res.get('Can-Control-Match') === '0') return next(Errors.INVALID_PERMISSIONS(Permissions.match));
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
  if(res.get('Can-Control-Match') === '0') return next(Errors.INVALID_PERMISSIONS(Permissions.match));
  DatabaseManager.updateWhere("match", req.body.records[0], "match_key=\"" + req.params.match_key + "\"").then((row: any) => {
    res.send({payload: row});
  }).catch((error: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  });
});

router.put("/:match_key/details", (req: Request, res: Response, next: NextFunction) => {
  if(res.get('Can-Control-Match') === '0') return next(Errors.INVALID_PERMISSIONS(Permissions.match));
  DatabaseManager.updateWhere("match_detail", req.body.records[0], "match_key=\"" + req.params.match_key + "\"").then((row: any) => {
    res.send({payload: row});
  }).catch((error: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  });
});

router.put("/:match_key/participants", (req: Request, res: Response, next: NextFunction) => {
  if(res.get('Can-Control-Match') === '0') return next(Errors.INVALID_PERMISSIONS(Permissions.match));
  const promises: Promise<any>[] = [];
  for (const record of req.body.records) {
    if (typeof record.team !== "undefined") delete record.team;
    if (typeof record.team_rank !== "undefined") delete record.team_rank;

    promises.push(DatabaseManager.updateWhere("match_participant", record, "match_participant_key=\"" + record.match_participant_key + "\""));
    if (typeof record.card_status !== "undefined" && !isNaN(record.card_status)) {
      promises.push(DatabaseManager.updateWhere("team", {card_status: record.card_status}, `team_key=${record.team_key}`));
    }
  }
  Promise.all(promises).then((values: any[]) => {
    res.send({payload: values});
  }).catch((reason: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(reason));
  });
});

export const MatchController: Router = router;
