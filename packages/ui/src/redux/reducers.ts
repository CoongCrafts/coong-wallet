import appSlice from 'redux/slices/app';
import setupWalletSlice from 'redux/slices/setup-wallet';

const slices = [appSlice, setupWalletSlice];

export default slices.reduce((reducers, slice) => {
  reducers[slice.name] = slice.reducer;
  return reducers;
}, {} as any);
