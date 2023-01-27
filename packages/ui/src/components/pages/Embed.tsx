import React, { FC } from 'react';
import { useEffectOnce } from 'react-use';
import {
  handleWalletRequest,
  isWalletRequest,
  newWalletErrorResponse,
  newWalletResponse,
  newWalletSignal,
} from '@coong/base';
import { RequestName, WalletRequestEvent, WalletResponse, WalletSignal } from '@coong/base/types';
import { styled } from '@mui/material';
import CoongTextLogo from 'components/shared/mics/CoongTextLogo';
import { Props } from 'types';

const Embed: FC<Props> = ({ className = '' }: Props) => {
  const topWindow = window.top;
  const isInsideIframe = topWindow !== window.self;

  useEffectOnce(() => {
    if (!topWindow || !isInsideIframe) {
      console.error('This page should be loaded inside an iframe!');
      return;
    }

    topWindow.postMessage(newWalletSignal(WalletSignal.WALLET_EMBED_INITIALIZED), '*');
  });

  useEffectOnce(() => {
    if (!isInsideIframe) {
      return;
    }

    const onMessage = (event: MessageEvent<WalletRequestEvent>) => {
      const { origin, data } = event;
      if (origin === window.location.origin || !isWalletRequest(data)) {
        return;
      }

      const { id, request } = data;

      handleWalletRequest(origin, id, request)
        .then((response: WalletResponse<RequestName>) => {
          window.top!.postMessage(newWalletResponse(response, id), origin);
        })
        .catch((error: any) => {
          const message = error instanceof Error ? error.message : String(error);
          window.top!.postMessage(newWalletErrorResponse(message, id), origin);
        });
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  });

  return (
    <div className={className}>
      <CoongTextLogo />
      <h2>Welcome to Coong Wallet!</h2>
      <h3>This page should be loaded inside an iframe!</h3>
      <p>If you open this page by accident, it's safe to close it.</p>
    </div>
  );
};

export default styled(Embed)`
  text-align: center;
  margin: 2rem 1rem;

  h2 {
    margin-top: 2rem;
  }

  h3 {
    color: red;
  }
`;
