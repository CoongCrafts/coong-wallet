import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useAsync, useCopyToClipboard } from 'react-use';
import CheckIcon from '@mui/icons-material/Check';
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
  const [copyButtonLabel, setCopyButtonLabel] = useState('Copy to Clipboard');
  const dispatch = useDispatch();

  const doBack = () => {
    dispatch(settingsDialogActions.resetState());
  };

  const doCopy = () => {
    copyToClipboard(secretPhrase);
    setCopyButtonLabel('Copied!');
    setTimeout(() => setCopyButtonLabel('Copy to Clipboard'), 5e3);
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
      <div>
        <DialogContentText className='pl-4 mt-4 text-xs font-bold bg-black/20 dark:bg-white/5 flex justify-between items-center'>
          <span>{t<string>('Secret recovery phrase')}</span>
          <Button
            onClick={doCopy}
            size='small'
            variant='text'
            color='inherit'
            className='px-4 py-2 font-normal text-xs rounded-none disabled:text-inherit'
            disabled={copyButtonLabel === 'Copied!'}
            startIcon={copyButtonLabel === 'Copied!' ? <CheckIcon /> : <ContentCopyIcon />}>
            {t<string>(copyButtonLabel)}
          </Button>
        </DialogContentText>
        <DialogContentText className='p-4 bg-black/10 dark:bg-white/15'>{secretPhrase}</DialogContentText>
      </div>
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
