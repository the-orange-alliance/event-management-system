import {Router, Request, Response, NextFunction} from 'express';
import DatabaseManager from "../database-manager";
import * as Errors from "../errors";
import logger from "../logger";

const router: Router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  DatabaseManager.selectAll("alliance").then((rows: any[]) => {
    res.send({payload: rows});
  }).catch((error: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  });
});

router.get("/:alliance_key", (req: Request, res: Response, next: NextFunction) => {
  DatabaseManager.selectAllWhere("alliance", "alliance_key=\"" + req.params.alliance_key + "\"").then((rows: any[]) => {
    res.send({payload: rows});
  }).catch((error: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  });
});

router.post("/", (req: Request, res: Response, next: NextFunction) => {
  DatabaseManager.insertValues("alliance", req.body.records).then((data: any) => {
    logger.info("Created " + req.body.records.length + " alliance members in the database.");
    res.send({payload: "Created " + req.body.records.length + " alliance members in the database."});
  }).catch((error: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  })
});

export const AllianceController: Router = router;