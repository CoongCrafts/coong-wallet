import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useAsync, useCopyToClipboard } from 'react-use';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button, DialogContentText } from '@mui/material';
import { useWalletState } from 'providers/WalletStateProvider';
import { settingsDialogActions } from 'redux/slices/settings-dialog';
import { RootState } from 'redux/store';
import { Props } from 'types';

const ShowingSecretPhrase: FC<Props> = () => {
  const { keyring } = useWalletState();
  const { verifiedPassword } = useSelector((state: RootState) => state.settingsDialog);
  const [secretPhrase, setSecretPhrase] = useState('');
  const [_, copyToClipboard] = useCopyToClipboard();
  const { t } = useTranslation();
  const [copyButtonLabel, setCopyButtonLabel] = useState('Copy to clipboard');
  const dispatch = useDispatch();

  const doBack = () => {
    dispatch(settingsDialogActions.resetState());
  };

  const doCopy = () => {
    copyToClipboard(secretPhrase);
    setCopyButtonLabel('Copied!');
    setTimeout(() => setCopyButtonLabel('Copy to clipboard'), 5e3);
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
      <DialogContentText className='my-8 p-4 bg-black/10 dark:bg-white/15'>{secretPhrase}</DialogContentText>
      <div className='mt-4 flex gap-4'>
        <Button variant='text' onClick={doBack}>
          {t<string>('Back')}
        </Button>
        <Button variant='contained' onClick={doCopy} startIcon={<ContentCopyIcon />} fullWidth>
          {t<string>(copyButtonLabel)}
        </Button>
      </div>
    </>
  );
};

export default ShowingSecretPhrase;
