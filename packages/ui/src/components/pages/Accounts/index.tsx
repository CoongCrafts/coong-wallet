import { FC } from 'react';
import AccountCard from 'components/pages/Accounts/AccountCard';
import NewAccountButton from 'components/shared/NewAccountButton';
import PageTitle from 'components/shared/PageTitle';
import SearchBox from 'components/shared/accounts/SearchBox';
import useHighlightNewAccount from 'hooks/accounts/useHighlightNewAccount';
import useSearchAccounts from 'hooks/accounts/useSearchAccounts';
import { Props } from 'types';

const Accounts: FC<Props> = ({ className = '' }) => {
  const { setNewAccount } = useHighlightNewAccount();
  const { accounts, displayAccounts, query, setQuery } = useSearchAccounts();

  return (
    <div className={className}>
      <header className='flex justify-between items-center'>
        <PageTitle>Accounts {accounts.length >= 5 && <span>({accounts.length})</span>}</PageTitle>
        <div>
          <NewAccountButton onCreated={setNewAccount} />
        </div>
      </header>
      <div className='mt-2'>
        <div className='my-2'>
          <SearchBox onChange={(query) => setQuery(query)} />
        </div>
        <div>
          {displayAccounts.map((account) => (
            <AccountCard key={account.address} account={account} />
          ))}
          {displayAccounts.length === 0 && (
            <p className='text-gray-500 my-4'>
              No accounts meet search query: <strong>{query}</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Accounts;
