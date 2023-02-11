import { FC, FormEvent, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useUpdateEffect } from 'react-use';
import { KeyringPair } from '@polkadot/keyring/types';
import { keyring } from '@coong/base';
import { Add } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { Props } from 'types';

interface NewAccountButtonProps extends Props {
  onCreated?: (account: KeyringPair) => void;
}

const NewAccountButton: FC<NewAccountButtonProps> = ({ onCreated }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useUpdateEffect(() => {
    if (open) {
      const accountsIndex = keyring.getAccountsIndex();
      setName(`Account ${(accountsIndex + 1).toString().padStart(2, '0')}`);

      setTimeout(() => {
        inputRef.current?.select();
      }, 50);
    }
  }, [open]);

  const handleClose = () => setOpen(false);

  const doCreateNewAccount = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const newAccount = await keyring.createNewAccount(name, password);
      resetForm();

      onCreated && onCreated(newAccount);
      handleClose();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const resetForm = () => {
    setName('');
    setPassword('');
  };

  return (
    <>
      <Button size='small' variant='outlined' startIcon={<Add />} onClick={() => setOpen(true)}>
        New Account
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
        <DialogTitle>Create new account</DialogTitle>
        <Box component='form' autoComplete='off' onSubmit={doCreateNewAccount}>
          <DialogContent>
            <DialogContentText sx={{ marginBottom: '1rem' }}>Choose a name for your new account</DialogContentText>
            <TextField
              inputRef={inputRef}
              autoFocus
              label='New account name'
              type='text'
              required
              fullWidth
              onChange={(e) => setName(e.target.value)}
              value={name}
              className='mb-4'
              size='small'
            />
            <TextField
              autoFocus
              label='Wallet password'
              type='password'
              fullWidth
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              size='small'
            />
          </DialogContent>
          <DialogActions>
            <Button variant='outlined' onClick={handleClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={!name || !password}>
              Create
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default NewAccountButton;
