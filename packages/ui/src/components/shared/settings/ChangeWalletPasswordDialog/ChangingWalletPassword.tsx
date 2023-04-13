import { FC, FormEvent, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Alert, Button, DialogContentText, TextField } from '@mui/material';
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
  const [newPassword, setNewPassword] = useState<string>('');
  const { validation } = usePasswordValidation(newPassword);
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [notMatch, setNotMatch] = useState<boolean>(false);
  const { loading } = useSelector((state: RootState) => state.settingsDialog);

  const doChangePassword = (e: FormEvent) => {
    e.preventDefault();
    dispatch(settingsDialogActions.setLoading(true));

    // changing password has accounts decryption and encryption which are synchronous operations
    // and might take some time to do
    // so we delay it a short amount of time to make sure the UI could be updated (disable button, ...)
    // before the changing password begin
    setTimeout(async () => {
      try {
        await keyring.changePassword(verifiedPassword!, newPassword);
        doBack();
        toast.success(t<string>('Password changed successfully!'));
      } catch (e: any) {
        toast.error(t<string>(e.message));
      }
    }, 200);
  };

  const doBack = () => {
    dispatch(settingsDialogActions.resetState());
  };

  useEffect(() => {
    setNotMatch(passwordConfirmation !== newPassword);
  }, [passwordConfirmation, newPassword]);

  return (
    <>
      <DialogContentText>
        <Trans>
          Your password will be used to encrypt accounts as well as unlock the wallet, make sure to pick a strong &
          easy-to-remember password
        </Trans>
      </DialogContentText>
      <form className='mt-4 flex flex-col gap-2' onSubmit={doChangePassword}>
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
          <Button onClick={doBack} variant='text' disabled={loading}>
            {t<string>('Back')}
          </Button>
          <Button
            type='submit'
            variant='contained'
            disabled={!newPassword || notMatch || !!validation || loading}
            fullWidth>
            {t<string>('Change Password')}
          </Button>
        </div>
      </form>
      <Alert className='mt-4' severity='info'>
        {t<string>(
          'The password changing process might take time if there are many accounts in the wallet, please be patient.',
        )}
      </Alert>
    </>
  );
};

export default ChangingWalletPassword;
