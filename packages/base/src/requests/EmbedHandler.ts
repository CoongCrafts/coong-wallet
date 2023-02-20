import { InjectedAccount } from '@polkadot/extension-inject/types';
import { SingleAddress, SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { KeypairType } from '@polkadot/util-crypto/types';
import { CoongError, ErrorCode } from '@coong/utils';
import keyring from 'keyring';
import Handler from 'requests/Handler';
import { RequestAuthorizedAccounts, RequestName, WalletRequestMessage, WalletResponse } from 'types';

const sortOldestFirst = (a: SingleAddress, b: SingleAddress) => {
  return (a.json.meta.whenCreated || 0) - (b.json.meta.whenCreated || 0);
};

export function canDerive(type?: KeypairType): boolean {
  return !!type && ['ed25519', 'sr25519', 'ecdsa', 'ethereum'].includes(type);
}

function transformAccounts(accounts: SubjectInfo, anyType = false): InjectedAccount[] {
  return Object.values(accounts)
    .filter(
      ({
        json: {
          meta: { isHidden },
        },
      }) => !isHidden,
    )
    .filter(({ type }) => (anyType ? true : canDerive(type)))
    .sort(sortOldestFirst)
    .map(
      ({
        json: {
          address,
          meta: { genesisHash, name },
        },
        type,
      }): InjectedAccount => ({
        address,
        genesisHash,
        name,
        type,
      }),
    );
}

export class EmbedHandler extends Handler {
  authorizedAccounts(fromUrl: string, { anyType }: RequestAuthorizedAccounts): InjectedAccount[] {
    const app = this.state.getAuthorizedApp(fromUrl);
    const accounts = transformAccounts(keyring.accountsStore.subject.getValue(), anyType);

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
    keyring.reload();

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
