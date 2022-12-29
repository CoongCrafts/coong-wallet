import { ChangeEvent, FC, FormEvent, useState } from 'react';
import { Props } from 'types';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, styled } from '@mui/material';
import { setupWalletActions } from 'redux/slices/setup-wallet';
import { NewWalletScreenStep } from 'components/pages/NewWallet/types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { generateMnemonic } from '@polkadot/util-crypto/mnemonic/bip39';
import { LoadingButton } from '@mui/lab';
import { useEffectOnce } from 'react-use';

const BackupSecretRecoveryPhrase: FC<Props> = ({ className = '' }: Props) => {
  const dispatch = useDispatch();
  const { password } = useSelector((state: RootState) => state.setupWallet);
  const [checked, setChecked] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>();
  const [secretPhrase, setSecretPhrase] = useState<string>();

  useEffectOnce(() => {
    setSecretPhrase(generateMnemonic(12));
  });

  const doSetupWallet = (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    // TODO call setup keyring
    console.log('setup keyring', password, secretPhrase);
  };

  const back = () => {
    dispatch(setupWalletActions.setStep(NewWalletScreenStep.ChooseWalletPassword));
  };

  const handleCheckbox = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <div className={className}>
      <h3>Finally, back up your secret recovery phrase</h3>

      <Box component='form' noValidate autoComplete='off' onSubmit={doSetupWallet}>
        <div className='secret-phrase-box'>{secretPhrase}</div>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={checked} onChange={handleCheckbox} disabled={loading} />}
            label='I have backed up my recovery phrase'
          />
        </FormGroup>
        <div className='form-actions'>
          <Button variant='text' onClick={back} disabled={loading}>
            Back
          </Button>
          <LoadingButton type='submit' fullWidth disabled={!checked} loading={loading} variant='contained'>
            Finish
          </LoadingButton>
        </div>
      </Box>
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
