import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import { ButtonGroup, Button, useMediaQuery, Theme } from '@mui/material';
import { settingsActions } from 'redux/slices/settings';
import { RootState } from 'redux/store';
import { Props, ThemeMode } from 'types';

const ThemeModeButton: FC<Props> = () => {
  const dispatch = useDispatch();
  const { themeMode } = useSelector((state: RootState) => state.settings);
  const xs = useMediaQuery<Theme>((theme) => theme.breakpoints.down('xs'));
  const { t } = useTranslation();

  const switchThemeMode = (mode: ThemeMode) => {
    dispatch(settingsActions.switchThemeMode(mode));
  };

  return (
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
  );
};

export default ThemeModeButton;
