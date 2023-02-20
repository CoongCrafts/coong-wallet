import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { Form } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SignerPayloadJSON } from '@polkadot/types/types';
import { encodeAddress } from '@polkadot/util-crypto';
import { keyring, state } from '@coong/base';
import { Button, TextField } from '@mui/material';
import AccountCard from 'components/pages/Accounts/AccountCard';
import RequestDetails from 'components/pages/Request/RequestTransactionApproval/RequestDetails';
import { RequestProps } from 'components/pages/Request/types';
import { RootState } from 'redux/store';

const RequestTransactionApproval: FC<RequestProps> = ({ className, message }) => {
  const { addressPrefix } = useSelector((state: RootState) => state.app);
  const [password, setPassword] = useState<string>('');
  const { request } = message;

  const payloadJSON = request.body as SignerPayloadJSON;
  const targetAccount = keyring.getAccount(payloadJSON.address);
  const currentNetworkAddress = encodeAddress(targetAccount.address, addressPrefix);

  const approveTransaction = async () => {
    try {
      await state.approveSignExtrinsic(password);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const cancelRequest = () => {
    state.cancelSignExtrinsic();
  };

  return (
    <div className={className}>
      <h2 className='text-center'>Transaction Approval Request</h2>
      <p className='mb-2'>You are approving a transaction with account</p>
      <AccountCard account={{ ...targetAccount, networkAddress: currentNetworkAddress }} />
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
        <div className='flex mt-4 flex-col-reverse sm:flex-row gap-x-4 gap-y-2'>
          <Button size='large' variant='text' className='w-full sm:w-2/5' color='warning' onClick={cancelRequest}>
            Cancel
          </Button>
          <Button size='large' className='w-full sm:w-3/5' disabled={!password} type='submit'>
            Approve Transaction
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default RequestTransactionApproval;
