import { ChangeEvent, FC, FormEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import { generateMnemonic } from '@polkadot/util-crypto/mnemonic/bip39';
import { keyring } from '@coong/base';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, styled } from '@mui/material';
import { NewWalletScreenStep } from 'components/pages/NewWallet/types';
import { appActions } from 'redux/slices/app';
import { setupWalletActions } from 'redux/slices/setup-wallet';
import { RootState } from 'redux/store';
import { Props } from 'types';

const BackupSecretRecoveryPhrase: FC<Props> = ({ className = '' }: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { password } = useSelector((state: RootState) => state.setupWallet);
  const [checked, setChecked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>();
  const [secretPhrase, setSecretPhrase] = useState<string>();

  useEffectOnce(() => {
    setSecretPhrase(generateMnemonic(12));
  });

  const doSetupWallet = (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    setTimeout(async () => {
      await keyring.initialize(secretPhrase!, password);
      await keyring.unlock(password);
      await keyring.createNewAccount('My first account');

      dispatch(appActions.setSeedReady());
      dispatch(appActions.setLockStatus(keyring.locked()));
      navigate('/');
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
          <LoadingButton type='submit' fullWidth disabled={!checked} loading={loading} variant='contained' size='large'>
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
