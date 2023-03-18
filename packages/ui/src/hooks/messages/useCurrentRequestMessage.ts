import { useState } from 'react';
import { useBoolean, useEffectOnce } from 'react-use';
import { WalletRequestWithResolver } from '@coong/base/types';
import { useWalletState } from 'providers/WalletStateProvider';

export default function useCurrentRequestMessage(): [boolean, WalletRequestWithResolver | undefined] {
  const { walletState } = useWalletState();
  const [ready, toggleReady] = useBoolean(false);
  const [currentMessage, setCurrentMessage] = useState<WalletRequestWithResolver>();

  useEffectOnce(() => {
    const unsub = walletState.subscribeToNewRequestMessage((message) => {
      setCurrentMessage(message);
      toggleReady();
    });

    return () => unsub();
  });

  return [ready, currentMessage];
}
