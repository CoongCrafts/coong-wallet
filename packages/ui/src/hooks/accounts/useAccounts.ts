import { useDispatch, useSelector } from 'react-redux';
import { useEffectOnce } from 'react-use';
import { keyring } from '@coong/base';
import { accountsActions } from 'redux/slices/accounts';
import { RootState } from 'redux/store';

export default function useAccounts() {
  const { accounts } = useSelector((state: RootState) => state.accounts);
  const dispatch = useDispatch();

  useEffectOnce(() => {
    const subscription = keyring.accountsStore.subject.subscribe(async () => {
      dispatch(accountsActions.setAccounts(await keyring.getAccounts()));
    });

    return () => subscription.unsubscribe();
  });

  return accounts;
}
