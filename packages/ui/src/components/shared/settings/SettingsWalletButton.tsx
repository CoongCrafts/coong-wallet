import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import SettingsIcon from '@mui/icons-material/Settings';
import { Dialog, DialogContent, DialogContentText, IconButton } from '@mui/material';
import DialogTitle from 'components/shared/DialogTitle';
import AutoLockSelection from 'components/shared/settings/AutoLockSelection';
import LanguageSelection from 'components/shared/settings/LanguageSelection';
import ThemeModeButton from 'components/shared/settings/ThemeModeButton';
import { RootState } from 'redux/store';
import { Props } from 'types';

const SettingsWalletButton: FC<Props> = () => {
  const [open, setOpen] = useState(false);
  const { seedReady, locked } = useSelector((state: RootState) => state.app);
  const { t } = useTranslation();

  if (!seedReady || locked) {
    return null;
  }

  const handleClose = () => setOpen(false);

  return (
    <>
      <IconButton size='small' title={t<string>('Open settings')} onClick={() => setOpen(true)}>
        <SettingsIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
        <DialogTitle onClose={handleClose}>{t<string>('Settings')}</DialogTitle>
        <DialogContent>
          <DialogContentText className='mb-1'>{t<string>('Theme Mode')}</DialogContentText>
          <ThemeModeButton />
          <DialogContentText className='mb-1 mt-4'>{t<string>('Language')}</DialogContentText>
          <LanguageSelection />
          <DialogContentText className='mb-1 mt-4'>{t<string>('Auto-lock wallet timer')}</DialogContentText>
          <AutoLockSelection />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SettingsWalletButton;
