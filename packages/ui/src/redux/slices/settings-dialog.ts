import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { SettingsDialogScreen } from 'types';

export interface SettingsDialog {
  screen: SettingsDialogScreen;
  verifiedPassword?: string | null;
  loading: boolean;
}

const initialState: SettingsDialog = {
  screen: SettingsDialogScreen.SettingsWallet,
  loading: false,
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
    setLoading: (state: Draft<SettingsDialog>, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    resetState: (state: Draft<SettingsDialog>) => {
      state.screen = SettingsDialogScreen.SettingsWallet;
      state.loading = false;
      state.verifiedPassword = null;
    },
  },
});

export const settingsDialogActions = settingsDialogSlice.actions;

export default settingsDialogSlice;
