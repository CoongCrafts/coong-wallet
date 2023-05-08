import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useEffectOnce } from 'react-use';
import { Button, Dialog, DialogContent, DialogContentText } from '@mui/material';
import DialogTitle from 'components/shared/DialogTitle';
import useDialog from 'hooks/useDialog';
import { useWalletState } from 'providers/WalletStateProvider';
import { AccountInfoExt } from 'types';
import { EventName, EventRegistry } from 'utils/eventemitter';

export default function RemoveAccountDialog(): JSX.Element {
  const { open, doOpen, doClose } = useDialog();
  const { t } = useTranslation();
  const { keyring } = useWalletState();
  const [account, setAccount] = useState<AccountInfoExt>();

  const onClose = () => {
    doClose(() => setAccount(undefined));
  };

  const removeAccount = async () => {
    try {
      await keyring.removeAccount(account!.address);
      onClose();
      toast.success(t<string>('{{account.name}} removed', { account }));
    } catch (e: any) {
      toast.error(t<string>(e.message));
    }
  };

  const onOpen = (account: AccountInfoExt) => {
    setAccount(account);
    doOpen();
  };

  useEffectOnce(() => {
    EventRegistry.on(EventName.OpenRemoveAccountDialog, onOpen);

    return () => {
      EventRegistry.off(EventName.OpenRemoveAccountDialog, onOpen);
    };
  });

  if (!account) return <></>;

  return (
    <Dialog open={open} onClose={onClose}>
      {account && <DialogTitle onClose={onClose}>{`${t<string>('Remove account')}: ${account.name}`}</DialogTitle>}
      <DialogContent>
        <DialogContentText className='text-red-500'>
          {t<string>('Are you sure to remove this account?')}
        </DialogContentText>
        <DialogContentText className='mt-2 italic'>
          {t<string>('Make sure you backed up your recovery phrase or private key before continuing.')}
        </DialogContentText>
        <div className='flex gap-4 mt-8'>
          <Button onClick={onClose} variant='text'>
            {t<string>('Cancel')}
          </Button>
          <Button onClick={removeAccount} color='error' fullWidth>
            {t<string>('Remove this account')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
