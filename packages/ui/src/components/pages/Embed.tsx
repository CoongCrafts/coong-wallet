import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useEffectOnce } from 'react-use';
import { isWalletRequest, newWalletErrorResponse, newWalletResponse, newWalletSignal } from '@coong/base';
import { WalletRequestMessage, WalletResponse, WalletSignal } from '@coong/base/types';
import { styled } from '@mui/material';
import CoongTextLogo from 'components/shared/misc/CoongTextLogo';
import { useWalletState } from 'providers/WalletStateProvider';
import { Props } from 'types';
import { isInsideIframe, topWindow } from 'utils/browser';
import { walletInfo } from 'walletInfo';

const Embed: FC<Props> = ({ className = '' }: Props) => {
  const { handleWalletRequest } = useWalletState();
  const { t } = useTranslation();
  const loadedInsideIframe = isInsideIframe() && !!topWindow();

  useEffectOnce(() => {
    if (!loadedInsideIframe) {
      console.error(t<string>('This page should be loaded inside an iframe!'));
      return;
    }

    topWindow().postMessage(newWalletSignal(WalletSignal.WALLET_EMBED_INITIALIZED, walletInfo), '*');

    const onUnload = () => {
      topWindow().postMessage(newWalletSignal(WalletSignal.WALLET_EMBED_UNLOADED, walletInfo), '*');
    };

    window.addEventListener('unload', onUnload);
    return () => window.removeEventListener('unload', onUnload);
  });

  useEffectOnce(() => {
    if (!loadedInsideIframe) {
      return;
    }

    const onMessage = (event: MessageEvent<WalletRequestMessage>) => {
      const { origin, data: message } = event;
      if (origin === window.location.origin || !isWalletRequest(message)) {
        return;
      }

      const { id } = message;

      handleWalletRequest(message)
        .then((response: WalletResponse) => {
          topWindow().postMessage(newWalletResponse(response, id), origin);
        })
        .catch((error: any) => {
          const message = error instanceof Error ? error.message : String(error);
          topWindow().postMessage(newWalletErrorResponse(message, id), origin);
        });
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  });

  return (
    <div className={className}>
      <CoongTextLogo />
      <h2>{t<string>('Welcome to Coong Wallet!')}</h2>
      <h3>{t<string>('This page should be loaded inside an iframe!')}</h3>
      <p>{t<string>("If you open this page by accident, it's safe to close it now.")}</p>
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
