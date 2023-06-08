import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { CompactAccountInfo, DerivationPath, WalletBackup, WalletQrBackup } from '@coong/keyring/types';
import { Dialog, DialogContent, DialogContentText } from '@mui/material';
import DialogTitle from 'components/shared/DialogTitle';
import QrCode from 'components/shared/export/QrCode';
import VerifyingPasswordForm from 'components/shared/forms/VerifyingPasswordForm';
import useDialog from 'hooks/useDialog';
import useRegisterEvent from 'hooks/useRegisterEvent';
import { useWalletState } from 'providers/WalletStateProvider';
import { TransferableObject } from 'types';
import { EventName } from 'utils/eventemitter';

const toWalletQrBackup = (backup: WalletBackup): WalletQrBackup => {
  const { accounts, accountsIndex, encryptedMnemonic } = backup;

  return {
    accountsIndex,
    encryptedMnemonic,
    accounts: accounts
      // Due to the limited space capacity of the QR code content,
      // temporarily exporting external account is not possible
      .filter(({ meta }) => !meta.isExternal as boolean)
      .map(({ meta }) => [meta.derivationPath as DerivationPath, meta.name!] as CompactAccountInfo),
  };
};

export default function ExportWalletDialog(): JSX.Element {
  const { t } = useTranslation();
  const { open, doOpen, doClose } = useDialog();
  const { keyring } = useWalletState();
  const [backup, setBackup] = useState<WalletQrBackup>();

  const onPasswordVerified = async (password: string) => {
    try {
      const backup = toWalletQrBackup(await keyring.exportWallet(password));
      setBackup(backup);
    } catch (e: any) {
      toast.error(t<string>(e.message));
    }
  };

  useRegisterEvent(EventName.OpenExportWalletDialog, doOpen);

  const onClose = () => {
    doClose(() => setBackup(undefined));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle onClose={onClose}>{t<string>('Export Wallet')}</DialogTitle>
      <DialogContent>
        {backup ? (
          <div className='my-4'>
            <QrCode value={backup} object={TransferableObject.Wallet} />
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
