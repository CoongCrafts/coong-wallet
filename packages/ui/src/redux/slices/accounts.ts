import { AccountInfo } from '@coong/keyring/types';
import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';

export interface AccountsState {
  accounts: AccountInfo[];
  selectedAccounts: AccountInfo[];
}

const initialState: AccountsState = {
  accounts: [],
  selectedAccounts: [],
};

const removeSelectedAccounts = (state: Draft<AccountsState>, action: PayloadAction<AccountInfo[]>) => {
  const toRemoveAddresses = action.payload.map((one) => one.address);
  state.selectedAccounts = state.selectedAccounts.filter((one) => !toRemoveAddresses.includes(one.address));
};

const addSelectedAccounts = (state: Draft<AccountsState>, action: PayloadAction<AccountInfo[]>) => {
  removeSelectedAccounts(state, action);
  state.selectedAccounts.push(...action.payload);
};

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setAccounts: (state: Draft<AccountsState>, action: PayloadAction<AccountInfo[]>) => {
      state.accounts = action.payload;
    },
    addSelectedAccounts,
    removeSelectedAccounts,
  },
});

export const accountsActions = accountsSlice.actions;
export default accountsSlice;
