import React from 'react';
import { useTranslation } from 'react-i18next';
import { AccountBackup, JsonBackup } from '@coong/keyring/types';
import { Download } from '@mui/icons-material';
import { Button } from '@mui/material';
import FileSaver from 'file-saver';
import { TransferableObject, Props } from 'types';

interface JsonFileProps extends Props {
  value: JsonBackup;
  object: TransferableObject;
  title?: string;
  topInstruction?: React.ReactNode;
  bottomInstruction?: React.ReactNode;
}

export default function JsonFile({
  value,
  object,
  topInstruction,
  bottomInstruction,
  title = '',
}: JsonFileProps): JSX.Element {
  const { t } = useTranslation();

  const getFileName = () => {
    if (object === TransferableObject.Wallet) {
      return `coongwallet_wallet_backup_${Date.now()}.json`;
    } else if (object === TransferableObject.Account) {
      const accountName = (((value as AccountBackup)?.meta?.name as string) || '').toLowerCase().replace(/\s/g, '_');
      return `coongwallet_account_backup_${accountName}_${Date.now()}.json`;
    }
  };

  const downloadJsonFile = () => {
    const blob = new Blob([JSON.stringify(value, null, 2)], { type: 'application/json;charset=utf-8' });
    FileSaver.saveAs(blob, getFileName());
  };

  return (
    <>
      <h3>{t<string>(title)}</h3>
      {topInstruction || (
        <p className='mt-4 sm:px-20 text-center'>
          {t<string>(
            `Export this {{object}} to a JSON file and import it back to Coong Wallet on this or other devices later`,
            { object: t<string>(object.toLowerCase()) },
          )}
        </p>
      )}
      <div className='text-center'>
        <Button onClick={downloadJsonFile} startIcon={<Download />}>
          {t<string>('Download JSON File')}
        </Button>
      </div>
      {bottomInstruction || (
        <p className='mt-4 italic sm:px-20 text-sm text-center'>
          {t<string>(`You will be prompted to enter your wallet password to complete importing the {{object}}`, {
            object: t<string>(object.toLowerCase()),
          })}
        </p>
      )}
    </>
  );
}
