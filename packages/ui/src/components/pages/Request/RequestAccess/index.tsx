import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RequestAppRequestAccess } from '@coong/base/types';
import { Button } from '@mui/material';
import AccountsSelection from 'components/pages/Request/RequestAccess/AccountsSelection';
import SetupWalletButton from 'components/pages/Request/RequestAccess/SetupWalletButton';
import { RequestProps } from 'components/pages/Request/types';
import { useWalletState } from 'contexts/WalletStateContext';
import { RootState } from 'redux/store';

const RequestAccess: FC<RequestProps> = ({ className = '', message }) => {
  const { walletState } = useWalletState();
  const {
    app: { seedReady },
    accounts: { selectedAccounts },
  } = useSelector((state: RootState) => state);
  const acceptAccess = async () => {
    try {
      walletState.approveRequestAccess(selectedAccounts.map((one) => one.address));
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const rejectAccess = () => {
    walletState.rejectRequestAccess();
  };

  const { origin, request } = message;

  const requestBody = request.body as RequestAppRequestAccess;

  // TODO: Optimize create new account behavior
  return (
    <div className={className}>
      <h2 className='text-center'>Wallet Access Request</h2>
      <p className='text-center'>
        An application, self-identifying as <b>{requestBody.appName}</b> is requesting access your wallet from{' '}
        <b>{origin}</b>.
      </p>

      {seedReady ? (
        <div>
          <h6>Select the accounts you'd like to connect</h6>
          <AccountsSelection />

          <div>
            <p className='font-semibold mb-2'>Only connect if you trust the application</p>
            <div className='flex gap-4'>
              <Button size='large' variant='text' className='xs:w-2/5' color='warning' onClick={rejectAccess}>
                Cancel
              </Button>
              <Button size='large' className='w-full xs:w-3/5' onClick={acceptAccess}>
                Connect
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h6 className='text-center mb-4'>Setup your Coong wallet now to connect</h6>
          <div className='flex gap-4'>
            <Button size='large' variant='text' className='xs:w-2/5' color='warning' onClick={rejectAccess}>
              Cancel
            </Button>
            <SetupWalletButton className='w-full xs:w-3/5' />
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestAccess;
