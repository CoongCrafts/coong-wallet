export enum ErrorCode {
  UnknownRequest = 'UnknownRequest',
  InvalidWalletRequest = 'InvalidWalletRequest',

  KeyringNotInitialized = 'KeyringNotInitialized',
  PasswordIncorrect = 'PasswordIncorrect',
  WalletLocked = 'WalletLocked',
  AccountNameRequired = 'AccountNameRequired',
}

export const ErrorCodes = Object.values(ErrorCode) as string[];

export class StandardCoongError extends Error {}

export class CoongError extends StandardCoongError {
  code: ErrorCode;
  constructor(errorCode: ErrorCode, message?: string) {
    super(message);
    this.code = errorCode;
  }
}
