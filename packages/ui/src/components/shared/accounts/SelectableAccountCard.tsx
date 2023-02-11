import { Identicon } from '@polkadot/react-identicon';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AccountInfo } from '@coong/keyring/types';
import { Check } from '@mui/icons-material';
import { styled } from '@mui/material';
import CopyAddressTooltip from 'components/shared/CopyAddressTooltip';
import { accountsActions } from 'redux/slices/accounts';
import { RootState } from 'redux/store';
import { Props } from 'types';
import { shortenAddress } from 'utils/string';

interface SelectableAccountCardProps extends Props {
  account: AccountInfo;
}

const SelectableAccountCard: FC<SelectableAccountCardProps> = ({ className = '', account }) => {
  const { selectedAccounts } = useSelector((state: RootState) => state.accounts);
  const dispatch = useDispatch();

  const { address, name } = account;

  const selected = selectedAccounts.map((one) => one.address).includes(account.address);
  const doSelect = () => {
    if (selected) {
      dispatch(accountsActions.removeSelectedAccounts([account]));
    } else {
      dispatch(accountsActions.addSelectedAccounts([account]));
    }
  };

  return (
    <div
      id={address}
      className={`${className} selectable-account-card ${selected ? 'selected' : ''}`}
      onClick={doSelect}>
      <div className='selectable-account-card__left'>
        <div className='selectable-account-card__icon'>
          <CopyAddressTooltip address={address} name={name}>
            <Identicon value={address} size={24} theme='polkadot' />
          </CopyAddressTooltip>
        </div>
        <div className='selectable-account-card__info'>
          <div className='selectable-account-card__name'>{name}</div>
          <div className='selectable-account-card__address'>({shortenAddress(address)})</div>
        </div>
      </div>
      <div className='selectable-account-card__right'>{selected && <Check />}</div>
    </div>
  );
};

export default styled(SelectableAccountCard)`
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  cursor: pointer;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background-color: rgba(104, 217, 96, 0.2);
  }

  &.selected {
    background-color: rgba(104, 217, 96, 0.5);
  }

  .selectable-account-card {
    &__left {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    &__icon,
    &__right {
      font-size: 0;
    }

    &__info {
      display: flex;
      align-items: center;
      font-size: 1rem !important;
      gap: 0.2rem;
    }

    &__name {
      font-weight: 600;
    }

    &__address {
      font-size: 0.8rem;
    }
  }
`;
