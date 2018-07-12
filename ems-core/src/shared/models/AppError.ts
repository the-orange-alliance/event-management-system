export default class AppError {
  private _errorCode: number;
  private _errorMessage: string;
  private _stacktrace: any;

  constructor(errorCode: number, errorMessage: string, stacktrace: any) {
    this._errorCode = errorCode;
    this._errorMessage = errorMessage;
    this._stacktrace = stacktrace.toString();
  }

  get errorCode(): number {
    return this._errorCode;
  }

  set errorCode(value: number) {
    this._errorCode = value;
  }

  get errorMessage(): string {
    return this._errorMessage;
  }

  set errorMessage(value: string) {
    this._errorMessage = value;
  }

  get stacktrace(): any {
    return this._stacktrace;
  }

  set stacktrace(value: any) {
    this._stacktrace = value.toString();
  }
}