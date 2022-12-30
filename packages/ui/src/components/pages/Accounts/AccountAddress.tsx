import { FC, useEffect, useState } from 'react';
import { Props } from 'types';
import { styled } from '@mui/material';
import { useWindowSize } from 'react-use';
import { shortenAddress } from 'utils/string';

interface AccountAddressProps extends Props {
  address: string;
}

const AccountAddress: FC<AccountAddressProps> = ({ className, address }) => {
  const { width } = useWindowSize();
  const [displayAddress, setDisplayAddress] = useState('');

  useEffect(() => {
    if (width < 500) {
      setDisplayAddress(shortenAddress(address));
    } else {
      setDisplayAddress(address);
    }
  }, [width]);

  return <div className={className}>{displayAddress || <span>&nbsp;</span>}</div>;
};

export default styled(AccountAddress)`
  font-size: 0.8rem;
`;
