import React, { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogContentText,
  IconButton,
  useMediaQuery,
  Theme,
} from '@mui/material';
import DialogTitle from 'components/shared/DialogTitle';
import { settingActions } from 'redux/slices/settings';
import { RootState } from 'redux/store';
import { Props, ThemeMode } from 'types';
import LanguageSelectionMenu from './LanguageSelectionMenu';

const SettingsWalletButton: FC<Props> = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { themeMode } = useSelector((state: RootState) => state.settings);
  const { seedReady, locked } = useSelector((state: RootState) => state.app);
  const xs = useMediaQuery<Theme>((theme) => theme.breakpoints.down('xs'));
  const { t } = useTranslation();

  if (!seedReady || locked) {
    return null;
  }

  const handleClose = () => setOpen(false);
  const switchThemeMode = (mode: ThemeMode) => {
    dispatch(settingActions.switchThemeMode(mode));
  };

  return (
    <>
      <IconButton size='small' title={t<string>('Open settings')} onClick={() => setOpen(true)}>
        <SettingsIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
        <DialogTitle onClose={handleClose}>{t<string>('Settings')}</DialogTitle>
        <DialogContent>
          <DialogContentText className='mb-1'>{t<string>('Theme Mode')}</DialogContentText>
          <ButtonGroup orientation={xs ? 'vertical' : 'horizontal'} fullWidth>
            <Button
              variant={themeMode == ThemeMode.Dark ? 'contained' : 'outlined'}
              onClick={() => switchThemeMode(ThemeMode.Dark)}>
              <DarkModeIcon className='mr-2' fontSize='small' />
              {t<string>('Dark')}
            </Button>
            <Button
              variant={themeMode == ThemeMode.System ? 'contained' : 'outlined'}
              onClick={() => switchThemeMode(ThemeMode.System)}>
              <SettingsBrightnessIcon className='mr-2' fontSize='small' />
              {t<string>('System')}
            </Button>
            <Button
              variant={themeMode == ThemeMode.Light ? 'contained' : 'outlined'}
              onClick={() => switchThemeMode(ThemeMode.Light)}>
              <LightModeIcon className='mr-2' fontSize='small' />
              {t<string>('Light')}
            </Button>
          </ButtonGroup>
          <DialogContentText className='mb-1 mt-4'>Language</DialogContentText>
          <LanguageSelectionMenu />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SettingsWalletButton;
