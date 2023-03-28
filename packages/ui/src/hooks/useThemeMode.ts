import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { ThemeMode } from 'types';

export default function useThemeMode() {
  const { themeMode: rawThemeMode } = useSelector((state: RootState) => state.settings);

  const themeMode = useMemo(() => {
    if (rawThemeMode === ThemeMode.System) {
      const isSystemPrefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return isSystemPrefersDarkMode ? ThemeMode.Dark : ThemeMode.Light;
    }

    return rawThemeMode;
  }, [rawThemeMode]);

  const dark = themeMode === ThemeMode.Dark;
  const light = themeMode === ThemeMode.Light;
  const system = rawThemeMode === ThemeMode.System;

  return { themeMode, dark, light, system };
}
