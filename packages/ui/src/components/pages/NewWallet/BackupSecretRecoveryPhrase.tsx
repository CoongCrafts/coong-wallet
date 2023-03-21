import { ChangeEvent, FC, FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import { generateMnemonic } from '@polkadot/util-crypto/mnemonic/bip39';
import { LoadingButton } from '@mui/lab';
import { Button, Checkbox, FormControlLabel, FormGroup, styled } from '@mui/material';
import { NewWalletScreenStep } from 'components/pages/NewWallet/types';
import { useWalletState } from 'providers/WalletStateProvider';
import { appActions } from 'redux/slices/app';
import { setupWalletActions } from 'redux/slices/setup-wallet';
import { RootState } from 'redux/store';
import { Props } from 'types';

interface BackupSecretRecoveryPhraseProps extends Props {
  onWalletSetup?: () => void;
}

const BackupSecretRecoveryPhrase: FC<BackupSecretRecoveryPhraseProps> = ({ className = '', onWalletSetup }) => {
  const { keyring } = useWalletState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { password } = useSelector((state: RootState) => state.setupWallet);
  const [checked, setChecked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>();
  const [secretPhrase, setSecretPhrase] = useState<string>();
  const { t } = useTranslation();

  useEffectOnce(() => {
    setSecretPhrase(generateMnemonic(12));
  });

  const doSetupWallet = (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    setTimeout(async () => {
      if (!password) {
        return;
      }

      await keyring.initialize(secretPhrase!, password);
      await keyring.createNewAccount(t<string>('My first account'), password);

      dispatch(appActions.seedReady());
      dispatch(appActions.unlock());

      if (onWalletSetup) {
        onWalletSetup();
      } else {
        navigate('/');
      }
    }, 500); // intentionally!
  };

  const back = () => {
    dispatch(setupWalletActions.setStep(NewWalletScreenStep.ChooseWalletPassword));
  };

  const handleCheckbox = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <div className={className}>
      <h3>{t<string>('Finally, back up your secret recovery phrase')}</h3>
      <p className='mb-4'>{t<string>('Write down the below 12 words and keep it in a safe place.')}</p>

      <form className='flex flex-col gap-2' noValidate autoComplete='off' onSubmit={doSetupWallet}>
        <div className='secret-phrase-box dark:bg-white/15'>{secretPhrase}</div>
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

export default styled(BackupSecretRecoveryPhrase)`
  .secret-phrase-box {
    background-color: #e7e6e6;
    padding: 1rem;
    position: relative;
  }
`;
