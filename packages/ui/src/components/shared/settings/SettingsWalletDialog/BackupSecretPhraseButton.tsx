import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import KeyIcon from '@mui/icons-material/Key';
import { Button } from '@mui/material';
import { settingsDialogActions } from 'redux/slices/settings-dialog';
import { Props, SettingsDialogScreen } from 'types';

const BackupSecretPhraseButton: FC<Props> = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  return (
    <Button
      className='mt-4 justify-start w-full gap-2'
      variant='outlined'
      color='gray'
      startIcon={<KeyIcon />}
      onClick={() => dispatch(settingsDialogActions.switchScreen(SettingsDialogScreen.BackupSecretPhrase))}>
      {t<string>('Backup Secret Recovery Phrase')}
    </Button>
  );
};

export default BackupSecretPhraseButton;
