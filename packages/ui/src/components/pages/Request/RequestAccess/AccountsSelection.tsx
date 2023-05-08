import { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { CheckBox, DoneAll, RemoveDone } from '@mui/icons-material';
import { Button, IconButton, styled, Theme, useMediaQuery } from '@mui/material';
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

interface AccountsSelectionProps extends Props {
  showNewAccountButton?: boolean;
  showBothSelectionButtons?: boolean;
}

interface SelectionButton {
  showBothSelectionButtons?: boolean;
}

const SelectAllButton = ({ showBothSelectionButtons }: SelectionButton) => {
  const accounts = useAccounts();
  const { t } = useTranslation();
  const { selectedAccounts } = useSelector((state: RootState) => state.accounts);
  const dispatch = useDispatch();
  const xs = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

  if (!showBothSelectionButtons && accounts.length === selectedAccounts.length) {
    return null;
  }

  const doSelectAll = () => {
    dispatch(accountsActions.addSelectedAccounts(accounts));
  };

  if (xs) {
    return (
      <IconButton size='small' color='primary' onClick={doSelectAll}>
        <DoneAll />
      </IconButton>
    );
  }

  return (
    <Button size='small' variant='outlined' onClick={doSelectAll} startIcon={<DoneAll />}>
      {t<string>('Select all')}
    </Button>
  );
};

const DeselectAllButton = ({ showBothSelectionButtons }: SelectionButton) => {
  const accounts = useAccounts();
  const { t } = useTranslation();
  const { selectedAccounts } = useSelector((state: RootState) => state.accounts);
  const dispatch = useDispatch();
  const xs = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

  if (!showBothSelectionButtons && accounts.length !== selectedAccounts.length) {
    return null;
  }

  const doDeselectAll = () => {
    dispatch(accountsActions.removeSelectedAccounts(accounts));
  };

  if (xs) {
    return (
      <IconButton size='small' onClick={doDeselectAll}>
        <RemoveDone />
      </IconButton>
    );
  }

  return (
    <Button size='small' variant='outlined' onClick={doDeselectAll} startIcon={<RemoveDone />}>
      {t<string>('Deselect all')}
    </Button>
  );
};

const AccountsSelection: FC<AccountsSelectionProps> = ({
  className,
  showNewAccountButton,
  showBothSelectionButtons,
}) => {
  const { t } = useTranslation();
  const { selectedAccounts } = useSelector((state: RootState) => state.accounts);
  const { displayAccounts, query, setQuery } = useSearchAccounts();
  const { setNewAccount } = useHighlightNewAccount();

  return (
    <div className={`${className} accounts-selection`}>
      <div className='accounts-selection--top gap-4'>
        <SearchBox onChange={(query) => setQuery(query)} size='xxs' label={t<string>('Search by name')} />
        <div className='flex gap-4 sm:gap-2'>
          <DeselectAllButton showBothSelectionButtons={showBothSelectionButtons} />
          <SelectAllButton showBothSelectionButtons={showBothSelectionButtons} />
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
            <Trans values={{ numberOfAccounts: selectedAccounts.length }} shouldUnescape>
              {'{{numberOfAccounts}} account(s) selected'}
            </Trans>
          ) : (
            <span>{t<string>('No accounts selected')}</span>
          )}
        </div>
        {showNewAccountButton && <NewAccountButton onCreated={(account) => setTimeout(() => setNewAccount(account))} />}
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
