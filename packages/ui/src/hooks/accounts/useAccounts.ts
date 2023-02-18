import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffectOnce } from 'react-use';
import { encodeAddress } from '@polkadot/util-crypto';
import { keyring } from '@coong/base';
import { AccountInfo } from '@coong/keyring/types';
import { accountsActions } from 'redux/slices/accounts';
import { RootState } from 'redux/store';

export default function useAccounts() {
  const { addressPrefix } = useSelector((state: RootState) => state.app);
  const { accounts } = useSelector((state: RootState) => state.accounts);
  const dispatch = useDispatch();

  const setAccounts = (newAccounts: AccountInfo[]) => {
    newAccounts = newAccounts.map((one) => ({ ...one, address: encodeAddress(one.address, addressPrefix) }));
    dispatch(accountsActions.setAccounts(newAccounts));
  };

  useEffectOnce(() => {
    const subscription = keyring.accountsStore.subject.subscribe(async () => {
      setAccounts(await keyring.getAccounts());
    });

    return () => subscription.unsubscribe();
  });

  useEffect(() => {
    setAccounts(accounts);
  }, [addressPrefix]);

  return accounts;
}
