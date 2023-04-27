import { AccountInfo } from '@coong/keyring/types';
import { UserEvent } from '@testing-library/user-event/setup/setup';
import { initializeKeyring, newUser, PASSWORD, render, screen, waitFor } from '__tests__/testUtils';
import Accounts from '../../index';

describe('AccountControls', () => {
  let user: UserEvent, testAccount: AccountInfo;
  beforeEach(async () => {
    user = newUser();

    const keyring = await initializeKeyring();

    testAccount = await keyring.createNewAccount('test-account', PASSWORD);

    render(<Accounts />);

    const accountControlsButton = await screen.findByTitle(/Open account controls/);
    await user.click(accountControlsButton);
  });
  describe('RemoveAccountDialog', () => {
    beforeEach(async () => {
      const removeActionButton = await screen.findByRole('menuitem', { name: /Remove/ });
      await user.click(removeActionButton);
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
      const renameActionButton = await screen.findByRole('menuitem', { name: /Rename/ });
      await user.click(renameActionButton);
    });

    it('should show content of `RenameAccountDialog` correctly', async () => {
      expect(await screen.findByText(/Rename account/)).toBeInTheDocument();
      expect(await screen.findByLabelText(/Account name/)).toBeInTheDocument();
      expect(await screen.findByText(/test-account/)).toBeInTheDocument();
      expect(await screen.findByRole('button', { name: /Rename/ })).toBeInTheDocument();
    });

    it('should disable `Rename` button and show error when `AccountNameField` more than 15 characters or empty', async () => {
      const accountNameField = await screen.findByLabelText(/Account name/);

      await user.clear(accountNameField);
      expect(await screen.findByRole('button', { name: /Rename/ })).toBeDisabled();

      await user.type(accountNameField, 'account-name-more-than-15-characters');
      expect(await screen.findByRole('button', { name: /Rename/ })).toBeDisabled();
      expect(await screen.findByText(/Account name need to be less than 16 characters/)).toBeInTheDocument();
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
      const renameButton = await screen.findByRole('button', { name: /Rename/ });
      await user.click(renameButton);

      expect(await screen.findByText(/Account name is already picked/)).toBeInTheDocument();
    });
  });
});
