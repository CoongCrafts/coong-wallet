import { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
import { CoongError, ErrorCode } from '@coong/utils';
import { RequestName, WalletRequestMessage, WalletResponse } from '../types';
import Handler from './Handler';

/**
 * @name TabHandler
 * @description Handler for wallet requests from a tab wallet instance
 * @see packages/sdk/src/wallet/TabInstance.ts
 */
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
        // TODO if account is not authorized,
        //      add a view for request access to that particular account
        break;
      }
      case 'tab/requestAccess':
        // TODO return if the app is ready approved access
        break;
      default:
        throw new CoongError(ErrorCode.UnknownRequest);
    }

    return this.state.newRequestMessage(message);
  }
}
