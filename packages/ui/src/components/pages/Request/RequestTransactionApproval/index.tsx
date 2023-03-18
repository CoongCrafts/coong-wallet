import { FC, FormEvent, useState } from 'react';
import { useSelector } from 'react-redux';
import { Form } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAsync, useToggle } from 'react-use';
import { SignerPayloadJSON } from '@polkadot/types/types';
import { encodeAddress } from '@polkadot/util-crypto';
import { Button, TextField } from '@mui/material';
import AccountCard from 'components/pages/Accounts/AccountCard';
import RequestDetails from 'components/pages/Request/RequestTransactionApproval/RequestDetails';
import { RequestProps } from 'components/pages/Request/types';
import useThrowError from 'hooks/useThrowError';
import { useWalletState } from 'providers/WalletStateProvider';
import { RootState } from 'redux/store';
import { AccountInfoExt } from 'types';

const RequestTransactionApproval: FC<RequestProps> = ({ className, message }) => {
  const { keyring, walletState } = useWalletState();
  const { addressPrefix } = useSelector((state: RootState) => state.app);
  const [password, setPassword] = useState<string>('');
  const { request } = message;
  const [loading, toggleLoading] = useToggle(false);
  const [targetAccount, setTargetAccount] = useState<AccountInfoExt>();
  const throwError = useThrowError();

  useAsync(async () => {
    try {
      const payloadJSON = request.body as SignerPayloadJSON;
      const account = await keyring.getAccount(payloadJSON.address);
      const networkAddress = encodeAddress(account.address, addressPrefix);

      setTargetAccount({
        ...account,
        networkAddress,
      });
    } catch (e: any) {
      throwError(e);
    }
  }, []);

  const approveTransaction = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toggleLoading(true);

    // signing & accounts decryption are synchronous operations
    // and might take some time to do
    // so we delay it a short amount of time to make sure the UI could be updated (disable button, ...)
    // before the signing process begin
    // TODO: Moving CPU-intensive operations to worker
    setTimeout(async () => {
      try {
        await walletState.approveSignExtrinsic(password);
      } catch (e: any) {
        toggleLoading(false);
        toast.error(e.message);
      }
    }, 200);
  };

  const cancelRequest = () => {
    walletState.cancelSignExtrinsic();
  };

  return (
    <div className={className}>
      <h2 className='text-center'>Transaction Approval Request</h2>
      <p className='mb-2'>You are approving a transaction with account</p>
      {targetAccount && <AccountCard account={targetAccount} />}
      <RequestDetails className='my-4' message={message} />
      <Form className='mt-8' onSubmit={approveTransaction}>
        <TextField
          label='Wallet password'
          size='medium'
          type='password'
          fullWidth
          autoFocus
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <div className='flex mt-4 gap-4'>
          <Button size='large' variant='text' className='xs:w-2/5' color='warning' onClick={cancelRequest}>
            Cancel
          </Button>
          <Button size='large' className='w-full xs:w-3/5' disabled={!password || loading} type='submit'>
            Approve Transaction
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default RequestTransactionApproval;
