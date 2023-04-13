import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import KeyIcon from '@mui/icons-material/Key';
import { Button } from '@mui/material';
import useThemeMode from 'hooks/useThemeMode';
import { settingsDialogActions } from 'redux/slices/settings-dialog';
import { Props, SettingsDialogScreen } from 'types';

const BackupSecretPhraseButton: FC<Props> = () => {
  const { t } = useTranslation();
  const { dark } = useThemeMode();
  const dispatch = useDispatch();

  return (
    <Button
      className='mt-4 justify-start w-full gap-2'
      variant='outlined'
      color={dark ? 'grayLight' : 'gray'}
      startIcon={<KeyIcon />}
      onClick={() => dispatch(settingsDialogActions.switchScreen(SettingsDialogScreen.BackupSecretPhrase))}>
      {t<string>('Backup Secret Recovery Phrase')}
    </Button>
  );
};

export default BackupSecretPhraseButton;
