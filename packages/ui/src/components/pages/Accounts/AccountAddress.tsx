import { FC, useEffect, useState } from 'react';
import { useWindowSize } from 'react-use';
import { styled } from '@mui/material';
import CopyAddressTooltip from 'components/shared/CopyAddressTooltip';
import { Props } from 'types';
import { shortenAddress } from 'utils/string';

interface AccountAddressProps extends Props {
  address: string;
  name?: string;
}

const AccountAddress: FC<AccountAddressProps> = ({ className, address, name }) => {
  const { width } = useWindowSize();
  const showShortAddress = width < 500;
  const getDisplayAddress = () => {
    return showShortAddress ? shortenAddress(address) : address;
  };

  const [displayAddress, setDisplayAddress] = useState(getDisplayAddress());

  useEffect(() => {
    setDisplayAddress(getDisplayAddress());
  }, [width]);

  return (
    <CopyAddressTooltip address={address} name={name}>
      <div className={className}>{displayAddress || <span>&nbsp;</span>}</div>
    </CopyAddressTooltip>
  );
};

export default styled(AccountAddress)`
  font-size: 0.8rem;
  cursor: copy;
`;
