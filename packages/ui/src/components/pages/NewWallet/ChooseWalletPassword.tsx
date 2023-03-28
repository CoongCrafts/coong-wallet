import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Button, TextField } from '@mui/material';
import EmptySpace from 'components/shared/misc/EmptySpace';
import { setupWalletActions } from 'redux/slices/setup-wallet';
import { Props } from 'types';

const ChooseWalletPassword: FC<Props> = ({ className = '' }: Props) => {
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [validation, setValidation] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    // TODO Add more strict password policy & password strength indicator
    if (password && password.length <= 5) {
      setValidation(t<string>("Password's too short"));
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
      <h3>{t('First, choose your wallet password')}</h3>
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
        <Button type='submit' fullWidth disabled={!password || !!validation} size='large'>
          {t<string>('Next')}
        </Button>
      </form>
    </div>
  );
};

export default ChooseWalletPassword;
