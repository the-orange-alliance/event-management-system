import {NextFunction, Request, Response} from "express";
import * as Errors from "./errors"
import * as jwt from 'jsonwebtoken'
import DatabaseManager from './database-manager'
import {jwtToken} from './server'
import {JwtPayload} from "jsonwebtoken";

// GET Routes that should require no authentication
const openRoutes = ['/api/alliance', '/api/event', '/api/team', '/api/match', '/api/ranking', '/api/ranking/team'];

export function authenticate(req: Request, res: Response, next: NextFunction) {
  // All GET /match/... /ranking/... /schedule/... /alliance/... queries should be open
  const openDymanicRoutes = req.baseUrl.startsWith('/api/match/') || req.baseUrl.startsWith('/api/ranking/') ||
                              req.baseUrl.startsWith('/api/schedule/') || req.baseUrl.startsWith('/api/alliance/');
  if (req.method === 'GET' && (openRoutes.indexOf(req.baseUrl) > -1 || openDymanicRoutes)) {
    next();
    return;
  }
  if(!req.get('authorization')) return next(Errors.CUSTOM_ERROR(401, 'No authorization header'));
  if(req.get('authorization')?.indexOf('Bearer') !== 0) next(Errors.CUSTOM_ERROR(401, 'Malformed authorization header'));
  const key = req.get('authorization')?.split(' ')[1];

  if(key && verify(key)) {
    // if it's valid, check that it exists in DB. this allows us to revoke tokens if needed
    DatabaseManager.selectAllWhere('auth_tokens', `token = '${key}'`).then((data: any[]) => {
      if(data.length > 0) {
        if(data[0].user_id !== undefined && data[0].user_id !== null && data[0].user_id !== 'undefined') { // is user
          DatabaseManager.selectAllWhere('users', `user_id = ${data[0].user_id}`).then(user => {
            if(!user || user && user.length > 0) {
              res.set('User', user[0].username);
              res.set('Can-Control-Match', user[0].can_control_match);
              res.set('Can-Control-FMS', user[0].can_control_fms);
              res.set('Can-Ref', user[0].can_ref);
              res.set('Can-Control-Event', user[0].can_control_event);
              next();
            } else {
              next(Errors.CUSTOM_ERROR(401, 'Invalid or expired token'));
            }
          }).catch((err) => {
            return next(Errors.ERROR_WHILE_EXECUTING_QUERY(err));
          });
        } else { // is API key
          const decoded = jwt.decode(data[0].token);
          DatabaseManager.selectAllWhere('api_keys', `key = '${(decoded as JwtPayload).api_key}'`).then(user => {
            if(!user || user && user.length > 0) {
              res.set('User', user[0].username);
              res.set('Can-Control-Match', user[0].can_control_match);
              res.set('Can-Control-FMS', user[0].can_control_fms);
              res.set('Can-Ref', user[0].can_ref);
              res.set('Can-Control-Event', user[0].can_control_event);
              next();
            } else {
              next(Errors.CUSTOM_ERROR(401, 'Invalid or expired token'));
            }
          }).catch((err) => {
            return next(Errors.ERROR_WHILE_EXECUTING_QUERY(err));
          });
        }
        return;
      }
      else {
        next(Errors.CUSTOM_ERROR(401, 'Invalid or expired token'));
        return;
      }
    }).catch((err) => {
      return next(Errors.ERROR_WHILE_EXECUTING_QUERY(err));
    })
  } else {
    next(Errors.CUSTOM_ERROR(401, 'Invalid or expired token'));
  }
}

function verify(key: string): boolean {
  try {
    const v = jwt.verify(key, jwtToken);
    return !!v; // !! converts v to truthy
  } catch{
    return false;
  }
}
