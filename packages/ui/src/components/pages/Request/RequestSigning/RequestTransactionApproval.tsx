import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import AccountCard from 'components/pages/Accounts/AccountCard';
import RequestDetails from 'components/pages/Request/RequestSigning/RequestDetails';
import SignArea from 'components/pages/Request/RequestSigning/SignArea';
import useTargetAccount from 'components/pages/Request/RequestSigning/hooks/useTargetAccount';
import useTransactionDetails from 'components/pages/Request/RequestSigning/hooks/useTransactionDetails';
import { RequestProps } from 'components/pages/Request/types';
import { useWalletState } from 'providers/WalletStateProvider';

const RequestTransactionApproval: FC<RequestProps> = ({ className, message }) => {
  const { t } = useTranslation();
  const { walletState } = useWalletState();
  const targetAccount = useTargetAccount(message);
  const detailRows = useTransactionDetails(message);

  const approveTransaction = async (password: string) => {
    // signing & accounts decryption are synchronous operations
    // and might take some time to do
    // so we delay it a short amount of time to make sure the UI could be updated (disable button, ...)
    // before the signing process begin
    // TODO: Moving CPU-intensive operations to worker
    await walletState.approveSignExtrinsic(password);
  };

  const cancelRequest = () => {
    walletState.cancelSignExtrinsic();
  };

  return (
    <div className={className}>
      <h2 className='text-center'>{t<string>('Transaction Approval Request')}</h2>
      <p className='mb-2'>{t<string>('You are approving a transaction with account')}</p>
      {targetAccount && <AccountCard account={targetAccount} />}
      <RequestDetails className='my-4' rows={detailRows} />
      <SignArea onSign={approveTransaction} onCancel={cancelRequest} signButtonLabel={'Approve Transaction'} />
    </div>
  );
};

export default RequestTransactionApproval;
