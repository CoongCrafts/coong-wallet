import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { DialogContent, DialogContentText, Divider } from '@mui/material';
import DialogTitle from 'components/shared/DialogTitle';
import AutoLockSelection from 'components/shared/settings/SettingsWalletDialog/AutoLockSelection';
import BackupSecretPhraseButton from 'components/shared/settings/SettingsWalletDialog/BackupSecretPhraseButton';
import ChangeWalletPasswordButton from 'components/shared/settings/SettingsWalletDialog/ChangeWalletPasswordButton';
import LanguageSelection from 'components/shared/settings/SettingsWalletDialog/LanguageSelection';
import ThemeModeButton from 'components/shared/settings/SettingsWalletDialog/ThemeModeButton';
import { Props } from 'types';

interface SettingsWalletDialogProps extends Props {
  onClose: () => void;
}

const SettingsWalletDialog: FC<SettingsWalletDialogProps> = ({ onClose }) => {
  const { t } = useTranslation();

  return (
    <>
      <DialogTitle onClose={onClose}>{t<string>('Settings')}</DialogTitle>
      <DialogContent className='pb-8'>
        <DialogContentText className='mb-1'>{t<string>('Theme Mode')}</DialogContentText>
        <ThemeModeButton />
        <DialogContentText className='mb-1 mt-4'>{t<string>('Language')}</DialogContentText>
        <LanguageSelection />
        <DialogContentText className='mb-1 mt-4'>{t<string>('Auto-lock wallet after')}</DialogContentText>
        <AutoLockSelection />
        <Divider className='mt-4' />
        <BackupSecretPhraseButton />
        <ChangeWalletPasswordButton />
      </DialogContent>
    </>
  );
};

export default SettingsWalletDialog;
