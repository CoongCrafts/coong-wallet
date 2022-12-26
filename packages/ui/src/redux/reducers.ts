import appSlice from 'redux/slices/app';

const slices = [appSlice];

export default slices.reduce((reducers, slice) => {
  reducers[slice.name] = slice.reducer;
  return reducers;
}, {} as any);
