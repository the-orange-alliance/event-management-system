import {Router, Request, Response, NextFunction} from 'express';
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import DatabaseManager from "../database-manager";
import * as Errors from "../errors";
import {compareSync, hashSync} from "bcrypt";
import {jwtExpires, jwtToken} from '../server'
import * as path from "path";
import {getAppDataPath} from "appdata-path";
import * as fs from "fs";
import {EMSProvider, SocketProvider} from "@the-orange-alliance/lib-ems";
import logger from "../logger";

const router: Router = Router();

async function generateKey(req: Request, res: Response, next: NextFunction, userId?: number, desc?: string, ownerUserId?: number, apiKey?: number) {
  const payload = {
    username: req.body.username,
    user_id: userId,
    owner_user_id: ownerUserId,
    api_key: apiKey,
    auth_type: req.body.auth_type,
    description: desc,
    nonce: crypto.randomBytes(32)
  };
  const jwtOpts: jwt.SignOptions = {
    expiresIn: jwtExpires,
    issuer: 'ems-api',
  };
  const token = jwt.sign(payload, jwtToken, jwtOpts);
  const dbUpdate = {token: token, expires: new Date(Date.now() + (jwtExpires * 1000)), user_id: userId};
  await DatabaseManager.insertValues('auth_tokens', [dbUpdate]).catch((err) => next(Errors.ERROR_WHILE_EXECUTING_QUERY(err)));
  return token
}

router.post("/token", async (req, res, next) => {
  const validTypes = ["password", "refresh", "apikey", "revoke"];
  // Check for body
  if (!req.body) return next(Errors.EMPTY_BODY);
  // Check auth_code
  if (!req.body.auth_type || (req.body.auth_type && validTypes.indexOf(req.body.auth_type) < 0)) {
    return next(Errors.CUSTOM_ERROR(400, 'Missing or invalid `auth_type` provided. Please include or use one of ' + validTypes.join(', ')));
  }
  // dynamically configure required body fields
  const requiredFields: string[] = [];
  switch(req.body.auth_type) {
    case 'password': requiredFields.push('username', 'password'); break;
    case 'refresh': requiredFields.push('old_token'); break;
    case 'apikey': requiredFields.push('api_key'); break;
    case 'revoke': requiredFields.push('old_token'); break;
  }
  for(const field of requiredFields) {
    if(!req.body[field]) return next(Errors.MISSING_BODY_INFORMATION(field));
  }

  return await new Promise(async (resolve) => {
    switch(req.body.auth_type) {
      case 'password': {
        await DatabaseManager.selectAllWhere('users', `username = '${req.body.username}'`).then(async (data: any[]) => {
          if(data.length > 0) {
            if(compareSync(req.body.password, data[0].password)) {
              const token = await generateKey(req, res, next, data[0].user_id);
              resolve(res.json({token: token, expires: jwtExpires, type: 'Bearer'}));
            } else {
              resolve(next(Errors.INVALID_CREDENTIALS));
            }
          } else {
            resolve(next(Errors.INVALID_CREDENTIALS));
          }
        }).catch((err) => next(Errors.ERROR_WHILE_EXECUTING_QUERY(err)));
        break;
      }
      case 'refresh': {
        await DatabaseManager.selectAllWhere('auth_tokens', `token = '${req.body.old_token}'`).then(async (data: any[]) => {
          if(data.length > 0) {
            await DatabaseManager.deleteAllWhere('auth_tokens', `token = '${req.body.old_token}'`).then(async () => {
              const token = await generateKey(req, res, next, data[0].user_id);
              resolve(res.json({token: token, expires: jwtExpires, type: 'Bearer'}));
            }).catch((err) => next(Errors.ERROR_WHILE_EXECUTING_QUERY(err)));
          } else {
            resolve(next(Errors.INVALID_CREDENTIALS));
          }
        }).catch((err) => next(Errors.ERROR_WHILE_EXECUTING_QUERY(err)));
        break;
      }
      case 'revoke': {
        await DatabaseManager.deleteAllWhere('auth_tokens', `token = '${req.body.old_token}'`).then(async () => {
          SocketProvider.emit('token-revoked', req.body.old_token);
          resolve(res.json({success: true}));
        }).catch((err) => next(Errors.ERROR_WHILE_EXECUTING_QUERY(err)));
        break;
      }
      case 'apikey': {
        await DatabaseManager.selectAllWhere('api_keys', `key = '${req.body.api_key}'`).then(async (data: any[]) => {
          if(data.length > 0) {
            const token = await generateKey(req, res, next, undefined, data[0].description, data[0].owner_user_id, data[0].key);
            resolve(res.json({token: token, expires: jwtExpires, type: 'Bearer'}));
          } else {
            resolve(next(Errors.INVALID_CREDENTIALS));
          }
        }).catch((err) => next(Errors.ERROR_WHILE_EXECUTING_QUERY(err)));
        break;
      }
    }
  })
});

