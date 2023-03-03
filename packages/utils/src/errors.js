export var ErrorCode;
(function (ErrorCode) {
    ErrorCode["InternalError"] = "InternalError";
    ErrorCode["UnknownRequest"] = "UnknownRequest";
    ErrorCode["UnknownRequestOrigin"] = "UnknownRequestOrigin";
    ErrorCode["InvalidMessageFormat"] = "InvalidMessageFormat";
    ErrorCode["KeypairNotFound"] = "KeypairNotFound";
    ErrorCode["AccountNotFound"] = "AccountNotFound";
    ErrorCode["KeyringNotInitialized"] = "KeyringNotInitialized";
    ErrorCode["PasswordIncorrect"] = "PasswordIncorrect";
    ErrorCode["PasswordRequired"] = "PasswordRequired";
    ErrorCode["WalletLocked"] = "WalletLocked";
    ErrorCode["KeyringLocked"] = "KeyringLocked";
    ErrorCode["AccountNameRequired"] = "AccountNameRequired";
    ErrorCode["AccountNameUsed"] = "AccountNameUsed";
})(ErrorCode || (ErrorCode = {}));
export const ErrorCodes = Object.values(ErrorCode);
export class StandardCoongError extends Error {
}
export class CoongError extends StandardCoongError {
    code;
    constructor(errorCode, message) {
        super(message);
        this.code = errorCode;
    }
    get message() {
        return this.code || super.message;
    }
}
export const getErrorMessage = (error) => {
    if (error instanceof SyntaxError) {
        return ErrorCode.InvalidMessageFormat;
    }
    else if (error instanceof StandardCoongError) {
        return error.message;
    }
    return ErrorCode.InternalError;
};
export const isCoongError = (error) => {
    return error instanceof CoongError;
};
export const isStandardCoongError = (error) => {
    return error instanceof StandardCoongError;
};
