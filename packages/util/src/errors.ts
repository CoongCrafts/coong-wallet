export enum ErrorCode {
  UnknownRequest = 'UnknownRequest',
  AccountNameIsUsed = 'AccountNameIsUsed',
}

export const ErrorCodes = Object.values(ErrorCode) as string[];

export class CoongError extends Error {
  code: ErrorCode;
  constructor(errorCode: ErrorCode, message?: string) {
    super(message);
    this.code = errorCode;
  }
}
