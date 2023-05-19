import { injectExtension } from '@polkadot/extension-inject';
import { Injected } from '@polkadot/extension-inject/types';
import { assert } from '@coong/utils';
import CoongSdk from './CoongSdk';
import SubstrateInjected from './injection/Injected';
import WalletInstance from './wallet/WalletInstance';

export const enable = async (appName: string): Promise<Injected> => {
  const sdkInstance = CoongSdk.instance();
  const sendMessage = sdkInstance.sendMessage.bind(sdkInstance);

  try {
    await sendMessage({ name: 'embed/accessAuthorized', body: { appName } });
  } catch (e: any) {
    await sendMessage({ name: 'tab/requestAccess', body: { appName } });
  }

  return new SubstrateInjected(sendMessage);
};

export const injectWalletAPI = (walletInstance: WalletInstance) => {
  const walletInfo = walletInstance.walletInfo;
  assert(walletInfo, `Unknown wallet info!`);

  const { name, version } = walletInfo!;

  injectExtension(enable, {
    name,
    version,
  });
};
