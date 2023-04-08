import React, { FC } from 'react';
import { CoongError, ErrorCode } from '@coong/utils';
import { CircularProgress } from '@mui/material';
import RequestAccess from 'components/pages/Request/RequestAccess';
import RequestSignRawMessage from 'components/pages/Request/RequestSigning/RequestSignRawMessage';
import RequestTransactionApproval from 'components/pages/Request/RequestSigning/RequestTransactionApproval';
import useCurrentRequestMessage from 'hooks/messages/useCurrentRequestMessage';
import { Props } from 'types';

const RequestContent: FC<Props> = () => {
  const [ready, message] = useCurrentRequestMessage();

  if (!ready) {
    return (
      <div className='flex justify-center my-8'>
        <CircularProgress />
      </div>
    );
  }

  const requestName = message?.request?.name;

  if (requestName === 'tab/requestAccess') {
    return <RequestAccess message={message!} />;
  } else if (requestName === 'tab/signExtrinsic') {
    return <RequestTransactionApproval message={message!} />;
  } else if (requestName === 'tab/signRaw') {
    return <RequestSignRawMessage message={message!} />;
  }

  throw new CoongError(ErrorCode.UnknownRequest);
};

export default RequestContent;
