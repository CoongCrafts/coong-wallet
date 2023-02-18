import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import accountsSlice from 'redux/slices/accounts';
import appSlice from 'redux/slices/app';
import setupWalletSlice from 'redux/slices/setup-wallet';

const appPersistConfig = {
  key: 'app',
  storage: storage,
  whitelist: ['locked', 'lastUsedAt', 'addressPrefix'],
};

const rootReducer = combineReducers({
  [appSlice.name]: persistReducer(appPersistConfig, appSlice.reducer),
  [setupWalletSlice.name]: setupWalletSlice.reducer,
  [accountsSlice.name]: accountsSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
