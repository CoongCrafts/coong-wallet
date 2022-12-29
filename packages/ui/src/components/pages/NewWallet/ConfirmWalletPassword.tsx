import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import { Props } from 'types';
import { Box, Button, TextField } from '@mui/material';
import { setupWalletActions } from 'redux/slices/setup-wallet';
import { NewWalletScreenStep } from 'components/pages/NewWallet/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';

const ConfirmWalletPassword: FC<Props> = ({ className = '' }: Props) => {
  const dispatch = useDispatch();
  const { password } = useSelector((state: RootState) => state.setupWallet);
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [notMatch, setNotMatch] = useState<boolean>(true);

  useEffect(() => {
    setNotMatch(password !== passwordConfirmation);
  }, [passwordConfirmation]);

  const next = (e: FormEvent) => {
    e.preventDefault();

    if (notMatch) {
      return;
    }

    dispatch(setupWalletActions.setStep(NewWalletScreenStep.BackupSecretRecoveryPhrase));
  };

  const back = () => {
    dispatch(setupWalletActions.setStep(NewWalletScreenStep.ChooseWalletPassword));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirmation(event.target.value);
  };

  return (
    <div className={className}>
      <h3>Next, confirm your wallet password</h3>
      <Box component='form' noValidate autoComplete='off' onSubmit={next}>
        <TextField
          label='Confirm Wallet Password'
          fullWidth
          autoFocus
          type='password'
          onChange={handleChange}
          value={passwordConfirmation}
          error={!!passwordConfirmation && notMatch}
          helperText={!!passwordConfirmation && notMatch && "Password's not match"}
        />
        <div className='form-actions'>
          <Button variant='text' onClick={back}>
            Back
          </Button>
          <Button type='submit' fullWidth disabled={notMatch}>
            Next
          </Button>
        </div>
      </Box>
    </div>
  );
};

export default ConfirmWalletPassword;
