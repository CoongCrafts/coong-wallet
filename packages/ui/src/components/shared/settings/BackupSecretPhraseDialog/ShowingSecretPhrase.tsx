import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useAsync } from 'react-use';
import { Button } from '@mui/material';
import SecretRecoveryPhrase from 'components/shared/SecretRecoveryPhrase';
import { useWalletState } from 'providers/WalletStateProvider';
import { settingsDialogActions } from 'redux/slices/settings-dialog';
import { RootState } from 'redux/store';
import { Props } from 'types';

const ShowingSecretPhrase: FC<Props> = () => {
  const { t } = useTranslation();
  const { keyring } = useWalletState();
  const { verifiedPassword } = useSelector((state: RootState) => state.settingsDialog);
  const [secretPhrase, setSecretPhrase] = useState('');
  const dispatch = useDispatch();

  const doBack = () => {
    dispatch(settingsDialogActions.resetState());
  };

  const doClose = () => {
    dispatch(settingsDialogActions.setOpen(false));

    // Make sure the dialog disappears before resetting the state
    // to prevent the dialog content from changing in the transition
    setTimeout(() => doBack(), 150);
  };

  useAsync(async () => {
    try {
      setSecretPhrase(await keyring.getRawMnemonic(verifiedPassword!));
    } catch (e: any) {
      toast.error(e.message);
    }
  });

  return (
    <>
      <SecretRecoveryPhrase secretPhrase={secretPhrase} className='mt-4' />
      <div className='mt-4 flex gap-4'>
        <Button variant='text' onClick={doBack}>
          {t<string>('Back')}
        </Button>
        <Button variant='contained' onClick={doClose} fullWidth>
          {t<string>('Done')}
        </Button>
      </div>
    </>
  );
};

export default ShowingSecretPhrase;
