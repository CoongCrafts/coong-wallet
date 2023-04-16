import { ChangeEvent, FC, FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useCopyToClipboard, useEffectOnce } from 'react-use';
import { generateMnemonic } from '@polkadot/util-crypto/mnemonic/bip39';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { LoadingButton } from '@mui/lab';
import { Button, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import useSetupWallet from 'hooks/wallet/useSetupWallet';
import { setupWalletActions } from 'redux/slices/setup-wallet';
import { RootState } from 'redux/store';
import { Props, NewWalletScreenStep } from 'types';

interface BackupSecretRecoveryPhraseProps extends Props {
  onWalletSetup?: () => void;
}

const BackupSecretRecoveryPhrase: FC<BackupSecretRecoveryPhraseProps> = ({ className = '', onWalletSetup }) => {
  const dispatch = useDispatch();
  const { password } = useSelector((state: RootState) => state.setupWallet);
  const [checked, setChecked] = useState<boolean>(false);
  const [secretPhrase, setSecretPhrase] = useState<string>('');
  const [copyButtonLabel, setCopyButtonLabel] = useState<string>('Copy to Clipboard');
  const [, copyToClipboard] = useCopyToClipboard();
  const { t } = useTranslation();
  const { setup, loading } = useSetupWallet({ secretPhrase, password, onWalletSetup });

  useEffectOnce(() => {
    setSecretPhrase(generateMnemonic(12));
  });

  const doSetupWallet = (e: FormEvent) => {
    e.preventDefault();

    setup();
  };

  const doCopy = () => {
    copyToClipboard(secretPhrase);
    setCopyButtonLabel('Copied!');
    setTimeout(() => setCopyButtonLabel('Copy to Clipboard'), 5000);
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
        <div>
          <div className='pl-4 text-xs bg-black/20 dark:bg-white/5 flex justify-between items-center'>
            {t<string>('Secret recovery phrase')}
            <Button
              onClick={doCopy}
              className='px-4 font-normal text-xs min-w-max rounded-none'
              size='small'
              color='inherit'
              variant='text'
              startIcon={copyButtonLabel === 'Copied!' ? <CheckIcon /> : <ContentCopyIcon />}>
              {t<string>(copyButtonLabel)}
            </Button>
          </div>
          <div className='p-4 bg-black/10 dark:bg-white/15'>{secretPhrase}</div>
        </div>
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
