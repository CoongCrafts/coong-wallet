import { Reducer } from '@reduxjs/toolkit';
import { ReducersMapObject } from 'redux';
import accountsSlice from 'redux/slices/accounts';
import appSlice from 'redux/slices/app';
import setupWalletSlice from 'redux/slices/setup-wallet';

type Reducers = Record<string, Reducer>;

const slices = [appSlice, setupWalletSlice, accountsSlice];

export default slices.reduce((reducers, slice) => {
  reducers[slice.name] = slice.reducer;
  return reducers;
}, {} as ReducersMapObject);
