import { u8aToHex } from '@polkadot/util';
import { sha256AsU8a } from '@polkadot/util-crypto';

export const sha256AsHex = (data: string): string => {
  return u8aToHex(sha256AsU8a(data));
};
