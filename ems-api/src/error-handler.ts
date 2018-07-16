import {NextFunction, Request, Response} from "express";
import * as Errors from "./errors";
import logger from './logger';

export function logErrors(err: any, req: Request, res: Response, next: NextFunction) {
  let ip = (req.header("x-forwarded-for") ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.remoteAddress || "").split(",")[0];

  let reqInfo = req.method.toString().toUpperCase() + " - " + req.originalUrl;
  let errInfo;

  if (err.statusCode && err.statusCode === 400) {
    errInfo = Errors.INVALID_BODY_JSON;
  }

  if (!err.code || !err.message) {
    let error = err.statusCode;
    let message = "General error";
    if (!error) {
      error = 400;
      message = err;
    }
    errInfo = { code: error, message: message };
    logger.error(err);
    next(errInfo);
  } else {
    if (typeof err.code !== "number") err = {code: 400, message: err.message};
    logger.error(ip + " failed request " + reqInfo + " | status code " + err.code + " " + err.message);
    next(err);
  }
}

export function handleClient(err: any, req: Request, res: Response, next: NextFunction) {
  if (req.get("Content-Type") !== "application/json") {
    res.status(err.code).send(err.code + " " + err.message);
  } else {
    res.status(err.code).send(err);
  }
}