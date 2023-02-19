import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { AccountInfoExt } from 'types';

export interface AccountsState {
  accounts: AccountInfoExt[];
  selectedAccounts: AccountInfoExt[];
}

const initialState: AccountsState = {
  accounts: [],
  selectedAccounts: [],
};

const removeSelectedAccounts = (state: Draft<AccountsState>, action: PayloadAction<AccountInfoExt[]>) => {
  const toRemoveAddresses = action.payload.map((one) => one.address);
  state.selectedAccounts = state.selectedAccounts.filter((one) => !toRemoveAddresses.includes(one.address));
};

const addSelectedAccounts = (state: Draft<AccountsState>, action: PayloadAction<AccountInfoExt[]>) => {
  removeSelectedAccounts(state, action);
  state.selectedAccounts.push(...action.payload);
};

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setAccounts: (state: Draft<AccountsState>, action: PayloadAction<AccountInfoExt[]>) => {
      state.accounts = action.payload;
    },
    addSelectedAccounts,
    removeSelectedAccounts,
  },
});

export const accountsActions = accountsSlice.actions;
export default accountsSlice;
