import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useAccounts from 'hooks/accounts/useAccounts';
import { useWalletState } from 'providers/WalletStateProvider';
import { accountsActions } from 'redux/slices/accounts';
import { RootState } from 'redux/store';

export default function useSetSelectedAccounts(appUrl: string) {
  const { walletState } = useWalletState();
  const dispatch = useDispatch();
  const accounts = useAccounts();
  const { selectedAccounts } = useSelector((state: RootState) => state.accounts);

  useEffect(() => {
    if (accounts.length === 0 || selectedAccounts.length > 0) {
      return;
    }

    try {
      const { authorizedAccounts } = walletState.getAuthorizedApp(appUrl);
      const connectedAccounts = accounts.filter((one) => authorizedAccounts.includes(one.address));
      dispatch(accountsActions.setSelectedAccounts(connectedAccounts));
    } catch (e: any) {
      // ignore
    }
  }, [accounts]);
}
