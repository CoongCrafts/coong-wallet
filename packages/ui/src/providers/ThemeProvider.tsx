import { FC, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import useThemeMode from 'hooks/useThemeMode';
import { newTheme } from 'styles/theme';
import { Props, ThemeMode } from 'types';

const ThemeProvider: FC<Props> = ({ children }) => {
  const { themeMode } = useThemeMode();

  useEffect(() => {
    document.body.classList.remove(ThemeMode.Dark, ThemeMode.Light);
    document.body.classList.add(themeMode);
  }, [themeMode]);

  const theme = useMemo(() => newTheme(themeMode), [themeMode]);

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
};

export default ThemeProvider;
