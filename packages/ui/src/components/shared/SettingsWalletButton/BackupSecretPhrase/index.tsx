import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { DialogContent, DialogContentText } from '@mui/material';
import DialogTitle from 'components/shared/DialogTitle';
import ShowingSecretPhrase from 'components/shared/SettingsWalletButton/BackupSecretPhrase/ShowingSecretPhrase';
import VerifyingPassword from 'components/shared/SettingsWalletButton/BackupSecretPhrase/VerifyingPassword';
import { RootState } from 'redux/store';
import { Props } from 'types';

interface BackupSecretPhraseProps extends Props {
  onClose: () => void;
}

const BackupSecretPhrase: FC<BackupSecretPhraseProps> = ({ onClose }) => {
  const { verifiedPassword } = useSelector((state: RootState) => state.settingsDialog);
  const { t } = useTranslation();

  return (
    <>
      <DialogTitle onClose={onClose}>
        {t<string>('Settings')}
        {' / '}
        <strong>{t<string>('Backup secret recovery phrase')}</strong>
      </DialogTitle>
      <DialogContent className='pb-8'>
        <DialogContentText>
          {t<string>(
            'You are about to reveal the secret recovery phrase which give access to your accounts and funds.',
          )}{' '}
          <strong>{t<string>('Make sure you are in a safe place.')}</strong>
        </DialogContentText>
        {verifiedPassword ? <ShowingSecretPhrase /> : <VerifyingPassword />}
      </DialogContent>
    </>
  );
};

export default BackupSecretPhrase;
