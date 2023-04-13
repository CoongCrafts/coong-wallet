import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { SettingsDialogScreen } from 'types';

export interface SettingsDialog {
  screen: SettingsDialogScreen;
  verifiedPassword?: string | null;
  onChangingPassword: boolean;
}

const initialState: SettingsDialog = {
  screen: SettingsDialogScreen.SettingsWallet,
  onChangingPassword: false,
};

const settingsDialogSlice = createSlice({
  name: 'settingsDialog',
  initialState,
  reducers: {
    switchScreen: (state: Draft<SettingsDialog>, action: PayloadAction<SettingsDialogScreen>) => {
      state.screen = action.payload;
    },
    setVerifiedPassword: (state: Draft<SettingsDialog>, action: PayloadAction<string | null>) => {
      state.verifiedPassword = action.payload;
    },
    setOnChangingPassword: (state: Draft<SettingsDialog>, action: PayloadAction<boolean>) => {
      state.onChangingPassword = action.payload;
    },
    resetState: (state: Draft<SettingsDialog>) => {
      state.screen = SettingsDialogScreen.SettingsWallet;
      state.onChangingPassword = false;
      state.verifiedPassword = null;
    },
  },
});

export const settingsDialogActions = settingsDialogSlice.actions;

export default settingsDialogSlice;
