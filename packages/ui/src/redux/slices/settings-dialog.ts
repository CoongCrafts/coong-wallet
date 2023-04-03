import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';

export enum SettingsDialogScreen {
  Settings,
  BackupSecretPhrase,
  ChangeWalletPassword,
}
export interface SettingsDialog {
  settingsDialogScreen: SettingsDialogScreen;
  password?: string;
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
    setPassword: (state: Draft<SettingsDialog>, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
  },
});

export const settingsDialogActions = settingsDialogSlice.actions;

export default settingsDialogSlice;
