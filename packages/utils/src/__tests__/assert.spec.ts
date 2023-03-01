import { describe, expect, it } from 'vitest';
import { assert, assertFalse } from '../assert';
import { CoongError, ErrorCode, StandardCoongError } from '../errors';

describe('assert', () => {
  it('should throw CoongError', function () {
    expect(() => {
      assert(false, ErrorCode.InternalError);
    }).toThrowError(CoongError);
  });

  it('should throw CoongStandardError', function () {
    expect(() => {
      assert(false, 'Random message');
    }).toThrowError(StandardCoongError);
  });

  it('should be silent', function () {
    assert(true, 'Nothing thrown out');
  });
});

describe('assertFalse', () => {
  it('should throw CoongError', function () {
    expect(() => {
      assertFalse(true, ErrorCode.InternalError);
    }).toThrowError(CoongError);
  });

  it('should throw CoongStandardError', function () {
    expect(() => {
      assertFalse(true, 'Random message');
    }).toThrowError(StandardCoongError);
  });

  it('should be silent', function () {
    assertFalse(false, 'Nothing thrown out');
  });
});
