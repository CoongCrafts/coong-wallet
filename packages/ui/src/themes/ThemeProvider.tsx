import { FC, useEffect, useMemo, useState } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import useThemeMode from 'hooks/useThemeMode';
import { Props, ThemeMode } from 'types';
import newTheme from '.';

const ThemeProvider: FC<Props> = ({ children }) => {
  const themeMode = useThemeMode();

  const themeColor = useMemo(() => {
    switch (themeMode) {
      case ThemeMode.Dark:
        return 'dark';
      case ThemeMode.Light:
        return 'light';
      case ThemeMode.System:
      default:
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  }, [themeMode]);

  const theme = useMemo(() => {
    return newTheme(themeColor);
  }, [themeColor]);

  return (
    <MuiThemeProvider theme={theme}>
      <body className={themeColor}>{children}</body>
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
