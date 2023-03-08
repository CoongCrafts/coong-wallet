import { generateMnemonic } from '@polkadot/util-crypto/mnemonic/bip39';
import Keyring from '@coong/keyring';
import { render, screen } from '__tests__/testUtils';
import { beforeEach } from 'vitest';
import LockWalletButton from '../LockWalletButton';

describe('LockWalletButton', () => {
  describe('keyring not initialized', () => {
    it('should be hidden', () => {
      render(<LockWalletButton />, { preloadedState: { app: { seedReady: false, ready: true, locked: false } } });
      expect(screen.queryByTitle('Lock the wallet')).not.toBeInTheDocument();
    });
  });

  describe('keyring initialized', () => {
    beforeEach(async () => {
      const keyring = new Keyring();
      console.log('initialized', await keyring.initialized());
      if (!(await keyring.initialized())) {
        await keyring.initialize(generateMnemonic(12), 'PASSWORD');
      }
    });

    it('should be hidden if the wallet is locked', () => {
      render(<LockWalletButton />, { preloadedState: { app: { seedReady: true, ready: true, locked: true } } });
      expect(screen.queryByTitle('Lock the wallet')).not.toBeInTheDocument();
    });

    it('should be visible if the wallet is unlocked', () => {
      const keyring = new Keyring();
      keyring.initialize(generateMnemonic(12), 'PASSWORD');

      render(<LockWalletButton />, { preloadedState: { app: { seedReady: true, ready: true, locked: false } } });
      expect(screen.queryByTitle('Lock the wallet')).toBeInTheDocument();
    });
  });
});
