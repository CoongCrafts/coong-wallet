import { CoongError, ErrorCode, ErrorCodes } from 'errors';

export function assert(condition: unknown, message: string) {
  if (!condition) {
    if (ErrorCodes.includes(message)) {
      throw new CoongError(message as ErrorCode);
    } else {
      throw new CoongError(ErrorCode.UnknownRequest, message);
    }
  }
}

export function assertFalse(condition: unknown, message: string) {
  assert(!condition, message);
}
