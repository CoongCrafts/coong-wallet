import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useEffectOnce } from 'react-use';
import { WalletBackup } from '@coong/keyring/types';
import { Dialog, DialogContent, DialogContentText } from '@mui/material';
import DialogTitle from 'components/shared/DialogTitle';
import VerifyingPasswordForm from 'components/shared/forms/VerifyingPasswordForm';
import QrCode from 'components/shared/menu/ExportWalletDialog/QrCode';
import useDialog from 'hooks/useDialog';
import { useWalletState } from 'providers/WalletStateProvider';
import { EventName, EventRegistry } from 'utils/eventemitter';

export default function ExportWalletDialog(): JSX.Element {
  const { t } = useTranslation();
  const { open, doOpen, doClose } = useDialog();
  const { keyring } = useWalletState();
  const [backup, setBackup] = useState<WalletBackup>();

  const onPasswordVerified = async (password: string) => {
    try {
      const backup = await keyring.exportWallet(password);
      setBackup(backup);
    } catch (e: any) {
      toast.error(t<string>(e.message));
    }
  };

  useEffectOnce(() => {
    EventRegistry.on(EventName.OpenExportWalletDialog, doOpen);

    return () => {
      EventRegistry.off(EventName.OpenExportWalletDialog, doOpen);
    };
  });

  const onClose = () => {
    doClose(() => setBackup(undefined));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle onClose={onClose}>{t<string>('Export Wallet')}</DialogTitle>
      <DialogContent className='pb-8'>
        {backup ? (
          <div className='my-4'>
            <QrCode walletBackup={backup} />
          </div>
        ) : (
          <>
            <DialogContentText className='mb-2'>
              {t<string>('Transfer your wallet to a different device via QR code.')}
            </DialogContentText>
            <VerifyingPasswordForm onBack={onClose} onPasswordVerified={onPasswordVerified} backButtonLabel='Cancel' />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
