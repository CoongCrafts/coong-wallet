import { encodeAddress } from '@polkadot/util-crypto';
import { defaultNetwork, networks } from '@coong/base';
import Keyring from '@coong/keyring';
import { AccountInfo } from '@coong/keyring/types';
import { UserEvent } from '@testing-library/user-event/setup/setup';
import { initializeKeyring, newUser, PASSWORD, render, screen, waitFor } from '__tests__/testUtils';
import Accounts from '../../index';

const preloadedState = { app: { addressPrefix: defaultNetwork.prefix } };

describe('AccountControls', () => {
  let user: UserEvent, testAccount: AccountInfo, keyring: Keyring;
  beforeEach(async () => {
    user = newUser();

    keyring = await initializeKeyring();

    testAccount = await keyring.createNewAccount('test-account', PASSWORD);

    render(<Accounts />, { preloadedState });

    await user.click(await screen.findByTitle(/Open account controls/));
  });
  describe('RemoveAccountDialog', () => {
    beforeEach(async () => {
      await user.click(await screen.findByRole('menuitem', { name: /Remove/ }));
    });

    it('should show content of `RemoveAccountDialog` correctly', async () => {
      expect(await screen.findByRole('dialog')).toBeInTheDocument();
      expect(await screen.findByText(`Remove account: ${testAccount.name}`)).toBeInTheDocument();
      expect(await screen.findByRole('button', { name: /Cancel/ })).toBeInTheDocument();
      expect(await screen.findByRole('button', { name: /Remove this account/ })).toBeInTheDocument();
    });

    it('should close the `RemoveAccountDialog` when clicking on `Cancel` button', async () => {
      const cancelButton = await screen.findByRole('button', { name: /Cancel/ });
      await user.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(screen.queryByText(`Remove account: ${testAccount.name}`)).not.toBeInTheDocument();
      });
    });
  });
  describe('RenameAccountDialog', () => {
    beforeEach(async () => {
      await user.click(await screen.findByRole('menuitem', { name: /Rename/ }));
    });

    it('should show content of `RenameAccountDialog` correctly', async () => {
      expect(await screen.findByRole('dialog', { name: /Rename account/ })).toBeInTheDocument();
      expect(await screen.findByLabelText(/Account name/)).toBeInTheDocument();
      expect(await screen.findByText(/test-account/)).toBeInTheDocument();
      expect(await screen.findByRole('button', { name: /Rename/ })).toBeDisabled();
    });

    it('should close `RenameAccountDialog` when clicking on `Cancel` button', async () => {
      const cancelButton = await screen.findByRole('button', { name: /Cancel/ });
      await user.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(screen.queryByText(/Rename account/)).not.toBeInTheDocument();
      });
    });

    it('should show error if account name invalid', async () => {
      const accountNameField = await screen.findByLabelText(/Account name/);

      await user.clear(accountNameField);
      expect(await screen.findByRole('button', { name: /Rename/ })).toBeDisabled();

      await user.type(accountNameField, 'Account-name-more-than-16-chars');
      expect(await screen.findByText(/Account name should not exceed 16 characters/)).toBeInTheDocument();
      expect(await screen.findByRole('button', { name: /Rename/ })).toBeDisabled();

      await keyring.createNewAccount('test-account-2', PASSWORD);
      await user.clear(accountNameField);
      await user.type(accountNameField, 'test-account-2');

      expect(await screen.findByText(/Account name is already picked/)).toBeInTheDocument();
      expect(await screen.findByRole('button', { name: /Rename/ })).toBeDisabled();
    });
  });
  describe('ShowAddressQrCodeDialog', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => null);
    beforeEach(async () => {
      await user.click(await screen.findByRole('menuitem', { name: /Show Address QR Code/ }));
    });

    it('should show content of `ShowAddressQrCodeDialog` correctly', async () => {
      expect(await screen.findByRole('dialog', { name: /Account address/ })).toBeInTheDocument();
      expect(await screen.findByTitle(/Account Address QR Code/)).toBeInTheDocument();
    });

    it('should change address format', async () => {
      const searchField = await screen.findAllByLabelText(/Address format/);
      await user.click(searchField[1]);

      const acalaOption = await screen.findByText(/Acala/);
      await user.click(acalaOption);

      expect(searchField[1]).toHaveDisplayValue(/Acala/);
      const { prefix } = networks.find((one) => one.displayName === 'Acala')!;
      expect(await screen.findByText(encodeAddress(testAccount.address, prefix))).toBeInTheDocument();
    });

    it('should hide the dialog', async () => {
      const closeButton = await screen.findByRole('button', { name: /Close/ });
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /Account address/ })).not.toBeInTheDocument();
      });
    });
  });
  describe('ExportAccountDialog', () => {
    beforeEach(async () => {
      await user.click(await screen.findByRole('menuitem', { name: /Export/ }));
    });

    it('should ask for password', async () => {
      expect(await screen.findByRole('dialog', { name: /Export account/ }));
      expect(await screen.findByLabelText(/Wallet password/));
      expect(await screen.findByRole('button', { name: /Continue/ }));
      expect(await screen.findByRole('button', { name: /Cancel/ }));
    });

    describe('password incorrect', () => {
      it('should show error when password incorrect', async () => {
        const passwordField = await screen.findByLabelText(/Wallet password/);
        await user.type(passwordField, 'incorrect-password');
        await user.click(await screen.findByRole('button', { name: /Continue/ }));

        expect(await screen.findByText(/Password incorrect/)).toBeInTheDocument();
      });
    });

    describe('password correct', () => {
      beforeEach(async () => {
        const passwordField = await screen.findByLabelText(/Wallet password/);
        await user.type(passwordField, PASSWORD);
        await user.click(await screen.findByRole('button', { name: /Continue/ }));
      });

      it('should export account when password correct', async () => {
        expect(
          await screen.findByText(/Open Coong Wallet on another device and scan this QR Code to transfer your account/),
        ).toBeInTheDocument();
        expect(await screen.findByTitle(/Account Export QR Code/)).toBeInTheDocument();
        expect(await screen.findByRole('button', { name: /Download QR Code Image/ })).toBeInTheDocument();
      });

      it('should show export account to json tab content', async () => {
        await user.click(await screen.findByRole('tab', { name: /JSON/ }));

        expect(
          await screen.findByText(
            /Export this account to a JSON file and import it back to Coong Wallet on this or other devices later/,
          ),
        ).toBeInTheDocument();
        expect(await screen.findByRole('button', { name: /Download JSON File/ })).toBeInTheDocument();
      });
    });
  });
});
