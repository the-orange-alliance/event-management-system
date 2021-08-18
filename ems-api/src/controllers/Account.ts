import {Router, Request, Response, NextFunction} from 'express';
import * as Errors from "../errors";
import * as jwt from "jsonwebtoken";
import {jwtToken} from "../server";
import {JwtPayload} from "jsonwebtoken";
import DatabaseManager from "../database-manager";
import {compareSync, hashSync} from "bcrypt";
import {Permissions} from "../errors";
import { randomBytes } from 'crypto';
import {SocketProvider} from "@the-orange-alliance/lib-ems";

const router: Router = Router();

router.post("/changepassword", async (req: Request, res: Response, next: NextFunction) => {
  // Check body
  if(!req.body.records || (req.body.records && req.body.records.length < 1)) return next(Errors.INVALID_BODY_JSON);
  const data = req.body.records[0];
  if(!data) return next(Errors.INVALID_BODY_JSON);
  if(!data.old_password) return next(Errors.MISSING_BODY_INFORMATION('old_password'));
  if(!data.new_password) return next(Errors.MISSING_BODY_INFORMATION('new_password'));
  if(!data.new_password_verifier) return next(Errors.MISSING_BODY_INFORMATION('new_password_verifier'));
  // split token
  const token = req.get('authorization')?.split(' ')[1];
  if(token != undefined) {
    // decode token
    const userId = (jwt.verify(token, jwtToken) as JwtPayload).user_id;
    // find user with that user_id
    const user = await DatabaseManager.selectAllWhere('users', `user_id = ${userId}`).catch(() => {});
    // check that user exists
    if(!user || user && user.length < 1) return next(Errors.UNAUTHORIZED);
    // check that old_password matches
    if(!compareSync(data.old_password, user[0].password)) return next(Errors.UNAUTHORIZED);
    // check that new_password and new_password_verifier match
    if(data.new_password !== data.new_password_verifier) return next(Errors.CUSTOM_ERROR(401, 'new_password and new_password_verifier do not match!'))
    // encrypt password and update it
    const updated = {password: hashSync(data.new_password, 10)};
    await DatabaseManager.updateWhere('users', updated, `user_id = ${userId}`).catch((err) => {
      next(Errors.ERROR_WHILE_EXECUTING_QUERY(err));
    });
    // remove old token generated with old password
    await DatabaseManager.deleteAllWhere('auth_tokens', `token = '${token}'`).catch((err) => {
      next(Errors.ERROR_WHILE_EXECUTING_QUERY(err));
    });
    return res.json({success: true});
  } else {
    return next(Errors.UNAUTHORIZED);
  }
});

router.get('/whoami', async (req: Request, res: Response, next: NextFunction) => {
  // split token
  const token = req.get('authorization')?.split(' ')[1];
  if(token != undefined) {
    // decode token
    const tokenPayload = (jwt.verify(token, jwtToken) as JwtPayload);
    if(tokenPayload.api_key !== undefined) {
      // find user with that user_id
      const user = await DatabaseManager.selectAllWhere('api_keys', `key = '${tokenPayload.api_key}'`).catch((err) => next(Errors.ERROR_WHILE_EXECUTING_QUERY(err)));
      // check that user exists
      if(!user || user && user.length < 1) return next(Errors.UNAUTHORIZED);
      return res.json(user[0]);
    } else if(tokenPayload.user_id !== undefined) {
      // find user with that user_id
      const user = await DatabaseManager.selectAllWhere('users', `user_id = ${tokenPayload.user_id}`).catch((err) => next(Errors.ERROR_WHILE_EXECUTING_QUERY(err)));
      // check that user exists
      if(!user || user && user.length < 1) return next(Errors.UNAUTHORIZED);
      return res.json(user[0]);
    } else {
      return next(Errors.UNAUTHORIZED);
    }
  } else {
    return next(Errors.UNAUTHORIZED);
  }
});

router.get('/users', async (req: Request, res: Response, next: NextFunction) => {
  if(res.get('Can-Control-Event') === '0') return next(Errors.INVALID_PERMISSIONS(Permissions.event));
  DatabaseManager.selectAll('users').then((users: any[]) => {
    // clean passwords
    for(let i = 0; i < users.length; i++) users[i].password = undefined;
    res.json({payload: users});
  }).catch((err) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(err));
  })
});

router.get('/apikeys', async (req: Request, res: Response, next: NextFunction) => {
  if(res.get('Can-Control-Event') === '0') return next(Errors.INVALID_PERMISSIONS(Permissions.event));
  DatabaseManager.selectAll('api_keys').then((keys: any[]) => {
    res.json({payload: keys});
  }).catch((err) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(err));
  })
});

router.post('/checkusername', async (req: Request, res: Response, next: NextFunction) => {
  if(res.get('Can-Control-Event') === '0') return next(Errors.INVALID_PERMISSIONS(Permissions.event));
  if (req.body.records.length < 1) return next(Errors.EMPTY_BODY);
  DatabaseManager.selectAllWhere('users', `username = '${req.body.records[0].username}'`).then((keys: any[]) => {
    res.json({payload: {available: Array.isArray(keys) && keys.length === 0}});
  }).catch((err) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(err));
  })
});

