import { MessageId, RequestName, WalletRequest, WalletResponse } from '@coong/base/types';
import { CoongError, ErrorCode } from '@coong/util';
import Handler from '@coong/base/requests/Handler';

export default class TabHandler extends Handler {
  async handle<TRequestName extends RequestName>(
    fromUrl: string,
    id: MessageId,
    request: WalletRequest<TRequestName>,
  ): Promise<WalletResponse<TRequestName>> {
    const { name } = request;

    switch (name) {
      case 'tab/requestAccess':
      case 'tab/signRaw':
      case 'tab/signExtrinsic':
      default:
        throw new CoongError(ErrorCode.UnknownRequest);
    }
  }
}
