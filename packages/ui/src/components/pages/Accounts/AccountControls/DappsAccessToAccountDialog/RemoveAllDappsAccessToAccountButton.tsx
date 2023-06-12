import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Button, Dialog, DialogContent, DialogContentText } from '@mui/material';
import DialogTitle from 'components/shared/DialogTitle';
import useDialog from 'hooks/useDialog';
import { useWalletState } from 'providers/WalletStateProvider';
import { AccountInfoExt } from 'types';

interface RemoveAllDappsAccessToAccountButtonProps {
  account: AccountInfoExt;
  disabled?: boolean;
}

export default function RemoveAllDappsAccessToAccountButton({
  account,
  disabled,
}: RemoveAllDappsAccessToAccountButtonProps) {
  const { t } = useTranslation();
  const { walletState } = useWalletState();
  const { open, doClose, doOpen } = useDialog();

  if (!account) {
    return <></>;
  }

  const { name, address } = account;

  const removeAccess = () => {
    walletState.removeAllAccessToAccount(address);
    toast.dismiss();
    toast.success(
      t<string>('All access to account {{name}} has been removed', { name, interpolation: { escapeValue: false } }),
    );

    onClose();
  };

  const onClose = () => doClose();

  return (
    <>
      <Button size='small' variant='outlined' color='error' onClick={doOpen} disabled={disabled}>
        {t<string>('Remove All')}
      </Button>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle onClose={onClose}>
          {t<string>('Remove All Dapps Access To')}: {name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Trans values={{ name }} shouldUnescape>
              {'Are you sure to remove all dapps access to account: {{name}}?'}
            </Trans>
          </DialogContentText>
          <div className='flex gap-4 mt-8'>
            <Button onClick={onClose} variant='text'>
              {t<string>('Cancel')}
            </Button>
            <Button onClick={removeAccess} color='error' fullWidth>
              {t<string>('Remove All Access')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
