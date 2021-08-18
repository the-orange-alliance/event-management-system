import {NextFunction, Request, Response, Router} from 'express';
import DatabaseManager from "../database-manager";
import * as Errors from "../errors";
import {Permissions} from "../errors";
import logger from "../logger";

const router: Router = Router();

router.get("/playoffs/:partial", (req: Request, res: Response, next: NextFunction) => {
  if (req.query.id) {
    DatabaseManager.selectAllWhere("schedule", `schedule_item_key LIKE "${req.params.partial}${req.query.id}%"`).then((rows: any[]) => {
      res.send({payload: rows});
    }).catch((error: any) => {
      next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
    });
  } else {
    next(Errors.MISSING_QUERY("id"));
  }
});

router.get("/:schedule_type", (req: Request, res: Response, next: NextFunction) => {
  const scheduleType = req.params.schedule_type;
  DatabaseManager.selectAllWhere("schedule", "schedule_item_type=\"" + scheduleType + "\"").then((rows: any[]) => {
    res.send({payload: rows});
  }).catch((error: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  });
});

router.delete("/:schedule_type", (req: Request, res: Response, next: NextFunction) => {
  if(res.get('Can-Control-Event') === '0') return next(Errors.INVALID_PERMISSIONS(Permissions.event));
  const scheduleType = req.params.schedule_type;
  DatabaseManager.deleteAllWhere("schedule", "schedule_item_type=\"" + scheduleType + "\"").then(() => {
    res.send({payload: "Successfully delete all schedule rows with schedule type " + scheduleType});
  }).catch((error: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  });
});

router.post("/", (req: Request, res: Response, next: NextFunction) => {
  if(res.get('Can-Control-Event') === '0') return next(Errors.INVALID_PERMISSIONS(Permissions.event));
  DatabaseManager.insertValues("schedule", req.body.records).then((data: any) => {
    logger.info("Created " + req.body.records.length + " schedule items in the database.");
    res.send({payload: "Created " + req.body.records.length + " schedule items in the database."});
  }).catch((error: any) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  })
});

export const ScheduleController: Router = router;
