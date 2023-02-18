import { availableNetworks } from '@polkadot/networks';
import { NetworkInfo } from 'types';

export const networks: NetworkInfo[] = availableNetworks.map(({ prefix, displayName, network }) => ({
  displayName,
  prefix,
  networkId: network,
}));

export const defaultNetwork: NetworkInfo = networks.find((one) => one.networkId === 'substrate')!;
