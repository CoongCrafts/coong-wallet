import React from 'react';
import { useTranslation } from 'react-i18next';
import { AccountBackup } from '@coong/keyring/types';
import { Download } from '@mui/icons-material';
import { Button } from '@mui/material';
import FileSaver from 'file-saver';
import { ExportObject, Props } from 'types';

interface JsonProps extends Props {
  value: AccountBackup;
  object: ExportObject;
}

export default function Json({ value, object }: JsonProps): JSX.Element {
  const { t } = useTranslation();

  const downloadJsonFile = () => {
    const blob = new Blob([JSON.stringify(value, null, 2)], { type: 'text/plain;charset=utf-8' });
    FileSaver.saveAs(blob, `coongwallet_${object.toLowerCase()}_backup_json_${Date.now()}.json`);
  };

  return (
    <div className='text-center'>
      <p className='mt-4 sm:px-20'>
        {t<string>(
          `Export this {{object}} to a JSON file and import it back to Coong Wallet on this or other devices later`,
          { object: object.toLowerCase() },
        )}
      </p>
      <Button onClick={downloadJsonFile} startIcon={<Download />}>
        {t<string>('Download JSON File')}
      </Button>
      <p className='mt-4 italic sm:px-20 text-sm'>
        {t<string>(`You will be prompted to enter your wallet password to complete importing the {{object}}`, {
          object: object.toLowerCase(),
        })}
      </p>
    </div>
  );
}
