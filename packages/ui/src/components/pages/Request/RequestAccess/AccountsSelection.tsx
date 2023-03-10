import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, styled } from '@mui/material';
import NewAccountButton from 'components/shared/NewAccountButton';
import NoAccountsPlaceholder from 'components/shared/accounts/NoAccountsPlaceholder';
import SearchBox from 'components/shared/accounts/SearchBox';
import SelectableAccountCard from 'components/shared/accounts/SelectableAccountCard';
import useAccounts from 'hooks/accounts/useAccounts';
import useHighlightNewAccount from 'hooks/accounts/useHighlightNewAccount';
import useSearchAccounts from 'hooks/accounts/useSearchAccounts';
import { accountsActions } from 'redux/slices/accounts';
import { RootState } from 'redux/store';
import { Props } from 'types';

const AccountsSelection: FC<Props> = ({ className }) => {
  const accounts = useAccounts();
  const dispatch = useDispatch();
  const { selectedAccounts } = useSelector((state: RootState) => state.accounts);
  const { displayAccounts, query, setQuery } = useSearchAccounts();
  const { setNewAccount } = useHighlightNewAccount();

  const doSelectAll = () => {
    dispatch(accountsActions.addSelectedAccounts(accounts));
  };

  const doDeselectAll = () => {
    dispatch(accountsActions.removeSelectedAccounts(accounts));
  };

  return (
    <div className={`${className} accounts-selection`}>
      <div className='accounts-selection--top'>
        <SearchBox onChange={(query) => setQuery(query)} size='xxs' />
        <div>
          {accounts.length > selectedAccounts.length && (
            <Button size='small' variant='outlined' onClick={doSelectAll}>
              Select all
            </Button>
          )}
          {accounts.length == selectedAccounts.length && (
            <Button size='small' variant='outlined' onClick={doDeselectAll}>
              Deselect all
            </Button>
          )}
        </div>
      </div>
      <div className='accounts-selection--list'>
        {displayAccounts.map((account) => (
          <SelectableAccountCard key={account.address} account={account} />
        ))}
        {displayAccounts.length === 0 && <NoAccountsPlaceholder query={query} />}
      </div>
      <div className='accounts-selection--bottom' data-testid='number-of-selected-accounts'>
        <div>
          {selectedAccounts.length ? (
            <span>
              <strong>{selectedAccounts.length}</strong> account(s) selected
            </span>
          ) : (
            <span>No accounts selected</span>
          )}
        </div>
        <NewAccountButton onCreated={(account) => setTimeout(() => setNewAccount(account))} />
      </div>
    </div>
  );
};

export default styled(AccountsSelection)`
  margin-bottom: 1rem;

  .accounts-selection {
    &--list {
      max-height: 392px;
      overflow-y: auto;
    }

    &--top,
    &--bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &--top {
      margin-bottom: 0.5rem;
    }

    &--bottom {
      margin-top: 0.5rem;
    }
  }
`;
