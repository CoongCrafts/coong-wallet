import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import { Button, ButtonGroup, Theme, useMediaQuery } from '@mui/material';
import useThemeMode from 'hooks/useThemeMode';
import { settingsActions } from 'redux/slices/settings';
import { RootState } from 'redux/store';
import { Props, ThemeMode } from 'types';

const ThemeModeButton: FC<Props> = () => {
  const dispatch = useDispatch();
  const { themeMode } = useSelector((state: RootState) => state.settings);
  const { dark } = useThemeMode();
  const xs = useMediaQuery<Theme>((theme) => theme.breakpoints.down('xs'));
  const { t } = useTranslation();

  const switchThemeMode = (mode: ThemeMode) => {
    dispatch(settingsActions.switchThemeMode(mode));
  };

  const defaultColor = dark ? 'grayLight' : 'gray';

  return (
    <ButtonGroup orientation={xs ? 'vertical' : 'horizontal'} fullWidth>
      <Button
        variant='outlined'
        color={themeMode == ThemeMode.Dark ? 'primary' : defaultColor}
        onClick={() => switchThemeMode(ThemeMode.Dark)}
        endIcon={<DarkModeIcon fontSize='small' />}
        className='flex justify-between'>
        {t<string>('Dark')}
      </Button>
      <Button
        variant='outlined'
        color={themeMode == ThemeMode.System ? 'primary' : defaultColor}
        onClick={() => switchThemeMode(ThemeMode.System)}
        endIcon={<SettingsBrightnessIcon fontSize='small' />}
        className='flex justify-between'>
        {t<string>('System')}
      </Button>
      <Button
        variant='outlined'
        color={themeMode == ThemeMode.Light ? 'primary' : defaultColor}
        onClick={() => switchThemeMode(ThemeMode.Light)}
        endIcon={<LightModeIcon fontSize='small' />}
        className='flex justify-between'>
        {t<string>('Light')}
      </Button>
    </ButtonGroup>
  );
};

export default ThemeModeButton;