export function checkAndCreateDefaultAccount() {
  DatabaseManager.selectAll('users').then((data: any[]) => {
    if(data.length < 1) {
      const newAcct = {username: 'ems-admin', password: hashSync('admin', 10), user_id: 0, can_control_event: 1, can_control_fms: 1, can_ref: 1, can_control_match: 1};
      return DatabaseManager.insertValues('users', [newAcct]);
    }
    return;
  }).then(() => {
    return DatabaseManager.selectAllWhere('api_keys', `description = 'ems-frc-fms-autogenerated'`);
  }).then((apiKeys: any[]) => {
    if(apiKeys.length < 1) {
      const newKey = {
        key: crypto.randomBytes(64).toString('hex'),
        owner_user_id: 0,
        description: 'ems-frc-fms-autogenerated',
        can_control_match: true,
        can_control_fms: true,
        can_ref: false,
        can_control_event: true,
      };
      const credDir = path.join(getAppDataPath(""), "ems-core", "frc-fms-key.json");
      const promise = DatabaseManager.insertValues('api_keys', [newKey]);
      fs.writeFileSync(credDir, JSON.stringify(newKey));
      return promise;
    }
  }).then(() => {
    return DatabaseManager.selectAllWhere('api_keys', `description = 'ems-socket-autogenerated'`);
  }).then((apiKeys: any[]) => {
    EMSProvider.initialize(process.env.HOST || '127.0.0.1', process.env.PORT ? parseInt(process.env.PORT) : undefined);
    SocketProvider.initialize(process.env.HOST || '127.0.0.1', EMSProvider);
    if(apiKeys.length < 1) {
      const newKey = {
        key: crypto.randomBytes(64).toString('hex'),
        owner_user_id: 0,
        description: 'ems-socket-autogenerated',
        can_control_match: true,
        can_control_fms: true,
        can_ref: true,
        can_control_event: true,
      };
      const credDir = path.join(getAppDataPath(""), "ems-core", "socket-key.json");
      fs.writeFileSync(credDir, JSON.stringify(newKey));
      return Promise.all([DatabaseManager.insertValues('api_keys', [newKey]), selfAuth(newKey.key)]).then(() => {});
    } else {
      return selfAuth(apiKeys[0].key);
  }
  }).then(() => {
    // delete all old authorization tokens on startup
    return DatabaseManager.deleteAll('auth_tokens');
  }).catch((err) => {
    logger.error('Error creating default accounts or authenticating API: ' + err + '. Because this failed, things will not work properly. Please fix the error and restart.');
    process.exit(1);
  });
}

async function selfAuth(key: string, count: number = 0) {
  EMSProvider.authApiKey(key).then(() => {
    logger.info('Self-Auth Success');
    setInterval(() => EMSProvider.authApiKey(key).then(() => logger.info('Self-Auth Reauthorized')).catch(() => {}), 60 * 60 * 1000); // reauth every hour
  }).catch(async () => {
    if(count < 10) {
      logger.error('Self-Auth failed, retrying in 1 second...');
      await new Promise<void>((resolve) => {setTimeout(() => resolve(), 1000)});
      await selfAuth(key, count++);
    } else {
      logger.error('Self-Auth failed after 10 attempts, API is either hung up or not responding. Exiting...');
      process.exit(1);
    }
  });
}


export const AuthController: Router = router;
