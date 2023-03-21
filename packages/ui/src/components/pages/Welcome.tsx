import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '@mui/material';
import { Props } from 'types';

interface WelcomeProps extends Props {
  onCreateNewWallet?: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ className = '', onCreateNewWallet }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const doCreateNewWallet = () => {
    onCreateNewWallet ? onCreateNewWallet() : navigate('/new-wallet');
  };

  const doRestoreWallet = () => {
    toast.info('Coming soon!');
  };

  return (
    <div className={`${className} mt-8 mb-16 mx-auto text-center`}>
      <div className='welcome'>
        <h1>{t<string>('Welcome to Coong')}</h1>
        <p className='text-2xl'>
          <Trans>A multichain crypto wallet for Polkadot & Kusama ecosystem</Trans>
        </p>
      </div>
      <div className='mt-8'>
        <h4 className='mb-4'>{t<string>('Set up your Coong wallet now')}</h4>

        <div className='flex flex-col gap-4 items-center'>
          <Button size='large' className='min-w-[270px]' onClick={doCreateNewWallet}>
            {t<string>('Create new wallet')}
          </Button>
          <Button size='large' className='min-w-[270px]' variant='outlined' onClick={doRestoreWallet} disabled={true}>
            <span className='pr-1'>{t<string>('Restore existing wallet')}</span>{' '}
            <small>{t<string>('(Coming soon)')}</small>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
