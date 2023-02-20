import { useEffect, useState } from 'react';
import useAccounts from 'hooks/accounts/useAccounts';
import { AccountInfoExt } from 'types';

const filterAccount = (account: AccountInfoExt, query: string): boolean => {
  return !!account.name && account.name.toLowerCase().includes(query.toLowerCase());
};

export default function useSearchAccounts() {
  const accounts = useAccounts();
  const [displayAccounts, setDisplayAccounts] = useState<AccountInfoExt[]>([]);
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
