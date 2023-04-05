import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import KeyIcon from '@mui/icons-material/Key';
import LockIcon from '@mui/icons-material/Lock';
import { Button, DialogContent, DialogContentText, Divider } from '@mui/material';
import DialogTitle from 'components/shared/DialogTitle';
import AutoLockSelection from 'components/shared/settings/SettingsWalletDialog/AutoLockSelection';
import LanguageSelection from 'components/shared/settings/SettingsWalletDialog/LanguageSelection';
import ThemeModeButton from 'components/shared/settings/SettingsWalletDialog/ThemeModeButton';
import useThemeMode from 'hooks/useThemeMode';
import { settingsDialogActions } from 'redux/slices/settings-dialog';
import { SettingsDialogScreen } from 'types';
import { Props } from 'types';

interface SettingsWalletDialogProps extends Props {
  onClose: () => void;
}

const SettingsWalletDialog: FC<SettingsWalletDialogProps> = ({ onClose }) => {
  const { dark } = useThemeMode();
  const { t } = useTranslation();
  const dispatch = useDispatch();

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
        <Button
          className='mt-4 justify-start w-full gap-2'
          variant='outlined'
          color={dark ? 'grayLight' : 'gray'}
          startIcon={<KeyIcon />}
          onClick={() =>
            dispatch(settingsDialogActions.switchSettingsDialogScreen(SettingsDialogScreen.BackupSecretPhrase))
          }>
          {t<string>('Backup secret recovery phrase')}
        </Button>{' '}
        <Button
          className='mt-4 justify-start w-full gap-2'
          variant='outlined'
          color={dark ? 'grayLight' : 'gray'}
          startIcon={<LockIcon />}
          onClick={() =>
            dispatch(settingsDialogActions.switchSettingsDialogScreen(SettingsDialogScreen.ChangeWalletPassword))
          }>
          {t<string>('Change wallet password')}
        </Button>
      </DialogContent>
    </>
  );
};

export default SettingsWalletDialog;
