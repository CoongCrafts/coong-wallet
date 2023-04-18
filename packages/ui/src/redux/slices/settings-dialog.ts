import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { SettingsDialogScreen } from 'types';

export interface SettingsDialog {
  screen: SettingsDialogScreen;
  open: boolean;
  verifiedPassword?: string | null;
  onChangingPassword: boolean;
}

const initialState: SettingsDialog = {
  screen: SettingsDialogScreen.SettingsWallet,
  open: false,
  onChangingPassword: false,
};

const resetState = (state: Draft<SettingsDialog>) => {
  state.screen = SettingsDialogScreen.SettingsWallet;
  state.onChangingPassword = false;
  state.verifiedPassword = null;
};

const settingsDialogSlice = createSlice({
  name: 'settingsDialog',
  initialState,
  reducers: {
    open: (state: Draft<SettingsDialog>) => {
      resetState(state);
      state.open = true;
    },
    close: (state: Draft<SettingsDialog>) => {
      state.open = false;
    },
    resetState,
    switchScreen: (state: Draft<SettingsDialog>, action: PayloadAction<SettingsDialogScreen>) => {
      state.screen = action.payload;
    },
    setVerifiedPassword: (state: Draft<SettingsDialog>, action: PayloadAction<string | null>) => {
      state.verifiedPassword = action.payload;
    },
    setOnChangingPassword: (state: Draft<SettingsDialog>, action: PayloadAction<boolean>) => {
      state.onChangingPassword = action.payload;
    },
  },
});

export const settingsDialogActions = settingsDialogSlice.actions;

export default settingsDialogSlice;
