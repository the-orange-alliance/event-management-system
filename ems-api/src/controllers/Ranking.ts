import {Router, Request, Response, NextFunction} from 'express';
import DatabaseManager from "../database-manager";
import * as Errors from "../errors";
import logger from "../logger";
import EnergyImpactRanker from "../shared/scoring/EnergyImpactRanker";

const router: Router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  DatabaseManager.selectAllOrderBy("ranking", "\"ranking\".rank").then((rows: any[]) => {
    res.send({payload: rows});
  }).catch((error: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  });
});

router.get("/teams", (req: Request, res: Response, next: NextFunction) => {
  DatabaseManager.selectAllFromJoinOrderBy("ranking", "team", "team_key", "\"ranking\".rank").then((rows: any) => {
    res.send({payload: rows});
  }).catch((error: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  })
});

router.get("/calculate/:tournament_level", (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.type) {
    next(Errors.MISSING_QUERY("type"));
  } else if (parseInt(req.params.tournament_level) <= 0) {
    // Practice matches should NEVER post rankings!
    res.send({payload: "Nope."});
  } else {
    DatabaseManager.getMatchResultsForRankings(req.query.type, req.params.tournament_level).then((rows: any[]) => {
      logger.info(`Re-calculating rankings for ${req.query.type}.`);
      const ranker: IMatchRanker = getRankerByType(req.query.type);
      const rankJSON: any = ranker.execute(rows).map(rank => rank.toJSON());
      if (rankJSON.length > 0){
        const promises: Array<Promise<any>> = [];
        for (const ranking of rankJSON) {
          promises.push(DatabaseManager.updateWhere("ranking", ranking, "rank_key=\"" + ranking.rank_key + "\""));
        }
        Promise.all(promises).then((values: any[]) => {
          res.send({payload: values});
        }).catch((error: any) => {
          next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
        });
      } else {
        res.send({payload: rankJSON});
      }
    }).catch((error: any) => {
      next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
    });
  }
});

router.post("/", (req: Request, res: Response, next: NextFunction) => {
  DatabaseManager.insertValues("ranking", req.body.records).then((rows: any[]) => {
    res.send({payload: rows});
  }).catch((error: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  });
});

router.delete("/", (req: Request, res: Response, next: NextFunction) => {
  DatabaseManager.deleteAll("ranking").then((rows: any[]) => {
    res.send({payload: rows});
  }).catch((error: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  });
});

function getRankerByType(eventType: string) {
  switch (eventType) {
    case "fgc_2018":
      return EnergyImpactRanker;
    default:
      return EnergyImpactRanker;
  }
}

export const RankingController: Router = router;