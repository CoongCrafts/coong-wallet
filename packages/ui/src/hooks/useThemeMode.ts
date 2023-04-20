import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useMedia } from 'react-use';
import { RootState } from 'redux/store';
import { ThemeMode } from 'types';

export default function useThemeMode() {
  const systemPrefersDarkMode = useMedia('(prefers-color-scheme: dark)');
  const { themeMode: rawThemeMode } = useSelector((state: RootState) => state.settings);

  const themeMode = useMemo(() => {
    if (rawThemeMode === ThemeMode.System) {
      return systemPrefersDarkMode ? ThemeMode.Dark : ThemeMode.Light;
    }

    return rawThemeMode;
  }, [rawThemeMode, systemPrefersDarkMode]);

  const dark = themeMode === ThemeMode.Dark;
  const light = themeMode === ThemeMode.Light;
  const system = rawThemeMode === ThemeMode.System;

  return { themeMode, dark, light, system };
}
