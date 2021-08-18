import { Router, Request, Response, NextFunction } from 'express';
import DatabaseManager from '../database-manager';
import * as Errors from '../errors';
import logger from '../logger';
import {SocketProvider} from "@the-orange-alliance/lib-ems";
import {Permissions} from "../errors";

const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  DatabaseManager.selectAll('event').then((rows: any[]) => {
    for(let i = 0; i < rows.length; i++) rows[i].advanced_network_config = undefined;
    res.send({ payload: rows });
  })
  .catch((error) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  });
});

router.get('/:event_key/networking', (req: Request, res: Response, next: NextFunction) => {
  if(res.get('Can-Control-FMS') === '0') return next(Errors.INVALID_PERMISSIONS(Permissions.fms));
  if(res.get('Can-Control-Event') === '0') return next(Errors.INVALID_PERMISSIONS(Permissions.event));
  DatabaseManager.selectAllWhere('event', `\`event_key\` = "${req.params.event_key}"`).then((rows: any[]) => {
    if(rows && rows.length > 0 && rows[0].advanced_network_config) {
      res.json({payload: JSON.parse(rows[0].advanced_network_config)});
    } else {
      res.json({payload: {error: 'No Config in DB!'}});
    }
  })
  .catch((error) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  });
});

router.post('/:event_key/networking', (req: Request, res: Response, next: NextFunction) => {
  if(res.get('Can-Control-FMS') === '0') return next(Errors.INVALID_PERMISSIONS(Permissions.fms));
  if(res.get('Can-Control-Event') === '0') return next(Errors.INVALID_PERMISSIONS(Permissions.event));
  if(!req.body || req.body.records.length < 1) return next(Errors.INVALID_BODY_JSON);
  let toUpdate = JSON.stringify(req.body.records[0]).replace(/"/g, '""');
  DatabaseManager.updateWhere('event', { advanced_network_config: toUpdate } ,`\`event_key\` = "${req.params.event_key}"`).then((result: any) => {
    SocketProvider.emit("fms-settings-update", req.body.records[0]);
    res.send(result);
  })
  .catch((error) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
  });
});

router.get('/create', (req: Request, res: Response, next: NextFunction) => {
  if(res.get('Can-Control-Event') === '0') return next(Errors.INVALID_PERMISSIONS(Permissions.event));
  if (!req.query.type) {
    next(Errors.MISSING_QUERY('type'));
  }
  DatabaseManager.createEventDatabase(req.query.type as string)
    .then(() => {
      logger.info('Created base event database for ' + req.query.type + '.');
      res.send({ payload: 'Created database for event ' + req.query.type + '.' });
    })
    .catch((error) => {
      next(Errors.ERROR_WHILE_CREATING_DB(error));
    });
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  if(res.get('Can-Control-Event') === '0') return next(Errors.INVALID_PERMISSIONS(Permissions.event));
  DatabaseManager.insertValues('event', [req.body.records[0]])
    .then((data: any) => {
      res.send({ payload: data });
    })
    .catch((error) => {
      next(Errors.ERROR_WHILE_EXECUTING_QUERY(error));
    });
});

router.delete('/delete', (req: Request, res: Response, next: NextFunction) => {
  if(res.get('Can-Control-Event') === '0') return next(Errors.INVALID_PERMISSIONS(Permissions.event));
  DatabaseManager.delete()
    .then(() => {
      res.send({ payload: 'Deleted event database.' });
    })
    .catch((error) => {
      next(Errors.ERROR_WHILE_DELETING_DB(error));
    });
});

export const EventController: Router = router;
