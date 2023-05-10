import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useEffectOnce } from 'react-use';
import { AccountQrBackup } from '@coong/keyring/types';
import { Dialog, DialogContent } from '@mui/material';
import DialogTitle from 'components/shared/DialogTitle';
import QrCode from 'components/shared/QrCode';
import VerifyingPasswordForm from 'components/shared/forms/VerifyingPasswordForm';
import useDialog from 'hooks/useDialog';
import { useWalletState } from 'providers/WalletStateProvider';
import { AccountInfoExt, ExportObject } from 'types';
import { EventName, EventRegistry } from 'utils/eventemitter';

function ExportAccountDialog(): JSX.Element {
  const { t } = useTranslation();
  const { keyring } = useWalletState();
  const { open, doOpen, doClose } = useDialog();
  const [account, setAccount] = useState<AccountInfoExt>();
  const [backup, setBackup] = useState<AccountQrBackup>();

  const onOpen = (account: AccountInfoExt) => {
    setAccount(account);
    doOpen();
  };

  useEffectOnce(() => {
    EventRegistry.on(EventName.OpenExportAccountDialog, onOpen);
    return () => {
      EventRegistry.off(EventName.OpenExportAccountDialog, onOpen);
    };
  });

  const onClose = () => {
    doClose(() => {
      setAccount(undefined);
      setBackup(undefined);
    });
  };

  const onPasswordVerified = async (password: string) => {
    try {
      const backup = await keyring.exportAccount(password, account!.address);
      setBackup(backup);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (!account) return <></>;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle onClose={onClose}>{`${t<string>('Export account')}: ${account.name ?? ''}`}</DialogTitle>
      <DialogContent>
        {backup ? (
          <QrCode value={backup} object={ExportObject.Account} />
        ) : (
          <VerifyingPasswordForm onPasswordVerified={onPasswordVerified} onBack={onClose} backButtonLabel='Cancel' />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ExportAccountDialog;
