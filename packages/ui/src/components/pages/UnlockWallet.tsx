import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, TextField } from '@mui/material';
import EmptySpace from 'components/shared/misc/EmptySpace';
import { useWalletState } from 'providers/WalletStateProvider';
import { appActions } from 'redux/slices/app';
import { Props } from 'types';

const UnlockWallet: FC<Props> = ({ className = '' }) => {
  const { keyring } = useWalletState();
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
      await keyring.verifyPassword(password);
      dispatch(appActions.unlock());
    } catch (e: any) {
      setValidation(e.message);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <div className={`${className} max-w-[450px] my-16 mx-auto`}>
      <h6>Welcome back</h6>
      <h2 className='mb-6'>Unlock your wallet</h2>
      <form className='flex flex-col gap-2' noValidate autoComplete='off' onSubmit={doUnlock}>
        <TextField
          label='Wallet password'
          fullWidth
          autoFocus
          type='password'
          onChange={handleChange}
          value={password}
          error={!!validation}
          helperText={validation || <EmptySpace />}
        />
        <Button type='submit' fullWidth disabled={!password} size='large'>
          Unlock
        </Button>
      </form>
    </div>
  );
};

export default UnlockWallet;
