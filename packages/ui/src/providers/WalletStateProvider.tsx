import { createContext, FC, useContext, useMemo } from 'react';
import { isMessageId, TabHandler, WalletState } from '@coong/base';
import { RequestName, WalletRequestMessage, WalletResponse } from '@coong/base/types';
import Keyring from '@coong/keyring';
import { CoongError, ErrorCode } from '@coong/utils';
import { Props } from 'types';

export interface HandleWalletRequest {
  <TRequestName extends RequestName>(message: WalletRequestMessage<TRequestName>): Promise<
    WalletResponse<TRequestName>
  >;
}

interface WalletStateContextProps {
  keyring: Keyring;
  walletState: WalletState;
  handleWalletRequest: HandleWalletRequest;
}

export const WalletStateContext = createContext<WalletStateContextProps>({} as WalletStateContextProps);

export const useWalletState = () => useContext(WalletStateContext);

interface WalletStateProviderProps extends Props {
  initialKeyring?: Keyring;
  initialWalletState?: WalletState;
}

export const WalletStateProvider: FC<WalletStateProviderProps> = ({ children, initialKeyring, initialWalletState }) => {
  const keyring = useMemo(() => initialKeyring || new Keyring(), [initialKeyring]);
  const walletState = useMemo(() => initialWalletState || new WalletState(keyring), [initialWalletState, keyring]);

  async function handleWalletRequest<TRequestName extends RequestName>(
    message: WalletRequestMessage<TRequestName>,
  ): Promise<WalletResponse<TRequestName>> {
    const {
      id,
      request: { name },
    } = message;

    if (isMessageId(id) && name.startsWith('tab/')) {
      return new TabHandler(walletState).handle(message);
    }

    throw new CoongError(ErrorCode.UnknownRequest);
  }

  return (
    <WalletStateContext.Provider value={{ keyring, walletState, handleWalletRequest }}>
      {children}
    </WalletStateContext.Provider>
  );
};
