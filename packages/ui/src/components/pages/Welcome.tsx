import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '@mui/material';
import { Props } from 'types';

interface WelcomeProps extends Props {
  onCreateNewWallet?: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ className = '', onCreateNewWallet }) => {
  const navigate = useNavigate();

  const doCreateNewWallet = () => {
    onCreateNewWallet ? onCreateNewWallet() : navigate('/new-wallet');
  };

  const doRestoreWallet = () => {
    toast.info('Coming soon!');
  };

  return (
    <div className={`${className} mt-8 mb-16 mx-auto text-center`}>
      <div className='welcome'>
        <h1>Welcome to Coong</h1>
        <p className='text-2xl'>
          A multi-chain crypto wallet
          <br />
          for <strong>Polkadot & Kusama</strong> ecosystem
        </p>
      </div>
      <div className='mt-8'>
        <h4 className='mb-4'>Set up your Coong Wallet now</h4>

        <div className='flex flex-col gap-4 items-center'>
          <Button size='large' className='min-w-[270px]' onClick={doCreateNewWallet}>
            Create New Wallet
          </Button>
          <Button size='large' className='min-w-[270px]' variant='outlined' onClick={doRestoreWallet} disabled={true}>
            <span className='whitespace-nowrap pr-1'>Restore Existing Wallet</span>{' '}
            <small className='whitespace-nowrap'>(Coming soon)</small>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
