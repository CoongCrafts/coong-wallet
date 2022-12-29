import { createSlice, Draft } from '@reduxjs/toolkit';

export interface AppState {
  ready: boolean;
  seedReady: boolean;
}

const initialState: AppState = {
  ready: false,
  seedReady: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppReady: (state: Draft<AppState>) => {
      state.ready = true;
    },
    setSeedReady: (state: Draft<AppState>) => {
      state.seedReady = true;
    },
  },
});

export const appActions = appSlice.actions;
export default appSlice;
