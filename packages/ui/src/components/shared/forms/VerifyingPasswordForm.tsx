import { ChangeEvent, FC, FormEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEffectOnce, useToggle } from 'react-use';
import { Button, DialogContentText, TextField } from '@mui/material';
import EmptySpace from 'components/shared/misc/EmptySpace';
import { useWalletState } from 'providers/WalletStateProvider';
import { Props } from 'types';

interface VerifyingPasswordProps extends Props {
  onPasswordVerified: (password: string) => void;
  onBack: () => void;
  backButtonLabel?: string;
  continueButtonLabel?: string;
}

const VerifyingPasswordForm: FC<VerifyingPasswordProps> = ({
  onPasswordVerified,
  onBack,
  backButtonLabel = 'Back',
  continueButtonLabel = 'Continue',
}) => {
  const { t } = useTranslation();
  const { keyring } = useWalletState();
  const [password, setPassword] = useState('');
  const [validation, setValidation] = useState('');
  const [verifying, setVerifying] = useToggle(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
    setValidation('');
  };

  const doVerify = async (event: FormEvent) => {
    event.preventDefault();
    if (!password) {
      return;
    }

    setVerifying(true);

    setTimeout(async () => {
      try {
        await keyring.verifyPassword(password);
        await onPasswordVerified(password);
      } catch (e: any) {
        setVerifying(false);
        setValidation(t<string>(e.message));
      }
    }, 200);
  };

  return (
    <>
      <DialogContentText className='mb-4'>{t<string>('Enter your wallet password to continue')}</DialogContentText>
      <form onSubmit={doVerify} noValidate className='flex flex-col gap-2'>
        <TextField
          type='password'
          autoFocus
          value={password}
          label={t<string>('Wallet password')}
          fullWidth
          error={!!validation}
          helperText={validation || <EmptySpace />}
          onChange={handleChange}
        />

        <div className='flex gap-4'>
          <Button variant='text' onClick={onBack}>
            {t<string>(backButtonLabel)}
          </Button>
          <Button type='submit' disabled={!password || verifying} fullWidth variant='contained'>
            {t<string>(continueButtonLabel)}
          </Button>
        </div>
      </form>
    </>
  );
};

export default VerifyingPasswordForm;
