import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { RootState } from 'redux/store';

export default function useDisplayAddress(address: string) {
  const { addressPrefix } = useSelector((state: RootState) => state.app);
  const [displayAddress, setDisplayAddress] = useState<string>(address);

  useEffect(() => {
    const publicKey = decodeAddress(address);
    setDisplayAddress(encodeAddress(publicKey, addressPrefix));
  }, [addressPrefix]);

  return displayAddress;
}
