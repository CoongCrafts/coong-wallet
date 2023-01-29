import { RequestName, WalletRequestMessage, WalletResponse } from '@coong/base/types';
import { CoongError, ErrorCode } from '@coong/utils';
import Handler from 'requests/Handler';

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
      case 'tab/requestAccess':
      case 'tab/signRaw':
      case 'tab/signExtrinsic':
        return this.state.newRequestMessage(message);
      default:
        throw new CoongError(ErrorCode.UnknownRequest);
    }
  }
}
