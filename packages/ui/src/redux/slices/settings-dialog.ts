import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { SettingsDialogScreen } from 'types';

export interface SettingsDialog {
  settingsDialogScreen: SettingsDialogScreen;
  verifiedPassword?: string;
}

const initialState: SettingsDialog = {
  settingsDialogScreen: SettingsDialogScreen.Settings,
};

const settingsDialogSlice = createSlice({
  name: 'settingsDialog',
  initialState,
  reducers: {
    switchSettingsDialogScreen: (state: Draft<SettingsDialog>, action: PayloadAction<SettingsDialogScreen>) => {
      state.settingsDialogScreen = action.payload;
    },
    setVerifiedPassword: (state: Draft<SettingsDialog>, action: PayloadAction<string>) => {
      state.verifiedPassword = action.payload;
    },
    resetState: (state: Draft<SettingsDialog>) => {
      state.settingsDialogScreen = SettingsDialogScreen.Settings;
      state.verifiedPassword = '';
    },
  },
});

export const settingsDialogActions = settingsDialogSlice.actions;

export default settingsDialogSlice;
