import { configureStore } from '@reduxjs/toolkit';
import accountsSlice from 'redux/slices/accounts';
import appSlice from 'redux/slices/app';
import setupWalletSlice from 'redux/slices/setup-wallet';

export const store = configureStore({
  reducer: {
    [appSlice.name]: appSlice.reducer,
    [setupWalletSlice.name]: setupWalletSlice.reducer,
    [accountsSlice.name]: accountsSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
