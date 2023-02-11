import { FC } from 'react';
import { styled } from '@mui/material';
import AccountCard from 'components/pages/Accounts/AccountCard';
import NewAccountButton from 'components/shared/NewAccountButton';
import PageTitle from 'components/shared/PageTitle';
import useAccounts from 'hooks/accounts/useAccounts';
import useHighlightNewAccount from 'hooks/accounts/useHighlightNewAccount';
import { Props } from 'types';

const Index: FC<Props> = ({ className = '' }) => {
  const accounts = useAccounts();
  const { setNewAccount } = useHighlightNewAccount();

  return (
    <div className={className}>
      <header className='page-header'>
        <PageTitle>Accounts {accounts.length >= 5 && <span>({accounts.length})</span>}</PageTitle>
        <div className='page-header__actions'>
          <NewAccountButton onCreated={setNewAccount} />
        </div>
      </header>
      <div className='page-content'>
        {accounts.map((account) => (
          <AccountCard key={account.address} account={account} />
        ))}
      </div>
    </div>
  );
};

export default styled(Index)`
  header.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .page-content {
    margin-top: 0.5rem;
  }
`;
