import { WalletInfo } from '@coong/base/types';
import { packageInfo } from 'packageInfo';
import { randomWalletInstanceId } from 'utils/string';

export const walletInfo: WalletInfo = {
  name: 'coong',
  version: packageInfo.version,
  instanceId: randomWalletInstanceId(),
};
