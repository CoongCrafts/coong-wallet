import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useEffectOnce } from 'react-use';
import { u8aToString } from '@polkadot/util';
import { base64Decode, isBase64 } from '@polkadot/util-crypto';
import { AccountBackup } from '@coong/keyring/types';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Dialog, DialogContent, Tab } from '@mui/material';
import DialogTitle from 'components/shared/DialogTitle';
import JsonFileReader from 'components/shared/import/JsonFileReader';
import QrCodeReader from 'components/shared/import/QrCodeReader';
import TransferAccountBackup from 'components/shared/menu/ImportAccountDialog/TransferAccountBackup';
import useDialog from 'hooks/useDialog';
import { EventName, EventRegistry } from 'utils/eventemitter';
import { AccountBackupScheme } from 'validations/AccountBackup';

enum ImportAccountMethod {
  QRCode = 'QR Code',
  JSON = 'JSON File',
}

function ImportAccountDialog(): JSX.Element {
  const { open, doOpen, doClose } = useDialog();
  const { t } = useTranslation();
  const [backup, setBackup] = useState<AccountBackup>();
  const [method, setMethod] = useState<ImportAccountMethod>(ImportAccountMethod.QRCode);

  useEffectOnce(() => {
    EventRegistry.on(EventName.OpenImportAccountDialog, doOpen);
    return () => {
      EventRegistry.off(EventName.OpenImportAccountDialog, doOpen);
    };
  });

  const onClose = () => {
    doClose(() => {
      setBackup(undefined);
      setMethod(ImportAccountMethod.QRCode);
    });
  };

  const resetBackup = () => {
    setBackup(undefined);
  };

  const switchMethod = (_: any, method: ImportAccountMethod) => {
    setMethod(method);
  };

  const onReadBackupCompleted = async (data: string) => {
    try {
      const decoded = isBase64(data) ? u8aToString(base64Decode(data)) : data;
      const parsedBackup = JSON.parse(decoded) as AccountBackup;
      Object.assign(parsedBackup, { meta: parsedBackup.meta || {} });
      await AccountBackupScheme.validate(parsedBackup);

      setBackup(parsedBackup);
    } catch (e: any) {
      toast.dismiss();
      toast.error(`Unknown/Invalid ${method}`);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle onClose={onClose}>{t<string>('Import Account')}</DialogTitle>
        <DialogContent>
          {backup ? (
            <TransferAccountBackup backup={backup} resetBackup={resetBackup} onClose={onClose} />
          ) : (
            <TabContext value={method}>
              <TabList onChange={switchMethod} variant='fullWidth'>
                <Tab label={t<string>(ImportAccountMethod.QRCode)} value={ImportAccountMethod.QRCode} />
                <Tab label={t<string>(ImportAccountMethod.JSON)} value={ImportAccountMethod.JSON} />
              </TabList>
              <TabPanel value={ImportAccountMethod.QRCode} className='p-0'>
                <QrCodeReader onResult={onReadBackupCompleted} />
              </TabPanel>
              <TabPanel value={ImportAccountMethod.JSON} className='p-0'>
                <JsonFileReader onResult={onReadBackupCompleted} />
              </TabPanel>
            </TabContext>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ImportAccountDialog;
