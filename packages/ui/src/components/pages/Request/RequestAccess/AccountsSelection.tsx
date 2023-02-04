import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AccountInfo } from '@coong/keyring/types';
import { Search } from '@mui/icons-material';
import { Button, InputAdornment, styled, TextField } from '@mui/material';
import NewAccountButton from 'components/shared/NewAccountButton';
import SelectableAccountCard from 'components/shared/accounts/SelectableAccountCard';
import useAccounts from 'hooks/accounts/useAccounts';
import { accountsActions } from 'redux/slices/accounts';
import { RootState } from 'redux/store';
import { Props } from 'types';

const AccountsSelection: FC<Props> = ({ className }) => {
  const accounts = useAccounts();
  const dispatch = useDispatch();
  const { selectedAccounts } = useSelector((state: RootState) => state.accounts);
  const [displayAccounts, setDisplayAccounts] = useState<AccountInfo[]>([]);
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    setDisplayAccounts(accounts.filter((one) => one.name && one.name.toLowerCase().includes(query.toLowerCase())));
  }, [accounts, query]);

  const doSelectAll = () => {
    dispatch(accountsActions.addSelectedAccounts(accounts));
  };

  const doDeselectAll = () => {
    dispatch(accountsActions.removeSelectedAccounts(accounts));
  };

  return (
    <div className={`${className} accounts-selection`}>
      <div className='accounts-selection--top'>
        <div>
          <TextField
            hiddenLabel
            size='small'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Search fontSize='small' />
                </InputAdornment>
              ),
              className: 'pl-2 h-[30px] text-[0.8125rem]',
            }}
            placeholder='Search by name'
            onChange={(event) => {
              setQuery(event.target.value);
            }}
          />
        </div>
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
        {displayAccounts.length === 0 && (
          <p className='text-gray-500'>
            No accounts meet search query: <strong>{query}</strong>
          </p>
        )}
      </div>
      <div className='accounts-selection--bottom'>
        <div>
          {selectedAccounts.length ? (
            <span>
              <strong>{selectedAccounts.length}</strong> account(s) selected
            </span>
          ) : (
            <span>No accounts selected</span>
          )}
        </div>
        <NewAccountButton />
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
