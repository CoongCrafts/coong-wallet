import { InjectedAccount } from '@polkadot/extension-inject/types';
import { SingleAddress, SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { KeypairType } from '@polkadot/util-crypto/types';
import { CoongError, ErrorCode } from '@coong/utils';
import keyring from 'keyring';
import Handler from 'requests/Handler';
import { MessageId, RequestAuthorizedAccounts, RequestName, WalletRequest, WalletResponse } from 'types';


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
  authorizedAccounts({ anyType }: RequestAuthorizedAccounts): InjectedAccount[] {
    return transformAccounts(keyring.accountsStore.subject.getValue(), anyType);
  }

  accessAuthorized(url: string): boolean {
    return this.state.ensureAppAuthorized(url);
  }

  async handle<TRequestName extends RequestName>(
    fromUrl: string,
    id: MessageId,
    request: WalletRequest<TRequestName>,
  ): Promise<WalletResponse<TRequestName>> {
    const { name } = request;

    switch (name) {
      case 'embed/accessAuthorized':
        return this.accessAuthorized(fromUrl);
      case 'embed/authorizedAccounts':
        return this.authorizedAccounts(request.body as RequestAuthorizedAccounts);
      default:
        throw new CoongError(ErrorCode.UnknownRequest);
    }
  }
}