router.post('/createuser', async (req: Request, res: Response, next: NextFunction) => {
  if(res.get('Can-Control-Event') === '0') return next(Errors.INVALID_PERMISSIONS(Permissions.event));
  if (req.body.records.length < 1) return next(Errors.EMPTY_BODY);
  const users = [] as any;
  const apikeys = [] as any;
  for(const u of req.body.records) {
    u.can_control_fms = (u.can_control_fms) ? 1 : 0;
    u.can_control_event = (u.can_control_fms) ? 1 : 0;
    u.can_control_match = (u.can_control_fms) ? 1 : 0;
    u.can_ref = (u.can_control_fms) ? 1 : 0;
    if (!u.username) {
      if(u.owner_user_id === null) return next(Errors.MISSING_BODY_INFORMATION('owner_user_id'));
      u.key = randomBytes(64).toString('hex');
      apikeys.push(u);
    } else {
      const usernames = await DatabaseManager.selectAllWhere('users', `username = '${u.username}'`);
      if (Array.isArray(usernames) && usernames.length > 0) return next(Errors.CUSTOM_ERROR(400, `Username ${u.username} already exists!`));
      u.password = hashSync(u.password, 10);
      users.push(u);
    }
  }
  const promises = [];
  if(users.length > 0) promises.push(DatabaseManager.insertValues('users', users));
  if(apikeys.length > 0) promises.push(DatabaseManager.insertValues('api_keys', apikeys));

  Promise.all(promises).then(() => {
    if(apikeys.length > 0) {
      res.json({payload: {ok: true, api_keys: apikeys}});
    } else {
      res.json({payload: {ok: true}});
    }
  }).catch((err) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(err));
  });
});

router.put('/:username/updateuser', async (req: Request, res: Response, next: NextFunction) => {
  if(res.get('Can-Control-Event') === '0') return next(Errors.INVALID_PERMISSIONS(Permissions.event));
  if (req.body.records.length < 1) return next(Errors.EMPTY_BODY);
  const updated = req.body.records[0];
  if (req.params.username === 'ems-admin') return next(Errors.UNAUTHORIZED);
  if (updated.description && updated.description.indexOf('-autogenerated') > -1 && updated.description.indexOf('ems-') > -1) return next(Errors.UNAUTHORIZED);
  // Convert boolean values to integers
  updated.can_control_fms = (updated.can_control_fms) ? 1 : 0;
  updated.can_control_event = (updated.can_control_event) ? 1 : 0;
  updated.can_control_match = (updated.can_control_match) ? 1 : 0;
  updated.can_ref = (updated.can_ref) ? 1 : 0;
  if(updated.password) updated.password = hashSync(updated.password, 10);
  //  Make Requests
  if (updated.description) {
    DatabaseManager.updateWhere('api_keys', updated, `key = '${req.params.username}'`).then(() => {
      res.json({payload: {ok: true}});
    }).catch((err) => {
      next(Errors.ERROR_WHILE_EXECUTING_QUERY(err));
    });
  } else {
    DatabaseManager.updateWhere('users', updated, `username = '${req.params.username}'`).then(() => {
      res.json({payload: {ok: true}});
    }).catch((err) => {
      next(Errors.ERROR_WHILE_EXECUTING_QUERY(err));
    })
  }
});

router.delete('/:username/deleteuser', async (req: Request, res: Response, next: NextFunction) => {
  if(res.get('Can-Control-Event') === '0') return next(Errors.INVALID_PERMISSIONS(Permissions.event));
  if (req.params.userame === 'ems-admin') return next(Errors.UNAUTHORIZED);
  DatabaseManager.deleteAllWhere('users', `username = '${req.params.username}'`).then(() => {
    SocketProvider.emit('user-removed', req.params.username);
    res.json({payload: {ok: true}});
  }).catch((err) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(err));
  });
});

router.delete('/:apikey/deleteapikey', async (req: Request, res: Response, next: NextFunction) => {
  if(res.get('Can-Control-Event') === '0') return next(Errors.INVALID_PERMISSIONS(Permissions.event));

  DatabaseManager.selectAllWhere('api_keys', `key = '${req.params.apikey}'`).then((data: any[]) => {
    if(data.length > 0) {
      if(data[0].description.indexOf('-autogenerated') === -1 && data[0].description.indexOf('ems-') === -1 ) {
        DatabaseManager.deleteAllWhere('api_keys', `key = '${req.params.apikey}'`).then(() => {
          SocketProvider.emit('apikey-removed', req.params.apikey);
          res.json({payload: {ok: true}});
        }).catch((err) => {
          next(Errors.ERROR_WHILE_EXECUTING_QUERY(err));
        });
      } else {
        next(Errors.UNAUTHORIZED);
      }
    } else {
      next(Errors.EMPTY_BODY);
    }
  }).catch((err) => {
    next(Errors.ERROR_WHILE_EXECUTING_QUERY(err));
  });
  // Cant delete any autogenerated keys
  //if (req.body.records[0].description.indexOf('-autogenerated') > -1 && req.body.records[0].description.indexOf('ems-') > -1) return next(Errors.UNAUTHORIZED);
  //DatabaseManager.deleteAllWhere('api_keys', `key = '${req.params.apikey}'`).then(() => {
  //  res.json({payload: {ok: true}});
  //})
});

export const AccountController: Router = router;
