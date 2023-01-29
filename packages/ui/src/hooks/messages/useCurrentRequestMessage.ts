import { useState } from 'react';
import { useEffectOnce } from 'react-use';
import { state } from '@coong/base';
import { RequestMessage, RequestName } from '@coong/base/types';

export default function useCurrentRequestMessage() {
  const [currentMessage, setCurrentMessage] = useState<RequestMessage<RequestName>>();

  useEffectOnce(() => {
    const unsub = state.subscribeToNewRequestMessage((message) => {
      setCurrentMessage(message);
    });

    return () => unsub();
  });

  return currentMessage;
}
