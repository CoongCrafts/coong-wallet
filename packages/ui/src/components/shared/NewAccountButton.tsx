import { FC, FormEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useUpdateEffect } from 'react-use';
import { AccountInfo } from '@coong/keyring/types';
import { Add } from '@mui/icons-material';
import { Box, Button, Dialog, DialogContent, DialogContentText, IconButton, TextField } from '@mui/material';
import DialogTitle from 'components/shared/DialogTitle';
import useDialog from 'hooks/useDialog';
import { useWalletState } from 'providers/WalletStateProvider';
import { Props } from 'types';

interface NewAccountButtonProps extends Props {
  onCreated?: (account: AccountInfo) => void;
}

const NewAccountButton: FC<NewAccountButtonProps> = ({ onCreated }) => {
  const { keyring } = useWalletState();
  const { open, doOpen, doClose } = useDialog();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  useUpdateEffect(() => {
    if (open) {
      const accountsIndex = keyring.getAccountsIndex();
      setName(`Account ${(accountsIndex + 1).toString().padStart(2, '0')}`);

      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 50);
    }
  }, [open]);

  const handleClose = () => doClose();

  const doCreateNewAccount = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const newAccount = await keyring.createNewAccount(name, password);
      resetForm();

      onCreated && onCreated(newAccount);
      doClose();
    } catch (e: any) {
      toast.error(t<string>(e.message));
    }
  };

  const resetForm = () => {
    setName('');
    setPassword('');
  };

  return (
    <>
      <Button
        className='max-xs:hidden new-account-btn'
        size='small'
        variant='outlined'
        startIcon={<Add />}
        onClick={doOpen}>
        {t<string>('New Account')}
      </Button>
      <IconButton color='primary' className='xs:hidden' onClick={doOpen}>
        <Add />
      </IconButton>
      <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
        <DialogTitle onClose={handleClose}>{t<string>('Create new account')}</DialogTitle>
        <DialogContent className='pb-8'>
          <DialogContentText className='mb-4'>
            {t<string>('Choose a name and enter your password to create a new account')}
          </DialogContentText>
          <Box className='flex flex-col gap-8' component='form' autoComplete='off' onSubmit={doCreateNewAccount}>
            <TextField
              label={t<string>('New account name')}
              type='text'
              required
              fullWidth
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <TextField
              inputRef={passwordInputRef}
              autoFocus
              label={t<string>('Wallet password')}
              type='password'
              fullWidth
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <div className='flex gap-4'>
              <Button variant='text' onClick={handleClose}>
                {t<string>('Cancel')}
              </Button>
              <Button type='submit' fullWidth disabled={!name || !password}>
                {t<string>('Create')}
              </Button>
            </div>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewAccountButton;
