import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { validateMnemonic } from '@polkadot/util-crypto/mnemonic/bip39';
import { Button, TextField } from '@mui/material';
import EmptySpace from 'components/shared/misc/EmptySpace';
import { setupWalletActions } from 'redux/slices/setup-wallet';
import { Props, RestoreWalletScreenStep } from 'types';

export default function EnterSecretRecoveryPhrase({ className = '' }: Props): JSX.Element {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [secretPhrase, setSecretPhrase] = useState('');
  const [validation, setValidation] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!secretPhrase) {
      setValidation('');
    } else {
      if (!validateMnemonic(secretPhrase)) {
        setValidation(t<string>('Invalid secret recovery phrase'));
      } else {
        setValidation('');
      }
    }
  }, [secretPhrase]);

  const next = (e: FormEvent) => {
    e.preventDefault();
    if (!secretPhrase) {
      return;
    }

    dispatch(setupWalletActions.setSecretPhrase(secretPhrase));
    dispatch(setupWalletActions.setRestoreWalletScreenStep(RestoreWalletScreenStep.ChooseWalletPassword));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSecretPhrase(event.target.value);
  };

  return (
    <div className={className}>
      <h3>{t<string>('First, enter your secret recovery phrase')}</h3>
      <p className='mb-6'>
        Please enter your secret recovery phrase (12 or 24 words), make sure no-one can see you entering the recovery
        phrase.
      </p>
      <form className='flex flex-col gap-2' noValidate autoComplete='off' onSubmit={next}>
        <TextField
          label={t<string>('Secret recovery phrase')}
          fullWidth
          autoFocus
          multiline
          rows={4}
          onChange={handleChange}
          value={secretPhrase}
          error={!!validation}
          helperText={validation || <EmptySpace />}
        />
        <div className='flex gap-4'>
          <Button onClick={() => navigate('/restore-wallet')} variant='text'>
            {t<string>('Back')}
          </Button>
          <Button type='submit' fullWidth disabled={!secretPhrase || !!validation} size='large'>
            {t<string>('Next')}
          </Button>
        </div>
      </form>
    </div>
  );
}
