import { FC } from 'react';
import { withErrorBoundary } from 'react-error-boundary';
import { useSearchParams } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import { isWalletRequest, newWalletErrorResponse, newWalletResponse, newWalletSignal } from '@coong/base';
import { WalletRequestMessage, WalletResponse, WalletSignal } from '@coong/base/types';
import { CoongError, ErrorCode, getErrorMessage } from '@coong/utils';
import InvalidRequest from 'components/pages/Request/InvalidRequest';
import RequestContent from 'components/pages/Request/RequestContent';
import { useWalletState } from 'providers/WalletStateProvider';
import { Props } from 'types';
import { isChildTabOrPopup, openerWindow } from 'utils/browser';
import { walletInfo } from 'walletInfo';

const Request: FC<Props> = ({ className = '' }) => {
  const [searchParams] = useSearchParams();
  const { handleWalletRequest } = useWalletState();

  if (!isChildTabOrPopup()) {
    console.error('This page should not be open directly!');
    throw new CoongError(ErrorCode.UnknownRequestOrigin);
  }

  const handleRequest = (message: WalletRequestMessage, eventOrigin?: string) => {
    const { origin, id } = message;

    const originUrl = eventOrigin || origin;

    handleWalletRequest(message)
      .then((response: WalletResponse) => {
        openerWindow().postMessage(newWalletResponse(response, id), originUrl);
      })
      .catch((error: any) => {
        const message = error instanceof Error ? error.message : String(error);
        openerWindow().postMessage(newWalletErrorResponse(message, id), originUrl);
      })
      .finally(() => {
        window.close();
      });
  };

  useEffectOnce(() => {
    const message = JSON.parse(searchParams.get('message')!) as WalletRequestMessage;

    if (!isWalletRequest(message)) {
      return;
    }

    handleRequest(message);
  });

  useEffectOnce(() => {
    const onMessage = (event: MessageEvent<WalletRequestMessage>) => {
      const { origin, data: message } = event;
      if (origin === window.location.origin || !isWalletRequest(message)) {
        return;
      }

      const params = new URLSearchParams({ message: JSON.stringify(message) });

      window.history.pushState({}, '', `/request?${params.toString()}`);

      handleRequest(message, origin);
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  });

  useEffectOnce(() => {
    openerWindow().postMessage(newWalletSignal(WalletSignal.WALLET_TAB_INITIALIZED, walletInfo), '*');

    const onUnload = () => {
      openerWindow().postMessage(newWalletSignal(WalletSignal.WALLET_TAB_UNLOADED, walletInfo), '*');
    };

    window.addEventListener('unload', onUnload);
    return () => window.removeEventListener('unload', onUnload);
  });

  return (
    <div className={`${className} mt-4 mb-[200px] mx-auto`}>
      <RequestContent />
    </div>
  );
};

const WrappedRequest = withErrorBoundary(Request, {
  fallbackRender: ({ error }) => {
    return <InvalidRequest reason={getErrorMessage(error)} />;
  },
});

export default WrappedRequest;
