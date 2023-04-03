import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import AccountCard from 'components/pages/Accounts/AccountCard';
import RequestDetails from 'components/pages/Request/RequestSigning/RequestDetails';
import SignArea from 'components/pages/Request/RequestSigning/SignArea';
import { useRawMessageDetails } from 'components/pages/Request/RequestSigning/hooks/useRawMessageDetails';
import useTargetAccount from 'components/pages/Request/RequestSigning/hooks/useTargetAccount';
import { RequestProps } from 'components/pages/Request/types';
import { useWalletState } from 'providers/WalletStateProvider';

const RequestSignRawMessage: FC<RequestProps> = ({ className = '', message }) => {
  const { t } = useTranslation();
  const { walletState } = useWalletState();
  const targetAccount = useTargetAccount(message);
  const detailRows = useRawMessageDetails(message);

  const doSignMessage = async (password: string) => {
    await walletState.signRawMessage(password);
  };

  const cancelRequest = () => {
    walletState.cancelSignRawMessage();
  };

  return (
    <div className={className}>
      <h2 className='text-center'>{t<string>('Sign Message Request')}</h2>
      <p className='mb-2'>{t<string>('You are signing a message with account')}</p>
      {targetAccount && <AccountCard account={targetAccount} />}
      <RequestDetails rows={detailRows} />
      <SignArea onSign={doSignMessage} onCancel={cancelRequest} signButtonLabel={'Sign Message'} />
    </div>
  );
};

export default RequestSignRawMessage;
