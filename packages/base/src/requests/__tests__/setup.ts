import { generateMnemonic } from '@polkadot/util-crypto/mnemonic/bip39';
import WalletState, { AUTHORIZED_ACCOUNTS_KEY, AuthorizedApps } from '@coong/base/requests/WalletState';
import Keyring from '@coong/keyring';

export const PASSWORD = 'supersecretpassword';
export const MNEMONIC = generateMnemonic(12);

export const newKeyring = async () => {
  const keyring = new Keyring();
  await keyring.initialize(MNEMONIC, PASSWORD);

  return keyring;
};
export const newWalletState = async () => {
  const keyring = await newKeyring();
  return new WalletState(keyring);
};

export const setupAuthorizedApps = (state: WalletState, authorizedAccounts: string[] = [], appUrl?: string) => {
  const randomAppUrl = appUrl || 'https://random-app.com';
  const randomAppId = randomAppUrl.split('//')[1];

  const randomAppInfo = {
    name: 'Random App',
    url: randomAppUrl,
    authorizedAccounts: authorizedAccounts,
  };

  const authorizedApps: AuthorizedApps = {
    [randomAppId]: randomAppInfo,
  };

  localStorage.setItem(AUTHORIZED_ACCOUNTS_KEY, JSON.stringify(authorizedApps));

  if (state) {
    state.reloadState();
  }

  return { randomAppUrl, randomAppInfo, authorizedApps };
};
