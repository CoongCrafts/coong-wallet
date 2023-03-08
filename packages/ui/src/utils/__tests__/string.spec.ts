import { expect } from 'vitest';
import { shortenAddress } from '../string';

describe('shortenAddress', () => {
  it.each(['', null, undefined])('should return empty string if input = %s', (input) => {
    expect(shortenAddress(input as string)).toEqual('');
  });
  it("should return the whole address if address's length is less than or equal 15 chars", () => {
    expect(shortenAddress('0x123456789123')).toEqual('0x123456789123');
    expect(shortenAddress('0x1234567891234')).toEqual('0x1234567891234');
  });
  it("should return the shortened address if address's length is longer than 15 chars", () => {
    expect(shortenAddress('0x12345678912345')).toEqual('0x1234...912345');
    expect(shortenAddress('1EgNYYD1g2dSYavyTT13wkMZ8co2MzELtWuRabjRdQoxXPp')).toEqual('1EgNYY...QoxXPp');
  });
});
