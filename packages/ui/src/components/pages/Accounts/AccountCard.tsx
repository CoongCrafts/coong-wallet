import { Identicon } from '@polkadot/react-identicon';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Chip, styled } from '@mui/material';
import AccountAddress from 'components/pages/Accounts/AccountAddress';
import AccountControls from 'components/pages/Accounts/AccountControls';
import ShowAddressQrCodeButton from 'components/pages/Accounts/ShowAddressQrCodeButton';
import CopyAddressTooltip from 'components/shared/CopyAddressTooltip';
import { AccountInfoExt, Props } from 'types';

interface ImportedLabelProps extends Props {
  isExternal: boolean | undefined;
}

const ImportedLabel: FC<ImportedLabelProps> = ({ isExternal, className = '' }) => {
  const { t } = useTranslation();

  return isExternal ? (
    <Chip
      label={t<string>('IMPORTED')}
      size='small'
      className={`${className} font-bold text-[10px] border border-black/10 dark:border-white/15`}
      sx={{
        border: '1px solid',
      }}
    />
  ) : (
    <></>
  );
};

interface AccountCardProps extends Props {
  account: AccountInfoExt;
  showAccountControls?: boolean;
}

const AccountCard: FC<AccountCardProps> = ({ className = '', account, showAccountControls }) => {
  const { networkAddress, name, isExternal } = account;

  return (
    <div
      id={networkAddress}
      className={`${className} account-card transition-colors duration-200 border border-black/10 dark:border-white/15`}>
      <div className='flex items-center gap-2'>
        <div className='account-card--icon'>
          <CopyAddressTooltip address={networkAddress} name={name}>
            <Identicon value={networkAddress} size={32} theme='polkadot' />
          </CopyAddressTooltip>
        </div>
        <div>
          <div className='account-card__name'>
            {name}
            <ImportedLabel isExternal={isExternal} className='hidden sm:inline-block pt-1' />
          </div>
          <AccountAddress address={networkAddress} name={name} className='text-xs' />
          <ImportedLabel isExternal={isExternal} className='sm:hidden my-2' />
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
    justify-content: space-between;
  }

  .account-card__address {
    font-size: 0.8rem;
  }
`;
