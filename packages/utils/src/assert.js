import { CoongError, ErrorCode, ErrorCodes } from './errors';
export function assert(condition, message) {
    if (condition) {
        return;
    }
    if (message && ErrorCodes.includes(message)) {
        throw new CoongError(message);
    }
    else {
        throw new CoongError(ErrorCode.UnknownRequest, message);
    }
}
/**
 * Throw out error if condition is undefined, false, null, '' or 0
 *
 * @param condition
 * @param message
 */
export function assertFalse(condition, message) {
    assert(!condition, message);
}
