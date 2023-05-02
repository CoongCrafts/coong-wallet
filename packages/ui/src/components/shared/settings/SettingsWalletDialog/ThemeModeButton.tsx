import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import { Button, ButtonGroup, Theme, useMediaQuery } from '@mui/material';
import { settingsActions } from 'redux/slices/settings';
import { RootState } from 'redux/store';
import { Props, ThemeMode } from 'types';

const ThemeModeOptions = [
  { option: ThemeMode.Dark, label: 'Dark', icon: <DarkModeIcon fontSize='small' /> },
  {
    option: ThemeMode.System,
    label: 'System',
    icon: <SettingsBrightnessIcon fontSize='small' />,
  },
  { option: ThemeMode.Light, label: 'Light', icon: <LightModeIcon fontSize='small' /> },
];

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
      {ThemeModeOptions.map(({ option, label, icon }) => (
        <Button
          key={option}
          variant='outlined'
          color={themeMode === option ? 'primary' : 'gray'}
          onClick={() => switchThemeMode(option)}
          endIcon={icon}
          className='flex justify-between'>
          {t<string>(label)}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default ThemeModeButton;
