import { MessageId, RequestAppRequestAccess, RequestName, WalletRequest, WalletResponse } from '@coong/base/types';
import { CoongError, ErrorCode } from '@coong/utils';
import Handler from 'requests/Handler';

export default class TabHandler extends Handler {
  async authorizeApp(fromUrl: string, request: RequestAppRequestAccess) {
    return this.state.authorizeApp(fromUrl, request, []);
  }

  async handle<TRequestName extends RequestName>(
    fromUrl: string,
    id: MessageId,
    request: WalletRequest<TRequestName>,
  ): Promise<WalletResponse<TRequestName>> {
    const { name } = request;

    switch (name) {
      case 'tab/requestAccess':
        return this.authorizeApp(fromUrl, request.body as RequestAppRequestAccess);
      case 'tab/signRaw':
      case 'tab/signExtrinsic':
      default:
        throw new CoongError(ErrorCode.UnknownRequest);
    }
  }
}
