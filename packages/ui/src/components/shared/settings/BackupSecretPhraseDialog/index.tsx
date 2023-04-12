import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Breadcrumbs, DialogContent, DialogContentText, Link, Typography } from '@mui/material';
import DialogTitle from 'components/shared/DialogTitle';
import ShowingSecretPhrase from 'components/shared/settings/BackupSecretPhraseDialog/ShowingSecretPhrase';
import VerifyingPassword from 'components/shared/settings/VerifyingPassword';
import { settingsDialogActions } from 'redux/slices/settings-dialog';
import { RootState } from 'redux/store';
import { Props } from 'types';

interface BackupSecretPhraseDialogProps extends Props {
  onClose: () => void;
}

const BackupSecretPhraseDialog: FC<BackupSecretPhraseDialogProps> = ({ onClose }) => {
  const { verifiedPassword } = useSelector((state: RootState) => state.settingsDialog);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <>
      <DialogTitle onClose={onClose}>
        <Breadcrumbs>
          <Link
            className='cursor-pointer'
            underline='hover'
            color='inherit'
            variant='h6'
            onClick={() => dispatch(settingsDialogActions.resetState())}>
            {t<string>('Settings')}
          </Link>
          <Typography color='text.primary' variant='h6'>
            {t<string>('Backup secret recovery phrase')}
          </Typography>
        </Breadcrumbs>
      </DialogTitle>
      <DialogContent className='pb-8 flex-col flex gap-2'>
        <DialogContentText>
          {t<string>(
            'You are about to reveal the secret recovery phrase which give access to your accounts and funds.',
          )}{' '}
          <strong>{t<string>('Make sure you are in a safe place.')}</strong>
        </DialogContentText>
        {verifiedPassword ? (
          <ShowingSecretPhrase />
        ) : (
          <VerifyingPassword continueButtonLabel='View Secret Recovery Phrase' />
        )}
      </DialogContent>
    </>
  );
};

export default BackupSecretPhraseDialog;
