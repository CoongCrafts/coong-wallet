import { FC } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { state } from '@coong/base';
import { RequestAppRequestAccess, WalletRequestWithResolver } from '@coong/base/types';
import { Button, styled } from '@mui/material';
import AccountsSelection from 'components/pages/Request/RequestAccess/AccountsSelection';
import { RootState } from 'redux/store';
import { Props } from 'types';

interface RequestAccessProps extends Props {
  message: WalletRequestWithResolver;
}

const RequestAccess: FC<RequestAccessProps> = ({ className = '', message }) => {
  const {
    app: { seedReady },
    accounts: { selectedAccounts },
  } = useSelector((state: RootState) => state);
  const acceptAccess = async () => {
    try {
      state.approveRequestAccess(selectedAccounts.map((one) => one.address));
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const rejectAccess = () => {
    state.rejectRequestAccess();
  };

  const setupWallet = () => {
    console.log('Trigger setup wallet flow!');
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
          <h3>Select the accounts you'd like to connect</h3>

          <AccountsSelection />

          <div className='actions'>
            <p>Only connect if you trust the application</p>
            <div className='button-groups'>
              <Button size='large' variant='text' color='warning' onClick={rejectAccess}>
                Cancel
              </Button>
              <Button size='large' fullWidth onClick={acceptAccess}>
                Connect
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className='text-center'>
          <h4>Setup your Coong wallet now to connect</h4>
          <div className='button-groups'>
            <Button variant='outlined' color='warning' onClick={rejectAccess}>
              Cancel
            </Button>
            <Button onClick={setupWallet}>Setup wallet</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default styled(RequestAccess)`
  .text-center {
    text-align: center;
  }

  .button-groups {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }
`;
