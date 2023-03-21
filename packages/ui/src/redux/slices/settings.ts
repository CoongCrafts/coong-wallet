import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { Language, ThemeMode } from 'types';

export interface SettingState {
  themeMode: ThemeMode;
  language: Language;
}

const initialState: SettingState = {
  themeMode: ThemeMode.System,
  language: Language.English,
};

const settingSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    switchThemeMode: (state: Draft<SettingState>, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
    },
    switchLanguage: (state: Draft<SettingState>, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
  },
});

export const settingActions = settingSlice.actions;
export default settingSlice;
