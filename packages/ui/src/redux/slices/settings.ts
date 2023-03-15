import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { ThemeMode } from 'types';

export interface SettingState {
  themeMode: ThemeMode;
}

const initialState: SettingState = {
  themeMode: ThemeMode.System,
};

const settingSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    switchThemeMode: (state: Draft<SettingState>, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
    },
  },
});

export const settingActions = settingSlice.actions;
export default settingSlice;
