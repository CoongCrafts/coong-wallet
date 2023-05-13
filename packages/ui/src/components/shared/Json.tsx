import React from 'react';
import { useTranslation } from 'react-i18next';
import { AccountBackup } from '@coong/keyring/types';
import { Download } from '@mui/icons-material';
import { Button } from '@mui/material';
import FileSaver from 'file-saver';
import { Props } from '../../types';

interface JsonProps extends Props {
  value: AccountBackup;
}

export default function Json({ value }: JsonProps): JSX.Element {
  const { t } = useTranslation();

  const downloadJsonFile = () => {
    const blob = new Blob([JSON.stringify(value)], { type: 'text/plain;charset=utf-8' });
    FileSaver.saveAs(blob, `coongwallet_account_backup_json_${Date.now()}.json`);
  };

  return (
    <div className='text-center'>
      <p className='mt-4 sm:px-20'>
        {t<string>(
          'Open Coong Wallet on another device and choose import account with JSON file to transfer your account',
        )}
      </p>
      <Button onClick={downloadJsonFile} startIcon={<Download />}>
        {t<string>('Download JSON file')}
      </Button>
      <p className='mt-4 italic sm:px-20 text-sm'>
        {t<string>(
          'You will be prompted to enter your wallet password to complete the transfer process on the other device.',
        )}
      </p>
    </div>
  );
}
