import { NewWalletScreenStep } from 'components/pages/NewWallet/types';
import { createSlice } from '@reduxjs/toolkit';

export interface SetupWalletState {
  newWalletScreenStep: NewWalletScreenStep;
  password?: string;
  passwordConfirmation?: string;
  secretPhrase?: string;
}

const initialState: SetupWalletState = {
  newWalletScreenStep: NewWalletScreenStep.ChooseWalletPassword,
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
      state.newWalletScreenStep = NewWalletScreenStep.ConfirmWalletPassword;
    },
  },
});

export const setupWalletActions = setupWalletSlice.actions;
export default setupWalletSlice;
