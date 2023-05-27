export enum ErrorCode {
  InternalError = 'InternalError',
  UnknownRequest = 'UnknownRequest',
  UnknownRequestOrigin = 'UnknownRequestOrigin',
  InvalidMessageFormat = 'InvalidMessageFormat',
  KeypairNotFound = 'KeypairNotFound',
  AccountNotFound = 'AccountNotFound',

  KeyringNotInitialized = 'KeyringNotInitialized',
  PasswordIncorrect = 'PasswordIncorrect',
  PasswordRequired = 'PasswordRequired',
  WalletLocked = 'WalletLocked',
  KeyringLocked = 'KeyringLocked',
  AccountNameRequired = 'AccountNameRequired',
  AccountNameUsed = 'AccountNameUsed',
  InvalidMnemonic = 'InvalidMnemonic',
  OriginalHashNotFound = 'OriginalHashNotFound',
}

export const ErrorCodes = Object.values(ErrorCode) as string[];

export class StandardCoongError extends Error {}

export class CoongError extends StandardCoongError {
  code: ErrorCode;
  constructor(errorCode: ErrorCode, message?: string) {
    super(message);
    this.code = errorCode;
  }

  get message() {
    return this.code || super.message;
  }
}

export const getErrorMessage = (error: Error) => {
  if (error instanceof SyntaxError) {
    return ErrorCode.InvalidMessageFormat;
  } else if (error instanceof StandardCoongError) {
    return error.message;
  }

  return ErrorCode.InternalError;
};

export const isCoongError = (error: Error) => {
  return error instanceof CoongError;
};

export const isStandardCoongError = (error: Error) => {
  return error instanceof StandardCoongError;
};
