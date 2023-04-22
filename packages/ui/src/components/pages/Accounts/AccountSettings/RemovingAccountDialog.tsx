import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Button, Dialog, DialogContent, DialogContentText } from '@mui/material';
import DialogTitle from 'components/shared/DialogTitle';
import { useWalletState } from 'providers/WalletStateProvider';
import { AccountInfoExt, Props } from 'types';

interface RemovingAccountDialogProps extends Props {
  account: AccountInfoExt;
  open: boolean;
  onClose: () => void;
}

const RemovingAccountDialog: FC<RemovingAccountDialogProps> = ({ account, open, onClose }) => {
  const { t } = useTranslation();
  const { keyring } = useWalletState();
  const { address, name } = account;
  const removeAccount = async () => {
    try {
      await keyring.removeAccount(address);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <Dialog open={open}>
      <DialogTitle onClose={onClose}>{`${t<string>('Remove account')}: ${name}`}</DialogTitle>
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
};

export default RemovingAccountDialog;
