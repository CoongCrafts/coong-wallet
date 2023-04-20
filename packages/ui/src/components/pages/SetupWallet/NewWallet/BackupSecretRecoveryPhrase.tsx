import { ChangeEvent, FC, FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useEffectOnce } from 'react-use';
import { generateMnemonic } from '@polkadot/util-crypto/mnemonic/bip39';
import { LoadingButton } from '@mui/lab';
import { Button, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import SecretRecoveryPhrase from 'components/shared/SecretRecoveryPhrase';
import useSetupWallet from 'hooks/wallet/useSetupWallet';
import { setupWalletActions } from 'redux/slices/setup-wallet';
import { RootState } from 'redux/store';
import { Props, NewWalletScreenStep } from 'types';

interface BackupSecretRecoveryPhraseProps extends Props {
  onWalletSetup?: () => void;
}

const BackupSecretRecoveryPhrase: FC<BackupSecretRecoveryPhraseProps> = ({ className = '', onWalletSetup }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { password } = useSelector((state: RootState) => state.setupWallet);
  const [checked, setChecked] = useState<boolean>(false);
  const [secretPhrase, setSecretPhrase] = useState<string>('');
  const { setup, loading } = useSetupWallet({ secretPhrase, password, onWalletSetup });

  useEffectOnce(() => {
    setSecretPhrase(generateMnemonic(12));
  });

  const doSetupWallet = (e: FormEvent) => {
    e.preventDefault();

    setup();
  };

  const back = () => {
    dispatch(setupWalletActions.setNewWalletScreenStep(NewWalletScreenStep.ChooseWalletPassword));
  };

  const handleCheckbox = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <div className={className}>
      <h3>{t<string>('Finally, back up your secret recovery phrase')}</h3>
      <p className='mb-4'>{t<string>('Write down the below 12 words and keep it in a safe place.')}</p>
      <form className='flex flex-col gap-2' noValidate autoComplete='off' onSubmit={doSetupWallet}>
        <SecretRecoveryPhrase secretPhrase={secretPhrase} />
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={checked} onChange={handleCheckbox} disabled={loading} />}
            label={t<string>('I have backed up my recovery phrase')}
          />
        </FormGroup>
        <div className='flex flex-row gap-4'>
          <Button variant='text' onClick={back} disabled={loading}>
            {t<string>('Back')}
          </Button>
          <LoadingButton type='submit' fullWidth disabled={!checked} loading={loading} variant='contained' size='large'>
            {t<string>('Finish')}
          </LoadingButton>
        </div>
      </form>
    </div>
  );
};

export default BackupSecretRecoveryPhrase;
