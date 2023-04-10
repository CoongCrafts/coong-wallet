import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { SettingsDialogScreen } from 'types';

export interface SettingsDialog {
  settingsDialogScreen: SettingsDialogScreen;
  verifiedPassword?: string | null;
}

const initialState: SettingsDialog = {
  settingsDialogScreen: SettingsDialogScreen.SettingsWallet,
};

const settingsDialogSlice = createSlice({
  name: 'settingsDialog',
  initialState,
  reducers: {
    switchSettingsDialogScreen: (state: Draft<SettingsDialog>, action: PayloadAction<SettingsDialogScreen>) => {
      state.settingsDialogScreen = action.payload;
    },
    setVerifiedPassword: (state: Draft<SettingsDialog>, action: PayloadAction<string | null>) => {
      state.verifiedPassword = action.payload;
    },
    resetState: (state: Draft<SettingsDialog>) => {
      state.settingsDialogScreen = SettingsDialogScreen.SettingsWallet;
      state.verifiedPassword = null;
    },
  },
});

export const settingsDialogActions = settingsDialogSlice.actions;

export default settingsDialogSlice;
