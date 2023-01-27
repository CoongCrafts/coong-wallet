import { CoongError, ErrorCode, ErrorCodes } from 'errors';

export function assert(condition: unknown, message?: string) {
  if (condition) {
    return;
  }

  if (message && ErrorCodes.includes(message)) {
    throw new CoongError(message as ErrorCode);
  } else {
    throw new CoongError(ErrorCode.UnknownRequest, message);
  }
}

/**
 * Throw out error if condition is undefined, false, null, '' or 0
 *
 * @param condition
 * @param message
 */
export function assertFalse(condition: unknown, message?: string) {
  assert(!condition, message);
}
