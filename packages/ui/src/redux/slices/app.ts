import { createSlice, Draft } from '@reduxjs/toolkit';

export interface AppState {
  ready: boolean;
  seedReady: boolean;
  locked: boolean;
}

const initialState: AppState = {
  ready: false,
  seedReady: false,
  locked: true,
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
    lock: (state: Draft<AppState>) => {
      state.locked = true;
    },
    unlock: (state: Draft<AppState>) => {
      state.locked = false;
    },
  },
});

export const appActions = appSlice.actions;
export default appSlice;
