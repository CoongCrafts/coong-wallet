import { ChangeEvent, FC, FormEvent, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Button, TextField } from '@mui/material';
import EmptySpace from 'components/shared/misc/EmptySpace';
import usePasswordValidation from 'hooks/usePasswordValidation';
import { setupWalletActions } from 'redux/slices/setup-wallet';
import { Props } from 'types';

interface ChooseWalletPasswordProps extends Props {
  nextStep: () => void;
  prevStep?: () => void;
}

const ChooseWalletPassword: FC<ChooseWalletPasswordProps> = ({ className = '', nextStep, prevStep }) => {
  const dispatch = useDispatch();
  const [password, setPassword] = useState<string>('');
  const { validation } = usePasswordValidation(password);
  const { t } = useTranslation();

  const next = (e: FormEvent) => {
    e.preventDefault();
    if (!password) {
      return;
    }

    dispatch(setupWalletActions.setPassword(password));

    nextStep && nextStep();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <div className={className}>
      <h3>
        {!prevStep ? t<string>('First, choose your wallet password') : t<string>('Next, choose your wallet password')}
      </h3>
      <p className='mb-6'>
        <Trans>
          Your password will be used to encrypt accounts as well as unlock the wallet, make sure to pick a strong &
          easy-to-remember password
        </Trans>
      </p>

      <form className='flex flex-col gap-2' noValidate autoComplete='off' onSubmit={next}>
        <TextField
          label={t<string>('Wallet password')}
          fullWidth
          autoFocus
          type='password'
          onChange={handleChange}
          value={password}
          error={!!validation}
          helperText={validation || <EmptySpace />}
        />
        <div className='flex flex-row gap-4'>
          {prevStep && (
            <Button variant='text' onClick={prevStep}>
              {t<string>('Back')}
            </Button>
          )}
          <Button type='submit' fullWidth disabled={!password || !!validation} size='large'>
            {t<string>('Next')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChooseWalletPassword;
