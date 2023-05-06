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

    it('should disable `Rename` button and show error when `AccountNameField` more than 16 characters or empty', async () => {
      const accountNameField = await screen.findByLabelText(/Account name/);

      await user.clear(accountNameField);
      expect(await screen.findByRole('button', { name: /Rename/ })).toBeDisabled();

      await user.type(accountNameField, 'Account-name-more-than-16-chars');
      expect(await screen.findByRole('button', { name: /Rename/ })).toBeDisabled();
      expect(await screen.findByText(/Account name should not exceed 16 characters/)).toBeInTheDocument();
    });

    it('should close `RenameAccountDialog` when clicking on `Cancel` button', async () => {
      const cancelButton = await screen.findByRole('button', { name: /Cancel/ });
      await user.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(screen.queryByText(/Rename account/)).not.toBeInTheDocument();
      });
    });

    it('should show error if account name already exists', async () => {
      await keyring.createNewAccount('test-account-2', PASSWORD);

      const accountNameField = await screen.findByLabelText(/Account name/);
      await user.clear(accountNameField);

      await user.type(accountNameField, 'test-account-2');

      const renameButton = await screen.findByRole('button', { name: /Rename/ });
      await user.click(renameButton);
      expect(await screen.findByText(/Account name is already picked/)).toBeInTheDocument();
    });
  });
  describe('ShowAddressQrCodeDialog', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => null);
    beforeEach(async () => {
      await user.click(await screen.findByRole('menuitem', { name: /Show QR Code/ }));
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
      const closeButton = await screen.findByTitle(/Close/);
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /Account address/ })).not.toBeInTheDocument();
      });
    });
  });
});
