import { InjectedAccount } from '@polkadot/extension-inject/types';
import { CoongError, ErrorCode } from '@coong/utils';
import { RequestAuthorizedAccounts, RequestName, WalletRequestMessage, WalletResponse } from '../types';
import Handler from './Handler';

/**
 * @name EmbedHandler
 * @description Handler for wallet requests from an embed wallet instance
 * @see packages/sdk/src/wallet/EmbedInstance.ts
 */
export default class EmbedHandler extends Handler {
  async authorizedAccounts(fromUrl: string, { anyType }: RequestAuthorizedAccounts): Promise<InjectedAccount[]> {
    const app = this.state.getAuthorizedApp(fromUrl);
    const accounts = await this.state.getInjectedAccounts(anyType);

    return accounts.filter((account) => app.authorizedAccounts.includes(account.address));
  }

  accessAuthorized(url: string): boolean {
    return this.state.ensureAppAuthorized(url);
  }

  async handle<TRequestName extends RequestName>(
    message: WalletRequestMessage<TRequestName>,
  ): Promise<WalletResponse<TRequestName>> {
    const { request, origin } = message;
    const { name } = request;

    // Make sure the state is refreshed before handling embed requests
    // TODO better check when to reload states
    this.state.reloadState();

    switch (name) {
      case 'embed/accessAuthorized':
        return this.accessAuthorized(origin);
      case 'embed/authorizedAccounts':
        return this.authorizedAccounts(origin, request.body as RequestAuthorizedAccounts);
      default:
        throw new CoongError(ErrorCode.UnknownRequest);
    }
  }
}
