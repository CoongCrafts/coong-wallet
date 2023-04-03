import { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAsync, useCopyToClipboard } from 'react-use';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button, DialogContentText } from '@mui/material';
import { useWalletState } from '../../../../providers/WalletStateProvider';
import { settingsDialogActions, SettingsDialogScreen } from '../../../../redux/slices/settings-dialog';
import { RootState } from '../../../../redux/store';
import { Props } from '../../../../types';

const ShowingSecretPhrase: FC<Props> = () => {
  const { keyring } = useWalletState();
  const { password } = useSelector((state: RootState) => state.settingsDialog);
  const [secretPhrase, setSecretPhrase] = useState('');
  const [_, copyToClipboard] = useCopyToClipboard();
  const [title, setTitle] = useState('Copy to clipboard');
  const dispatch = useDispatch();

  const doBack = () => {
    dispatch(settingsDialogActions.switchSettingsDialogScreen(SettingsDialogScreen.Settings));
    dispatch(settingsDialogActions.setPassword(''));
  };

  const doCopy = () => {
    copyToClipboard(secretPhrase);
    setTitle('Copied!');
  };

  useAsync(async () => {
    setSecretPhrase(await keyring.getRawMnemonic(password!));
  });

  return (
    <>
      <DialogContentText className='my-4 py-4 bg-black/10 dark:bg-white/15 text-center'>
        {secretPhrase}
      </DialogContentText>
      <div className='mt-4 flex gap-4'>
        <Button variant='text' onClick={doBack}>
          Back
        </Button>
        <Button onClick={doCopy} startIcon={<ContentCopyIcon />} fullWidth variant='contained'>
          {title}
        </Button>
      </div>
    </>
  );
};

export default ShowingSecretPhrase;
