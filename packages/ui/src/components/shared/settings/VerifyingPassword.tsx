import { ChangeEvent, FC, FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Button, DialogContentText, TextField } from '@mui/material';
import EmptySpace from 'components/shared/misc/EmptySpace';
import { useWalletState } from 'providers/WalletStateProvider';
import { settingsDialogActions } from 'redux/slices/settings-dialog';
import { Props } from 'types';

interface VerifyingPasswordProps extends Props {
  continueButtonLabel?: string;
}

const VerifyingPassword: FC<VerifyingPasswordProps> = ({ continueButtonLabel = 'Continue' }) => {
  const { keyring } = useWalletState();
  const [password, setPassword] = useState('');
  const [validation, setValidation] = useState('');
  const dispatch = useDispatch();
  const { t } = useTranslation();

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
      dispatch(settingsDialogActions.setVerifiedPassword(password));
    } catch (e: any) {
      setValidation(t<string>(e.message));
    }
  };

  const doBack = () => {
    dispatch(settingsDialogActions.resetState());
  };

  return (
    <>
      <DialogContentText className='mt-4 mb-2'>{t<string>('Enter your wallet password to continue')}</DialogContentText>
      <form onSubmit={doVerify} noValidate>
        <TextField
          type='password'
          value={password}
          label={t<string>('Wallet password')}
          fullWidth
          autoFocus
          error={!!validation}
          helperText={validation || <EmptySpace />}
          onChange={handleChange}
        />
        <div className='mt-2.5 flex gap-4'>
          <Button variant='text' onClick={doBack}>
            {t<string>('Back')}
          </Button>
          <Button type='submit' disabled={!password} fullWidth variant='contained'>
            {t<string>(continueButtonLabel)}
          </Button>
        </div>
      </form>
    </>
  );
};

export default VerifyingPassword;
