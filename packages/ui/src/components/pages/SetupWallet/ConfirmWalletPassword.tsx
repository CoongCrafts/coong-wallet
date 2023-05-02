import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { Button, TextField } from '@mui/material';
import EmptySpace from 'components/shared/misc/EmptySpace';
import { RootState } from 'redux/store';
import { Props } from 'types';

interface ConfirmWalletPasswordProps extends Props {
  nextStep: () => void;
  nextStepLabel?: string;
  nextStepLoading?: boolean;
  prevStep: () => void;
  heading?: string;
}

const ConfirmWalletPassword: FC<ConfirmWalletPasswordProps> = ({
  className = '',
  nextStep,
  nextStepLabel = 'Next',
  nextStepLoading,
  prevStep,
  heading = 'Confirm your wallet password',
}) => {
  const { password } = useSelector((state: RootState) => state.setupWallet);
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [notMatch, setNotMatch] = useState<boolean>(true);
  const { t } = useTranslation();

  useEffect(() => {
    setNotMatch(password !== passwordConfirmation);
  }, [passwordConfirmation]);

  const next = (e: FormEvent) => {
    e.preventDefault();

    if (notMatch) {
      return;
    }

    nextStep && nextStep();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirmation(event.target.value);
  };

  return (
    <div className={className}>
      <h3>{t<string>(heading)}</h3>
      <p className='mb-6'>{t<string>('Type again your chosen password to ensure you remember it.')}</p>

      <form className='flex flex-col gap-2' noValidate autoComplete='off' onSubmit={next}>
        <TextField
          label={t<string>('Confirm wallet password')}
          fullWidth
          autoFocus
          type='password'
          onChange={handleChange}
          value={passwordConfirmation}
          error={!!passwordConfirmation && notMatch}
          helperText={!!passwordConfirmation && notMatch ? t<string>('Password does not match') : <EmptySpace />}
        />
        <div className='flex flex-row gap-4'>
          <Button variant='text' onClick={prevStep}>
            {t<string>('Back')}
          </Button>
          <LoadingButton
            type='submit'
            fullWidth
            disabled={notMatch}
            loading={nextStepLoading}
            size='large'
            variant='contained'>
            {t<string>(nextStepLabel)}
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default ConfirmWalletPassword;
