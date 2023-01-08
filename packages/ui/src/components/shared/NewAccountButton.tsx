import { ChangeEvent, FC, FormEvent, useRef, useState } from 'react';
import { Props } from 'types';
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
import { useUpdateEffect } from 'react-use';
import { keyring } from '@coong/base';
import { toast } from 'react-toastify';
import { KeyringPair } from '@polkadot/keyring/types';

interface NewAccountButtonProps extends Props {
  onCreated?: (account: KeyringPair) => void;
}

const NewAccountButton: FC<NewAccountButtonProps> = ({ onCreated }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const doCreateNewAccount = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const newAccount = await keyring.createNewAccount(name);
      onCreated && onCreated(newAccount);
      handleClose();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <Button size='small' variant='outlined' startIcon={<Add />} onClick={() => setOpen(true)}>
        New Account
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
        <DialogTitle>Create new account</DialogTitle>
        <Box component='form' noValidate autoComplete='off' onSubmit={doCreateNewAccount}>
          <DialogContent>
            <DialogContentText sx={{ marginBottom: '1rem' }}>Choose a name for your new account</DialogContentText>
            <TextField
              inputRef={inputRef}
              autoFocus
              label='New account name'
              type='text'
              fullWidth
              onChange={handleChange}
              value={name}
            />
          </DialogContent>
          <DialogActions>
            <Button variant='outlined' onClick={handleClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={!name}>
              Create
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
};

export default NewAccountButton;
