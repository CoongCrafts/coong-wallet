import { styled } from '@mui/material';
import PageTitle from 'components/shared/PageTitle';
import { FC, useState } from 'react';
import { Props } from 'types';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { useAsync } from 'react-use';
import { keyring } from '@coong/base';
import AccountCard from 'components/pages/Accounts/AccountCard';
import NewAccountButton from 'components/shared/NewAccountButton';

const Index: FC<Props> = ({ className = '' }) => {
  const [accounts, setAccounts] = useState<KeyringAddress[]>([]);

  useAsync(async () => {
    setAccounts(await keyring.getAccounts());
  }, []);

  const onNewAccountCreated = async () => {
    setAccounts(await keyring.getAccounts());
  };

  return (
    <div className={className}>
      <header className='page-header'>
        <PageTitle>Accounts {accounts.length >= 5 && <span>({accounts.length})</span>}</PageTitle>
        <div className='page-header__actions'>
          <NewAccountButton onCreated={onNewAccountCreated} />
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
