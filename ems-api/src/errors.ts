export class Error {
  private readonly _code: number;
  private readonly _message: string;

  constructor(code: number, message: string) {
    this._code = code;
    this._message = message;
  }

  get code(): number {
    return this._code;
  }

  get message(): string {
    return this._message;
  }
}

export const UNACCEPTABLE_CONTENT_TYPE = new Error(406, "Unacceptable client Content-Type.");
export const CONTENT_NOT_FOUND = new Error(404, "Content not found.");
export const INVALID_BODY_JSON = new Error(400, "Invalid JSON body was sent with the request.");
export const METHOD_NOT_FOUND = new Error(404, "The method for the requested URL is not defined.");
export const ROUTE_NOT_DEFINED = new Error(404, "The route requested is not defined.");
export const EMPTY_BODY = new Error(400, "A JSON body is required for this route.");
export const INVALID_CREDENTIALS = new Error(401, "Invalid Credentials");
export const UNAUTHORIZED = new Error(401, "Unauthorized");

export function MISSING_BODY_INFORMATION(field: string) {
  return new Error(400, "The field \'" + field + "\' was missing in the JSON body.");
}

export function INVALID_PERMISSIONS(permission: Permissions) {
  return new Error(401, "Insufficient permissions. Route requires \'" + permission + "\' permission to be accessed.");
}

export function MISSING_QUERY(query: string) {
    return new Error(400, "The query \"" + query + "\" is missing from the request.");
}

export function ERROR_WHILE_CREATING_DB(reason: string) {
  return new Error(400, "Error while creating event database. " + reason);
}

export function ERROR_WHILE_DELETING_DB(reason: string) {
    return new Error(400, "Error while deleting event database." + reason);
}

export function ERROR_WHILE_EXECUTING_QUERY(reason: string) {
    return new Error(500, "Error while executing query. " + reason);
}

export function CUSTOM_ERROR(code: number, message: string) {
    return new Error(code, message);
}

export enum Permissions {
  fms = "can_control_fms",
  event = "can_control_event",
  match = "can_control_match",
  ref = "can_ref",
}
