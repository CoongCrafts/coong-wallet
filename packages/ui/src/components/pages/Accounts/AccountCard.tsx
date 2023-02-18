import { Identicon } from '@polkadot/react-identicon';
import { FC } from 'react';
import { AccountInfo } from '@coong/keyring/types';
import { styled } from '@mui/material';
import AccountAddress from 'components/pages/Accounts/AccountAddress';
import CopyAddressTooltip from 'components/shared/CopyAddressTooltip';
import { Props } from 'types';

interface AccountCardProps extends Props {
  account: AccountInfo;
}

const AccountCard: FC<AccountCardProps> = ({ className = '', account }) => {
  const { address, name } = account;

  return (
    <div id={address} className={`${className} account-card transition-colors duration-200`}>
      <div className='account-card--icon'>
        <CopyAddressTooltip address={address} name={name}>
          <Identicon value={address} size={36} theme='polkadot' />
        </CopyAddressTooltip>
      </div>
      <div>
        <div className='account-card__name'>{name}</div>
        <AccountAddress address={address} name={name} />
      </div>
    </div>
  );
};

export default styled(AccountCard)`
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;

  .account-card--icon {
    font-size: 0;
  }

  .account-card__name {
    font-weight: 600;
    font-size: 1.1rem;
  }

  .account-card__address {
    font-size: 0.8rem;
  }
`;
