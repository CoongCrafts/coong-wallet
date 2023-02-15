import { useEffect, useState } from 'react';
import { AccountInfo } from '@coong/keyring/types';
import useAccounts from 'hooks/accounts/useAccounts';

const filterAccount = (account: AccountInfo, query: string): boolean => {
  return !!account.name && account.name.toLowerCase().includes(query.toLowerCase());
};

export default function useSearchAccounts() {
  const accounts = useAccounts();
  const [displayAccounts, setDisplayAccounts] = useState<AccountInfo[]>([]);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    if (query) {
      setDisplayAccounts(accounts.filter((one) => filterAccount(one, query)));
    } else {
      setDisplayAccounts(accounts);
    }
  }, [accounts, query]);

  return { accounts, displayAccounts, query, setQuery };
}
