import { generateMnemonic } from '@polkadot/util-crypto/mnemonic/bip39';
import Keyring from '@coong/keyring';
import WalletState, { AUTHORIZED_ACCOUNTS_KEY, AuthorizedApps } from '../WalletState';

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
    id: randomAppId,
    name: 'Random App',
    url: randomAppUrl,
    authorizedAccounts: authorizedAccounts,
    createdAt: Date.now(),
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
