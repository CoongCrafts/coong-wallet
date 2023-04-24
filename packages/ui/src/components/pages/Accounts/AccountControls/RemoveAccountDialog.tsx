import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useEffectOnce } from 'react-use';
import { Button, Dialog, DialogContent, DialogContentText } from '@mui/material';
import DialogTitle from 'components/shared/DialogTitle';
import useDialog from 'hooks/useDialog';
import { useWalletState } from 'providers/WalletStateProvider';
import { AccountInfoExt, Props } from 'types';
import { EventName, EventRegistry } from 'utils/eventemitter';

export default function RemoveAccountDialog({}: Props): JSX.Element {
  const { open, doOpen, doClose } = useDialog();
  const { t } = useTranslation();
  const { keyring } = useWalletState();
  const [account, setAccount] = useState<AccountInfoExt>();

  const onClose = () => {
    doClose(() => setAccount(undefined));
  };

  const removeAccount = async () => {
    onClose();
    try {
      await keyring.removeAccount(account!.address);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const emitted = (account: AccountInfoExt) => {
    doOpen();
    setAccount(account);
  };

  useEffectOnce(() => {
    EventRegistry.on(EventName.OPEN_REMOVE_ACCOUNT_DIALOG, emitted);

    return () => {
      EventRegistry.off(EventName.OPEN_REMOVE_ACCOUNT_DIALOG, emitted);
    };
  });

  return (
    <Dialog open={open}>
      {account && <DialogTitle onClose={onClose}>{`${t<string>('Remove account')}: ${account.name}`}</DialogTitle>}
      <DialogContent className='pb-8'>
        <DialogContentText className='text-red-500'>
          {t<string>('Are you sure to remove this account?')}
        </DialogContentText>
        <DialogContentText className='mt-2 italic'>
          {t<string>('Make sure you backed up your recovery phrase or private key before continuing.')}
        </DialogContentText>
        <div className='flex justify-end gap-4 mt-8'>
          <Button onClick={onClose} variant='text'>
            {t<string>('Cancel')}
          </Button>
          <Button onClick={removeAccount} color='error'>
            {t<string>('Remove this account')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
