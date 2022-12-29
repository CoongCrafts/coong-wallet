import { createSlice, Draft } from '@reduxjs/toolkit';

export interface AppState {
  ready: boolean;
  seedReady: boolean;
}

const initialState = (): AppState => {
  return { ready: false, seedReady: false };
};

const setAppReady = (state: Draft<AppState>) => {
  state.ready = true;
};

const setSeedReady = (state: Draft<AppState>) => {
  state.seedReady = true;
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppReady,
    setSeedReady,
  },
});

export const appActions = appSlice.actions;
export default appSlice;
