import { useState } from 'react';
import { useEffectOnce } from 'react-use';
import { state } from '@coong/base';
import { WalletRequestWithResolver } from '@coong/base/types';

export default function useCurrentRequestMessage() {
  const [currentMessage, setCurrentMessage] = useState<WalletRequestWithResolver>();

  useEffectOnce(() => {
    const unsub = state.subscribeToNewRequestMessage((message) => {
      setCurrentMessage(message);
    });

    return () => unsub();
  });

  return currentMessage;
}
