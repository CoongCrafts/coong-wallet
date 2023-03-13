import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, TextField } from '@mui/material';
import EmptySpace from 'components/shared/misc/EmptySpace';
import { setupWalletActions } from 'redux/slices/setup-wallet';
import { Props } from 'types';

const ChooseWalletPassword: FC<Props> = ({ className = '' }: Props) => {
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [validation, setValidation] = useState('');

  useEffect(() => {
    // TODO Add more strict password policy & password strength indicator
    if (password && password.length <= 5) {
      setValidation("Password's too short");
    } else {
      setValidation('');
    }
  }, [password]);

  const next = (e: FormEvent) => {
    e.preventDefault();
    if (!password) {
      return;
    }

    dispatch(setupWalletActions.setPassword(password));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <div className={className}>
      <h3>First, choose your wallet password</h3>
      <p className='mb-6'>
        Your password will be used to <b>encrypt accounts as well as unlock the wallet</b>, make sure to pick a{' '}
        <b>strong & easy-to-member</b> password.
      </p>

      <form className='flex flex-col gap-2' noValidate autoComplete='off' onSubmit={next}>
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
        <Button type='submit' fullWidth disabled={!password || !!validation} size='large'>
          Next
        </Button>
      </form>
    </div>
  );
};

export default ChooseWalletPassword;
