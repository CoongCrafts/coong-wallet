import { WalletInfo } from '@coong/base/types';
import { packageInfo } from 'packageInfo';

const randomWalletInstanceId = (): string => {
  return `coong/instance-${Math.floor(Math.random() * 1_0000_000)}`;
};

export const walletInfo: WalletInfo = {
  name: 'coongwallet',
  version: packageInfo.version,
  instanceId: randomWalletInstanceId(),
};
