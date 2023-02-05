import { FC } from 'react';
import InvalidRequest from 'components/pages/Request/InvalidRequest';
import RequestAccess from 'components/pages/Request/RequestAccess';
import RequestTransactionApproval from 'components/pages/Request/RequestTransactionApproval';
import useCurrentRequestMessage from 'hooks/messages/useCurrentRequestMessage';
import { Props } from 'types';
import { isChildTabOrPopup } from 'utils/browser';

interface RequestContentProps extends Props {
  invalidReason?: string;
}

const RequestContent: FC<RequestContentProps> = ({ invalidReason }) => {
  const message = useCurrentRequestMessage();

  if (!isChildTabOrPopup() || !message || invalidReason) {
    return <InvalidRequest reason={invalidReason} />;
  }

  const requestName = message?.request?.name;

  if (requestName === 'tab/requestAccess') {
    return <RequestAccess message={message} />;
  } else if (requestName === 'tab/signExtrinsic') {
    return <RequestTransactionApproval message={message} />;
  }

  return <InvalidRequest reason={invalidReason} />;
};

export default RequestContent;
