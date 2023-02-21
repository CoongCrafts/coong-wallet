import type { Signer as SignerInterface, SignerResult } from '@polkadot/api/types';
import { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types/extrinsic';
import { SendMessage } from '../types';

let sendMessage: SendMessage;

const nextRequestId = (): number => {
  return Date.now();
};

export default class CoongSigner implements SignerInterface {
  constructor(_sendMessage: SendMessage) {
    sendMessage = _sendMessage;
  }

  async signPayload(payload: SignerPayloadJSON): Promise<SignerResult> {
    const result = await sendMessage({ name: 'tab/signExtrinsic', body: payload });

    return {
      ...result,
      id: nextRequestId(),
    };
  }

  async signRaw(raw: SignerPayloadRaw): Promise<SignerResult> {
    const result = await sendMessage({ name: 'tab/signRaw', body: raw });

    return {
      ...result,
      id: nextRequestId(),
    };
  }
}
