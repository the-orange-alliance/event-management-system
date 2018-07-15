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