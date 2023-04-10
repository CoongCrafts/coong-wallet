import { FC, FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useToggle } from 'react-use';
import { Button, TextField } from '@mui/material';
import EmptySpace from 'components/shared/misc/EmptySpace';
import usePasswordValidation from 'hooks/usePasswordValidation';
import { useWalletState } from 'providers/WalletStateProvider';
import { settingsDialogActions } from 'redux/slices/settings-dialog';
import { RootState } from 'redux/store';
import { Props } from 'types';

const ChangingWalletPassword: FC<Props> = () => {
  const dispatch = useDispatch();
  const { keyring } = useWalletState();
  const { t } = useTranslation();
  const { verifiedPassword } = useSelector((state: RootState) => state.settingsDialog);
  const { password: newPassword, validation, setPassword: setNewPassword, setValidation } = usePasswordValidation();
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [notMatch, setNotMatch] = useState<boolean>(false);
  const [loading, setLoading] = useToggle(false);

  const doChangePassword = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // changing password has accounts decryption and encryption which are synchronous operations
    // and might take some time to do
    // so we delay it a short amount of time to make sure the UI could be updated (disable button, ...)
    // before the changing password begin
    setTimeout(async () => {
      try {
        await keyring.changePassword(verifiedPassword!, newPassword);
      } catch (e: any) {
        console.error(e.message);
      }
      doBack();
      toast.success(t<string>('Change password successfully!'));
    }, 200);
  };

  const doBack = () => {
    setLoading(false);
    dispatch(settingsDialogActions.resetState());
  };

  useEffect(() => {
    setNotMatch(passwordConfirmation !== newPassword);
  }, [passwordConfirmation, newPassword]);

  useEffect(() => {
    if (newPassword !== verifiedPassword) return;
    setValidation(t<string>('Password is identical with your current password'));
  }, [newPassword]);

  return (
    <form className='mt-2 flex flex-col gap-2' onSubmit={doChangePassword}>
      <TextField
        type='password'
        label={t<string>('New password')}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        fullWidth
        autoFocus
        error={!!validation}
        helperText={!!validation ? validation : <EmptySpace />}
      />
      <TextField
        type='password'
        label={t<string>('Confirm new password')}
        value={passwordConfirmation}
        onChange={(e) => setPasswordConfirmation(e.target.value)}
        fullWidth
        error={!!passwordConfirmation && notMatch}
        helperText={!!passwordConfirmation && notMatch ? t<string>('Password does not match') : <EmptySpace />}
      />
      <div className='flex gap-4'>
        <Button onClick={doBack} variant='text'>
          {t<string>('Back')}
        </Button>
        <Button type='submit' variant='contained' disabled={notMatch || !!validation || loading} fullWidth>
          {t<string>('Change password')}
        </Button>
      </div>
    </form>
  );
};

export default ChangingWalletPassword;
