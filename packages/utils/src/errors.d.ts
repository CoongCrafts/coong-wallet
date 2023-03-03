export declare enum ErrorCode {
    InternalError = "InternalError",
    UnknownRequest = "UnknownRequest",
    UnknownRequestOrigin = "UnknownRequestOrigin",
    InvalidMessageFormat = "InvalidMessageFormat",
    KeypairNotFound = "KeypairNotFound",
    AccountNotFound = "AccountNotFound",
    KeyringNotInitialized = "KeyringNotInitialized",
    PasswordIncorrect = "PasswordIncorrect",
    PasswordRequired = "PasswordRequired",
    WalletLocked = "WalletLocked",
    KeyringLocked = "KeyringLocked",
    AccountNameRequired = "AccountNameRequired",
    AccountNameUsed = "AccountNameUsed"
}
export declare const ErrorCodes: string[];
export declare class StandardCoongError extends Error {
}
export declare class CoongError extends StandardCoongError {
    code: ErrorCode;
    constructor(errorCode: ErrorCode, message?: string);
    get message(): ErrorCode;
}
export declare const getErrorMessage: (error: Error) => string;
export declare const isCoongError: (error: Error) => boolean;
export declare const isStandardCoongError: (error: Error) => boolean;
