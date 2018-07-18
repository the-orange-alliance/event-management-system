import {Router, Request, Response, NextFunction} from 'express';
import DatabaseManager from "../database-manager";
import * as Errors from "../errors";
import logger from "../logger";

const router: Router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    DatabaseManager.selectAll("event").then((rows: any[]) => {
        res.send({payload: rows});
    }).catch((error) => {
        next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
    });
});

router.get("/create", (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.type) {
      next(Errors.MISSING_QUERY("type"));
  }
  DatabaseManager.createEventDatabase(req.query.type).then(() => {
      logger.info("Created base event database for " + req.query.type + ".");
      res.send({payload: "Created database for event " + req.query.type + "."});
  }).catch((error) => {
      next(Errors.ERROR_WHILE_CREATING_DB(error));
  });
});

router.post("/", (req: Request, res: Response) => {
    res.send({payload: "WHOOP WHOOP"});
});

router.delete("/delete", (req: Request, res: Response, next: NextFunction) => {
    DatabaseManager.delete().then(() =>{
        res.send({payload: "Deleted event database."});
    }).catch((error) => {
        next(Errors.ERROR_WHILE_DELETING_DB(error));
    });
});

export const EventController: Router = router;