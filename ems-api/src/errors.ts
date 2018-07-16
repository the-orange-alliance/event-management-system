export class Error {
  private _code: number;
  private _message: string;

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

export function MISSING_BODY_INFORMATION(field: string) {
  return new Error(400, "The field \'" + field + "\' was missing in the JSON body.");
}