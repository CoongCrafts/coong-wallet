import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '@mui/material';
import { Props } from 'types';

const Welcome: React.FC<Props> = ({ className = '' }: Props) => {
  const navigate = useNavigate();

  const doCreateNewWallet = () => {
    navigate('/new-wallet');
  };

  const doRestoreWallet = () => {
    toast.info('Coming soon!');
  };

  return (
    <div className={`${className} my-16 mx-auto text-center`}>
      <div className='welcome'>
        <h2>Welcome to Coong</h2>
        <p>
          A multichain crypto wallet
          <br />
          for <strong>Polkadot & Kusama</strong> ecosystem
        </p>
      </div>
      <div className='mt-8'>
        <h5 className='mb-4'>Set up your Coong wallet now</h5>

        <div className='flex flex-col gap-4 items-center'>
          <Button size='large' className='min-w-[270px]' onClick={doCreateNewWallet}>
            Create new wallet
          </Button>
          <Button size='large' className='min-w-[270px]' variant='outlined' onClick={doRestoreWallet} disabled={true}>
            Restore existing wallet
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
