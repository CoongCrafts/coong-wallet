import { Identicon } from '@polkadot/react-identicon';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material';
import AccountAddress from 'components/pages/Accounts/AccountAddress';
import AccountControls from 'components/pages/Accounts/AccountControls';
import ShowAddressQrCodeButton from 'components/pages/Accounts/ShowAddressQrCodeButton';
import CopyAddressTooltip from 'components/shared/CopyAddressTooltip';
import { AccountInfoExt, Props } from 'types';

const UNKNOWN_NAME = '<unknown>';

interface ImportedLabelProps extends Props {
  show?: boolean;
}

const ImportedLabel: FC<ImportedLabelProps> = ({ show, className = '' }) => {
  const { t } = useTranslation();

  if (!show) {
    return null;
  }

  return (
    <div
      className={`${className} text-[10px] text-center leading-[20px] font-bold rounded-xl px-2 border border-black/10 dark:border-white/15 bg-black/10 dark:bg-white/15`}>
      {t<string>('IMPORTED')}
    </div>
  );
};

interface AccountCardProps extends Props {
  account: AccountInfoExt;
  showAccountControls?: boolean;
}

const AccountCard: FC<AccountCardProps> = ({ className = '', account, showAccountControls }) => {
  const { networkAddress, name = UNKNOWN_NAME, isExternal } = account;

  return (
    <div
      id={networkAddress}
      className={`${className} account-card transition-colors duration-200 border border-black/10 dark:border-white/15`}>
      <div className='flex items-center gap-2'>
        <div className='account-card--icon'>
          <CopyAddressTooltip address={networkAddress} name={name}>
            <Identicon value={networkAddress} size={36} theme='polkadot' />
          </CopyAddressTooltip>
        </div>
        <div className='flex flex-col gap-1'>
          <div className='account-card__name'>
            <span>{name}</span>
            <ImportedLabel show={isExternal} className='hidden sm:inline-flex' />
          </div>
          <AccountAddress address={networkAddress} name={name} className='text-xs' />
          <ImportedLabel show={isExternal} className='sm:hidden my-1 self-start' />
        </div>
      </div>
      {showAccountControls && (
        <div className='flex gap-1'>
          <ShowAddressQrCodeButton account={account} className='max-[300px]:hidden' />
          <AccountControls account={account} />
        </div>
      )}
    </div>
  );
};

export default styled(AccountCard)`
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  border-radius: 4px;

  .account-card--icon {
    font-size: 0;
  }

  .account-card__name {
    font-weight: 600;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .account-card__address {
    font-size: 0.8rem;
  }
`;
