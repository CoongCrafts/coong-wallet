import { ChangeEvent, FC, FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, DialogContentText, TextField } from '@mui/material';
import { useWalletState } from '../../../../providers/WalletStateProvider';
import { settingsDialogActions, SettingsDialogScreen } from '../../../../redux/slices/settings-dialog';
import { Props } from '../../../../types';
import EmptySpace from '../../misc/EmptySpace';

const VerifyingPassword: FC<Props> = () => {
  const { keyring } = useWalletState();
  const [password, setPassword] = useState('');
  const [validation, setValidation] = useState('');
  const dispatch = useDispatch();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
    setValidation('');
  };

  const doVerify = async (event: FormEvent) => {
    event.preventDefault();
    if (!password) {
      return;
    }

    try {
      await keyring.verifyPassword(password);
      dispatch(settingsDialogActions.setPassword(password));
    } catch (e: any) {
      setValidation(e.message);
    }
  };

  const doBack = () => {
    dispatch(settingsDialogActions.switchSettingsDialogScreen(SettingsDialogScreen.Settings));
  };

  return (
    <>
      <DialogContentText className='mt-4 mb-4'>Enter your wallet password to continue</DialogContentText>
      <form onSubmit={doVerify} noValidate>
        <TextField
          className='text-center'
          type='password'
          value={password}
          label='Your wallet password'
          fullWidth
          autoFocus
          error={!!validation}
          helperText={validation || <EmptySpace />}
          onChange={handleChange}
        />
        <div className='mt-4 flex gap-4'>
          <Button variant='text' onClick={doBack}>
            Back
          </Button>
          <Button type='submit' disabled={!password} fullWidth variant='contained'>
            View Secret Recovery Phrase
          </Button>
        </div>
      </form>
    </>
  );
};

export default VerifyingPassword;
