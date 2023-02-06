import { FC } from 'react';
import { withErrorBoundary } from 'react-error-boundary';
import { useSearchParams } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import {
  handleWalletRequest,
  isWalletRequest,
  newWalletErrorResponse,
  newWalletResponse,
  newWalletSignal,
} from '@coong/base';
import { WalletRequestMessage, WalletResponse, WalletSignal } from '@coong/base/types';
import { CoongError, ErrorCode } from '@coong/utils';
import { getErrorMessage } from '@coong/utils/errors';
import { styled } from '@mui/material';
import InvalidRequest from 'components/pages/Request/InvalidRequest';
import RequestContent from 'components/pages/Request/RequestContent';
import { Props } from 'types';
import { isChildTabOrPopup, openerWindow } from 'utils/browser';

const Request: FC<Props> = ({ className = '' }) => {
  const [searchParams] = useSearchParams();

  if (!isChildTabOrPopup()) {
    console.error('This page should not be open directly!');
    throw new CoongError(ErrorCode.UnknownRequestOrigin);
  }

  useEffectOnce(() => {
    const message = JSON.parse(searchParams.get('message')!) as WalletRequestMessage;

    if (!isWalletRequest(message)) {
      throw new CoongError(ErrorCode.InvalidMessageFormat);
    }

    const { origin, id } = message;

    handleWalletRequest(message)
      .then((response: WalletResponse) => {
        openerWindow().postMessage(newWalletResponse(response, id), origin);
      })
      .catch((error: any) => {
        const message = error instanceof Error ? error.message : String(error);
        openerWindow().postMessage(newWalletErrorResponse(message, id), origin);
      })
      .finally(() => {
        window.close();
      });
  });

  useEffectOnce(() => {
    openerWindow().postMessage(newWalletSignal(WalletSignal.WALLET_TAB_INITIALIZED), '*');

    const onUnload = () => {
      openerWindow().postMessage(newWalletSignal(WalletSignal.WALLET_TAB_UNLOADED), '*');
    };

    window.addEventListener('unload', onUnload);
    return () => window.removeEventListener('unload', onUnload);
  });

  return (
    <div className={className}>
      <RequestContent />
    </div>
  );
};

const StyledRequest = styled(Request)`
  margin: 1rem auto;
`;

const WrappedRequest = withErrorBoundary(StyledRequest, {
  fallbackRender: ({ error }) => {
    return <InvalidRequest reason={getErrorMessage(error)} />;
  },
});

export default WrappedRequest;
