import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffectOnce } from 'react-use';
import { encodeAddress } from '@polkadot/util-crypto';
import { AccountInfo } from '@coong/keyring/types';
import { useWalletState } from 'contexts/WalletStateContext';
import { accountsActions } from 'redux/slices/accounts';
import { RootState } from 'redux/store';
import { AccountInfoExt } from 'types';

export default function useAccounts() {
  const { keyring } = useWalletState();
  const { addressPrefix } = useSelector((state: RootState) => state.app);
  const { accounts } = useSelector((state: RootState) => state.accounts);
  const dispatch = useDispatch();

  const setAccounts = (newAccounts: AccountInfo[]) => {
    const newExtendedAccounts: AccountInfoExt[] = newAccounts.map((one) => ({
      ...one,
      networkAddress: encodeAddress(one.address, addressPrefix),
    }));

    dispatch(accountsActions.setAccounts(newExtendedAccounts));
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
