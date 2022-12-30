import { Button, styled } from '@mui/material';
import PageTitle from 'components/shared/PageTitle';
import { FC, useState } from 'react';
import { Props } from 'types';
import { Add } from '@mui/icons-material';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { useAsync, useEffectOnce } from 'react-use';
import keyring from 'keyring';
import AccountCard from 'components/pages/Accounts/AccountCard';

const Index: FC<Props> = ({ className = '' }) => {
  const [accounts, setAccounts] = useState<KeyringAddress[]>([]);

  useAsync(async () => {
    setAccounts(await keyring.getAccounts());
  }, []);

  return (
    <div className={className}>
      <header className='page-header'>
        <PageTitle title='Accounts' />
        <div className='page-header__actions'>
          <Button size='small' variant='outlined' startIcon={<Add />}>
            New Account
          </Button>
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
