import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { Language, ThemeMode, AutoLockInterval } from 'types';

export interface SettingsState {
  themeMode: ThemeMode;
  language: Language;
  autoLockInterval: AutoLockInterval;
}

const initialState: SettingsState = {
  themeMode: ThemeMode.System,
  language: Language.English,
  autoLockInterval: AutoLockInterval.FiveMinutes,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    switchThemeMode: (state: Draft<SettingsState>, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
    },
    switchLanguage: (state: Draft<SettingsState>, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
    switchAutoLockInterval: (state: Draft<SettingsState>, action: PayloadAction<AutoLockInterval>) => {
      state.autoLockInterval = action.payload;
    },
  },
});

export const settingsActions = settingsSlice.actions;
export default settingsSlice;
