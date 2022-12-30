import { FC } from 'react';
import { Props } from 'types';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { styled } from '@mui/material';
import { Identicon } from '@polkadot/react-identicon';

interface AccountCardProps extends Props {
  account: KeyringAddress;
}

const AccountCard: FC<AccountCardProps> = ({ className = '', account }) => {
  const { address, meta } = account;
  return (
    <div className={`${className} account-card`}>
      <div className='account-card--icon'>
        <Identicon value={address} size={42} theme='polkadot' />
      </div>
      <div>
        <div className='account-card__name'>{meta.name}</div>
        <div className='account-card__address'>{address}</div>
      </div>
    </div>
  );
};

export default styled(AccountCard)`
  border: 1px solid #e0e0e0;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

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
