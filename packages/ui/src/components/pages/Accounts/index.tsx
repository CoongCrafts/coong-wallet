import { FC } from 'react';
import AccountCard from 'components/pages/Accounts/AccountCard';
import NewAccountButton from 'components/shared/NewAccountButton';
import PageTitle from 'components/shared/PageTitle';
import useAccounts from 'hooks/accounts/useAccounts';
import useHighlightNewAccount from 'hooks/accounts/useHighlightNewAccount';
import { Props } from 'types';

const Accounts: FC<Props> = ({ className = '' }) => {
  const accounts = useAccounts();
  const { setNewAccount } = useHighlightNewAccount();

  return (
    <div className={className}>
      <header className='flex justify-between items-center'>
        <PageTitle>Accounts {accounts.length >= 5 && <span>({accounts.length})</span>}</PageTitle>
        <div>
          <NewAccountButton onCreated={setNewAccount} />
        </div>
      </header>
      <div className='mt-2'>
        {accounts.map((account) => (
          <AccountCard key={account.address} account={account} />
        ))}
      </div>
    </div>
  );
};

export default Accounts;
