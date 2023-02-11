import { createSlice, Draft } from '@reduxjs/toolkit';

export interface AppState {
  ready: boolean;
  seedReady: boolean;
  locked: boolean;
  lastUsedAt: number | null;
}

const initialState: AppState = {
  ready: false,
  seedReady: false,
  locked: true,
  lastUsedAt: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    appReady: (state: Draft<AppState>) => {
      state.ready = true;
    },
    seedReady: (state: Draft<AppState>) => {
      state.seedReady = true;
    },
    lock: (state: Draft<AppState>) => {
      state.locked = true;
    },
    unlock: (state: Draft<AppState>) => {
      state.locked = false;
    },
    recordLastUsedAt(state: Draft<AppState>) {
      state.lastUsedAt = Date.now();
    },
  },
});

export const appActions = appSlice.actions;
export default appSlice;
