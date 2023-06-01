import type { Signer as SignerInterface, SignerResult } from '@polkadot/api/types';
import { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types/extrinsic';
import CoongSdk from '@coong/sdk';

const nextRequestId = (): number => {
  return Date.now();
};

export default class CoongSigner implements SignerInterface {
  #sdk: CoongSdk;

  constructor(sdk: CoongSdk) {
    this.#sdk = sdk;
  }

  async signPayload(payload: SignerPayloadJSON): Promise<SignerResult> {
    const result = await this.#sdk.sendMessage({ name: 'tab/signExtrinsic', body: payload });

    return {
      ...result,
      id: nextRequestId(),
    };
  }

  async signRaw(raw: SignerPayloadRaw): Promise<SignerResult> {
    const result = await this.#sdk.sendMessage({ name: 'tab/signRaw', body: raw });

    return {
      ...result,
      id: nextRequestId(),
    };
  }
}
