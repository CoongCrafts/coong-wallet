import { Identicon } from '@polkadot/react-identicon';
import { FC } from 'react';
import { styled } from '@mui/material';
import AccountAddress from 'components/pages/Accounts/AccountAddress';
import CopyAddressTooltip from 'components/shared/CopyAddressTooltip';
import { AccountInfoExt, Props } from 'types';

interface AccountCardProps extends Props {
  account: AccountInfoExt;
}

const AccountCard: FC<AccountCardProps> = ({ className = '', account }) => {
  const { networkAddress, name } = account;

  return (
    <div id={networkAddress} className={`${className} account-card transition-colors duration-200 dark:border-slate-600`}>
      <div className='account-card--icon'>
        <CopyAddressTooltip address={networkAddress} name={name}>
          <Identicon value={networkAddress} size={36} theme='polkadot' />
        </CopyAddressTooltip>
      </div>
      <div>
        <div className='account-card__name'>{name}</div>
        <AccountAddress address={networkAddress} name={name} />
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
