import { MessageId, RequestName, WalletRequest, WalletResponse } from '@coong/base/types';
import { CoongError, ErrorCode } from '@coong/utils';
import Handler from 'requests/Handler';

export default class TabHandler extends Handler {
  async handle<TRequestName extends RequestName>(
    fromUrl: string,
    id: MessageId,
    request: WalletRequest<TRequestName>,
  ): Promise<WalletResponse<TRequestName>> {
    const { name } = request;

    if (name !== 'tab/requestAccess') {
      this.state.ensureAppAuthorized(fromUrl);
    }

    switch (name) {
      case 'tab/requestAccess':
      case 'tab/signRaw':
      case 'tab/signExtrinsic':
        return this.state.newRequestMessage(fromUrl, id, request);
      default:
        throw new CoongError(ErrorCode.UnknownRequest);
    }
  }
}
