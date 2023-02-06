import { FC, useState } from 'react';
import { Form } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SignerPayloadJSON } from '@polkadot/types/types';
import { keyring, state } from '@coong/base';
import { Button, TextField } from '@mui/material';
import AccountCard from 'components/pages/Accounts/AccountCard';
import RequestDetails from 'components/pages/Request/RequestTransactionApproval/RequestDetails';
import { RequestProps } from 'components/pages/Request/types';

const RequestTransactionApproval: FC<RequestProps> = ({ className, message }) => {
  const [password, setPassword] = useState<string>('');
  const { request } = message;

  const payloadJSON = request.body as SignerPayloadJSON;
  const targetAccount = keyring.getAccount(payloadJSON.address);

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
      <AccountCard account={targetAccount} />
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
          <Button size='large' variant='text' color='warning' onClick={cancelRequest}>
            Cancel
          </Button>
          <Button size='large' fullWidth disabled={!password} type='submit'>
            Approve Transaction
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default RequestTransactionApproval;
