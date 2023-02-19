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
    <div className={`${className} mt-8 mb-16 mx-auto text-center`}>
      <div className='welcome'>
        <h1>Welcome to Coong</h1>
        <p className='text-2xl'>
          A multichain crypto wallet
          <br />
          for <strong>Polkadot & Kusama</strong> ecosystem
        </p>
      </div>
      <div className='mt-8'>
        <h4 className='mb-4'>Set up your Coong wallet now</h4>

        <div className='flex flex-col gap-4 items-center'>
          <Button size='large' className='min-w-[270px]' onClick={doCreateNewWallet}>
            Create new wallet
          </Button>
          <Button size='large' className='min-w-[270px]' variant='outlined' onClick={doRestoreWallet} disabled={true}>
            <span className='pr-1'>Restore existing wallet</span> <small>(Coming soon)</small>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
