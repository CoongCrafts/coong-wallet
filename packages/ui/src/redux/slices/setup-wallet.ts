import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NewWalletScreenStep, WalletRecoveryMethod, RestoreWalletScreenStep } from 'types';

export interface SetupWalletState {
  newWalletScreenStep: NewWalletScreenStep;
  restoreWalletMethod?: WalletRecoveryMethod;
  restoreWalletScreenStep: RestoreWalletScreenStep;
  password?: string;
  passwordConfirmation?: string;
  secretPhrase?: string;
}

const initialState: SetupWalletState = {
  newWalletScreenStep: NewWalletScreenStep.ChooseWalletPassword,
  restoreWalletScreenStep: RestoreWalletScreenStep.EnterSecretRecoveryPhrase,
};

const setupWalletSlice = createSlice({
  name: 'setupWallet',
  initialState,
  reducers: {
    setNewWalletScreenStep: (state, action: PayloadAction<NewWalletScreenStep>) => {
      state.newWalletScreenStep = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setRestoreWalletMethod: (state, action: PayloadAction<WalletRecoveryMethod>) => {
      state.restoreWalletMethod = action.payload;
    },
    clearRestoreWalletMethod: (state) => {
      state.restoreWalletMethod = undefined;
    },
    setRestoreWalletScreenStep: (state, action: PayloadAction<RestoreWalletScreenStep>) => {
      state.restoreWalletScreenStep = action.payload;
    },
    setSecretPhrase: (state, action: PayloadAction<string | undefined>) => {
      state.secretPhrase = action.payload;
    },
    resetState: (state) => {
      state.newWalletScreenStep = NewWalletScreenStep.ChooseWalletPassword;
      state.restoreWalletScreenStep = RestoreWalletScreenStep.EnterSecretRecoveryPhrase;
      state.password = '';
      state.secretPhrase = '';
    },
  },
});

export const setupWalletActions = setupWalletSlice.actions;
export default setupWalletSlice;
