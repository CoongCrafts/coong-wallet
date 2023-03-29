import { combineReducers, configureStore, PreloadedState } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import accountsSlice from 'redux/slices/accounts';
import appSlice from 'redux/slices/app';
import settingsSlice from 'redux/slices/settings';
import setupWalletSlice from 'redux/slices/setup-wallet';

const appPersistConfig = {
  key: 'app',
  storage: storage,
  whitelist: ['locked', 'lastUsedAt', 'addressPrefix'],
};

const settingsPersistConfig = {
  key: 'settings',
  storage: storage,
  whitelist: ['themeMode', 'language', 'autoLockInterval'],
};

const rootReducer = combineReducers({
  [appSlice.name]: persistReducer(appPersistConfig, appSlice.reducer),
  [setupWalletSlice.name]: setupWalletSlice.reducer,
  [accountsSlice.name]: accountsSlice.reducer,
  [settingsSlice.name]: persistReducer(settingsPersistConfig, settingsSlice.reducer),
});

export const newStore = (preloadedState?: PreloadedState<any>) => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
    preloadedState,
  });
};

export const store = newStore();

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
