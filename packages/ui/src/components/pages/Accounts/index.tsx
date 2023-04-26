import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useBoolean } from 'react-use';
import { Search, SearchOff } from '@mui/icons-material';
import { IconButton, Theme, useMediaQuery } from '@mui/material';
import AccountCard from 'components/pages/Accounts/AccountCard';
import RemoveAccountDialog from 'components/pages/Accounts/AccountControls/RemoveAccountDialog';
import NetworksSelection from 'components/shared/NetworksSelection';
import NewAccountButton from 'components/shared/NewAccountButton';
import PageTitle from 'components/shared/PageTitle';
import NoAccountsPlaceholder from 'components/shared/accounts/NoAccountsPlaceholder';
import SearchBox from 'components/shared/accounts/SearchBox';
import useHighlightNewAccount from 'hooks/accounts/useHighlightNewAccount';
import useSearchAccounts from 'hooks/accounts/useSearchAccounts';
import { Props } from 'types';

const Accounts: FC<Props> = ({ className = '' }) => {
  const { accounts, displayAccounts, query, setQuery } = useSearchAccounts();
  const [showSearchBox, toggleSearchBox] = useBoolean(false);
  const xs = useMediaQuery<Theme>((theme) => theme.breakpoints.down('xs'));
  const { t } = useTranslation();
  const { setNewAccount } = useHighlightNewAccount();

  useEffect(() => {
    if (!xs) {
      toggleSearchBox(false);
    }
  }, [xs]);

  return (
    <div className={className}>
      <header className='flex justify-between items-center'>
        <PageTitle>
          {t<string>('Accounts')} {accounts.length >= 5 && <span>({accounts.length})</span>}
        </PageTitle>
        <div>
          <IconButton className='xs:hidden' color={showSearchBox ? 'default' : 'primary'} onClick={toggleSearchBox}>
            {showSearchBox ? <SearchOff /> : <Search />}
          </IconButton>
          <NewAccountButton onCreated={(newAccount) => setTimeout(() => setNewAccount(newAccount))} />
        </div>
      </header>
      <div className='mt-2 mb-20'>
        <div className='my-2 flex justify-between gap-x-4 gap-y-3 flex-col-reverse xs:flex-row'>
          {(showSearchBox || !xs) && (
            <SearchBox
              onChange={(query) => setQuery(query)}
              autoFocus={showSearchBox}
              label={t<string>('Search by name')}
            />
          )}
          <NetworksSelection />
        </div>
        <div>
          {displayAccounts.map((account) => (
            <AccountCard key={account.address} account={account} />
          ))}
          {displayAccounts.length === 0 && <NoAccountsPlaceholder query={query} />}
        </div>
      </div>
      <RemoveAccountDialog />
    </div>
  );
};

export default Accounts;
