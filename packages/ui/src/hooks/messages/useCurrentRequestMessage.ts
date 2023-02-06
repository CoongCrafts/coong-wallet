import { useState } from 'react';
import { useBoolean, useEffectOnce } from 'react-use';
import { state } from '@coong/base';
import { WalletRequestWithResolver } from '@coong/base/types';

export default function useCurrentRequestMessage(): [boolean, WalletRequestWithResolver | undefined] {
  const [ready, toggleReady] = useBoolean(false);
  const [currentMessage, setCurrentMessage] = useState<WalletRequestWithResolver>();

  useEffectOnce(() => {
    const unsub = state.subscribeToNewRequestMessage((message) => {
      setCurrentMessage(message);
      toggleReady();
    });

    return () => unsub();
  });

  return [ready, currentMessage];
}
