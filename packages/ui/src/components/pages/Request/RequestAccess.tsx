import { FC } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { state } from '@coong/base';
import { RequestAppRequestAccess, RequestMessage, RequestName } from '@coong/base/types';
import { Button, styled } from '@mui/material';
import { RootState } from 'redux/store';
import { Props } from 'types';

interface RequestAccessProps extends Props {
  message: RequestMessage<RequestName>;
}

const RequestAccess: FC<RequestAccessProps> = ({ className = '', message }) => {
  const { seedReady } = useSelector((state: RootState) => state.app);

  const acceptAccess = async () => {
    try {
      state.approveRequestAccess([]);
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

  return (
    <div className={className}>
      <h2 className='text-center'>Wallet Access Request</h2>
      <p className='text-center'>
        An application, self-identifying as <b>{requestBody.appName}</b> is requesting access your wallet from{' '}
        <b>{origin}</b>.
      </p>

      {seedReady ? (
        <div>
          <p>Only connect if you trust the application</p>
          <div className='button-groups'>
            <Button variant='outlined' color='warning' onClick={rejectAccess}>
              Cancel
            </Button>
            <Button onClick={acceptAccess}>Connect</Button>
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
    text-align: center;

    button + button {
      margin-left: 0.5rem;
      width: 170px;
    }
  }
`;
