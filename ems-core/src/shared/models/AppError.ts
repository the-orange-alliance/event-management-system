export default class AppError {
  private _httpCode: number;
  private _errorStr: string;
  private _message: string;

  constructor(httpCode: number, errorStr: string, message: string) {
    this._httpCode = httpCode;
    this._errorStr = errorStr;
    this._message = message;
  }

  toString() {
    return `Error ${this.httpCode}: ${this.errorStr}. ${this.message}`;
  }

  get httpCode(): number {
    return this._httpCode;
  }

  get errorStr(): string {
    return this._errorStr;
  }

  get message(): string {
    return this._message;
  }
}