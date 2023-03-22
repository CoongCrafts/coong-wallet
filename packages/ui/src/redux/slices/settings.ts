import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { Language, ThemeMode } from 'types';

export interface SettingsState {
  themeMode: ThemeMode;
  language: Language;
}

const initialState: SettingsState = {
  themeMode: ThemeMode.System,
  language: Language.English,
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
  },
});

export const settingActions = settingsSlice.actions;
export default settingsSlice;
