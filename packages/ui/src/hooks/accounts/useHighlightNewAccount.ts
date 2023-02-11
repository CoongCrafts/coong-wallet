import { useEffect, useState } from 'react';
import { AccountInfo } from '@coong/keyring/types';

export default function useHighlightNewAccount() {
  const [newAccount, setNewAccount] = useState<AccountInfo>();

  useEffect(() => {
    if (!newAccount) {
      return;
    }

    const accountCard = document.getElementById(newAccount.address);
    if (!accountCard) {
      return;
    }

    accountCard.scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
      accountCard.classList.add('bg-primary/20');
    }, 100);

    setTimeout(() => {
      accountCard.classList.remove('bg-primary/20');
    }, 3000);

    setNewAccount(undefined);
  }, [newAccount]);

  return { setNewAccount };
}
