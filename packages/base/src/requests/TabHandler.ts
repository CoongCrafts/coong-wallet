import { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
import { CoongError, ErrorCode } from '@coong/utils';
import { RequestName, WalletRequestMessage, WalletResponse } from '../types';
import Handler from './Handler';

export default class TabHandler extends Handler {
  async handle<TRequestName extends RequestName>(
    message: WalletRequestMessage<TRequestName>,
  ): Promise<WalletResponse<TRequestName>> {
    const { request, origin: fromUrl } = message;
    const { name } = request;

    if (name !== 'tab/requestAccess') {
      this.state.ensureAppAuthorized(fromUrl);
    }

    switch (name) {
      case 'tab/signRaw':
      case 'tab/signExtrinsic': {
        const { address } = request.body as SignerPayloadJSON | SignerPayloadRaw;
        this.state.ensureAccountAuthorized(fromUrl, address);
        break;
      }
      case 'tab/requestAccess':
        break;
      default:
        throw new CoongError(ErrorCode.UnknownRequest);
    }

    return this.state.newRequestMessage(message);
  }
}
