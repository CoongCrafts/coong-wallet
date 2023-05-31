import {
  Injected,
  InjectedAccount,
  InjectedAccounts,
  InjectedWindowProvider as DefaultInjectedWindowProvider,
} from '@polkadot/extension-inject/types';
import { MessageId, RequestName, WalletRequest, WalletResponse } from '@coong/base/types';

export interface Handler {
  resolve: (data: any) => void;
  reject: (error: Error) => void;
}

export type Handlers = Record<MessageId, Handler>;

export interface SendMessage {
  <TRequestName extends RequestName>(request: WalletRequest<TRequestName>): Promise<WalletResponse<TRequestName>>;
}

export interface CoongSdkOptions {
  walletUrl: string;
}

export interface UpdatableInjectedAccounts extends InjectedAccounts {
  update?: () => Promise<InjectedAccount[]>;
}

export interface UpdatableInjected extends Injected {
  accounts: UpdatableInjectedAccounts;
}

export interface InjectedWindowProvider extends DefaultInjectedWindowProvider {
  disable?: () => void;
}

type This = typeof globalThis;
export interface InjectedWindow extends This {
  injectedWeb3: Record<string, InjectedWindowProvider>;
}
