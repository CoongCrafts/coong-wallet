import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { ThemeMode } from 'types';

export default function useThemeMode() {
  const { themeMode } = useSelector((state: RootState) => state.settings);

  return useMemo(() => {
    if (themeMode === ThemeMode.System) {
      const isSystemPrefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return isSystemPrefersDarkMode ? ThemeMode.Dark : ThemeMode.Light;
    }

    return themeMode;
  }, [themeMode]) 
}
