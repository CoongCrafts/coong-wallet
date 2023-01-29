import { FC, useState } from 'react';
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
import { styled } from '@mui/material';
import RequestContent from 'components/pages/Request/RequestContent';
import { Props } from 'types';
import { isChildTabOrPopup, openerWindow } from 'utils/browser';

const Request: FC<Props> = ({ className = '' }) => {
  const [searchParams] = useSearchParams();
  const [reason, setReason] = useState<string>();

  useEffectOnce(() => {
    if (!isChildTabOrPopup()) {
      return;
    }

    try {
      const message = JSON.parse(searchParams.get('message')!) as WalletRequestMessage;

      const { origin, id } = message;

      if (!isWalletRequest(message)) {
        throw new CoongError(ErrorCode.InvalidMessageFormat);
      }

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
    } catch (e: any) {
      if (e instanceof SyntaxError) {
        setReason(ErrorCode.InvalidMessageFormat);
      } else {
        setReason(e.message);
      }
    }
  });

  useEffectOnce(() => {
    if (!isChildTabOrPopup()) {
      console.error('This page should not be open directly!');
      return;
    }

    openerWindow().postMessage(newWalletSignal(WalletSignal.WALLET_TAB_INITIALIZED), '*');

    const onUnload = () => {
      openerWindow().postMessage(newWalletSignal(WalletSignal.WALLET_TAB_UNLOADED), '*');
    };

    window.addEventListener('unload', onUnload);
    return () => window.removeEventListener('unload', onUnload);
  });

  return (
    <div className={className}>
      <RequestContent invalidReason={reason} />
    </div>
  );
};

export default styled(Request)`
  margin: 1rem auto;
`;
