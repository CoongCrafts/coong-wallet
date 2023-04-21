import React, { FC } from 'react';
import { toast } from 'react-toastify';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Button, Dialog, DialogContent, DialogContentText } from '@mui/material';
import DialogTitle from 'components/shared/DialogTitle';
import { useWalletState } from 'providers/WalletStateProvider';
import { AccountInfoExt, Props } from 'types';

interface RemovingAccountProps extends Props {
  account: AccountInfoExt;
  open: boolean;
  onClose: () => void;
}

const RemovingAccount: FC<RemovingAccountProps> = ({ account, open, onClose }) => {
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
      <DialogTitle onClose={onClose}>{`Remove account: ${name}`}</DialogTitle>
      <DialogContent className='flex flex-col gap-4'>
        <DialogContentText className='text-red-500'>
          <WarningAmberIcon className='align-sub mr-2' />
          <span>Are you sure to remove this account?</span>
        </DialogContentText>
        <DialogContentText className='italic'>
          Make sure you backed up your recovery phrase or private key before continuing.
        </DialogContentText>
        <div className='flex justify-end gap-4'>
          <Button onClick={onClose} variant='text'>
            Cancel
          </Button>
          <Button onClick={removeAccount} color='error' variant='contained'>
            Remove this account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RemovingAccount;
