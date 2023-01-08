import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import { Props } from 'types';
import { useDispatch } from 'react-redux';
import { Box, Button, styled, TextField } from '@mui/material';
import keyring from '@coong/base/keyring';
import { appActions } from 'redux/slices/app';

const UnlockWallet: FC<Props> = ({ className = '' }) => {
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [validation, setValidation] = useState('');

  useEffect(() => {
    setValidation('');
  }, [password]);

  const doUnlock = async (e: FormEvent) => {
    e.preventDefault();
    if (!password) {
      return;
    }

    try {
      await keyring.unlock(password);
      dispatch(appActions.setLockStatus(keyring.locked()));
    } catch (e: any) {
      setValidation(e.message);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <div className={className}>
      <h5>Welcome back</h5>
      <h2>Unlock your Coong wallet</h2>
      <Box component='form' noValidate autoComplete='off' onSubmit={doUnlock}>
        <TextField
          label='Wallet Password'
          fullWidth
          autoFocus
          type='password'
          onChange={handleChange}
          value={password}
          error={!!validation}
          helperText={validation}
        />
        <Button type='submit' fullWidth disabled={!password}>
          Unlock
        </Button>
      </Box>
    </div>
  );
};

export default styled(UnlockWallet)`
  max-width: 450px;
  margin: 4rem auto;

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .form-actions {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }

  h2 {
    margin-top: 0;
  }

  h5 {
    margin-bottom: 0.5rem;
  }
`;
