import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dialog, DialogContent, DialogContentText } from '@mui/material';
import DialogTitle from 'components/shared/DialogTitle';
import useAuthorizedApps from 'components/shared/settings/ManageDappAccessDialog/useAuthorizedApps';
import useDialog from 'hooks/useDialog';
import { useWalletState } from 'providers/WalletStateProvider';

export default function RemoveAllAccessButton() {
  const { t } = useTranslation();
  const { walletState } = useWalletState();
  const authorizedApps = useAuthorizedApps();
  const { open, doClose, doOpen } = useDialog();

  const removeAllAccess = () => {
    walletState.removeAllAuthorizedApps();
    doClose();
  };

  const onClose = () => {
    doClose();
  };

  return (
    <>
      <Button size='small' color='error' variant='outlined' onClick={doOpen} disabled={authorizedApps.length === 0}>
        {t<string>('Remove All')}
      </Button>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle onClose={onClose}>{t<string>('Remove All Dapps Access')}</DialogTitle>
        <DialogContent className='pb-8'>
          <DialogContentText>{t<string>('Are you sure to remove all dapps access to your wallet?')}</DialogContentText>
          <DialogContentText className='font-semibold'>{t<string>('This cannot be undone!')}</DialogContentText>
          <div className='flex gap-4 mt-8'>
            <Button onClick={onClose} variant='text'>
              {t<string>('Cancel')}
            </Button>
            <Button onClick={removeAllAccess} color='error' fullWidth>
              {t<string>('Remove All Access')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
