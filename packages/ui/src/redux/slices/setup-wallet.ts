import { createSlice } from '@reduxjs/toolkit';
import { NewWalletScreenStep, RestoreWalletScreenStep } from 'types';

export interface SetupWalletState {
  newWalletScreenStep: NewWalletScreenStep;
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
    setStep: (state, action) => {
      state.newWalletScreenStep = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setRestoreWalletScreenStep: (state, action) => {
      state.restoreWalletScreenStep = action.payload;
    },
    setSecretPhrase: (state, action) => {
      state.secretPhrase = action.payload;
    },
  },
});

export const setupWalletActions = setupWalletSlice.actions;
export default setupWalletSlice;
