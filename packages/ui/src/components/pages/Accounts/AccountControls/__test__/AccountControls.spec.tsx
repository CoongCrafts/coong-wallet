import Keyring from '@coong/keyring';
import { AccountInfo } from '@coong/keyring/types';
import { UserEvent } from '@testing-library/user-event/setup/setup';
import { initializeKeyring, newUser, PASSWORD, render, screen, waitFor } from '__tests__/testUtils';
import Accounts from '../../index';

describe('AccountSettings', () => {
  let user: UserEvent, testAccount: AccountInfo;
  beforeEach(async () => {
    user = newUser();

    const keyring = await initializeKeyring();

    await keyring.createNewAccount('test-account', PASSWORD);
    testAccount = await keyring.getAccountByName('test-account');

    render(<Accounts />);

    const accountSettingsButton = await screen.findByTitle(/Open account controls/);
    await user.click(accountSettingsButton);
  });
  describe('RemovingAccount', () => {
    beforeEach(async () => {
      const removeActionButton = await screen.findByRole('menuitem', { name: /Remove/ });
      await user.click(removeActionButton);
    });

    it('should show content of `RemovingAccount` dialog correctly', async () => {
      expect(await screen.findByRole('dialog')).toBeInTheDocument();
      expect(await screen.findByText(`Remove account: ${testAccount.name}`)).toBeInTheDocument();
      expect(await screen.findByRole('button', { name: /Cancel/ })).toBeInTheDocument();
      expect(await screen.findByRole('button', { name: /Remove this account/ })).toBeInTheDocument();
    });

    it('should close the `RemovingAccount` dialog when clicking on `Cancel` button', async () => {
      const cancelButton = await screen.findByRole('button', { name: /Cancel/ });
      await user.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(screen.queryByText(`Remove account: ${testAccount.name}`)).not.toBeInTheDocument();
      });
    });

    it('should call `keyring.removeAccount` function when clicking on `Remove this account` button', async () => {
      const removeAccountSpy = vi.spyOn(Keyring.prototype, 'removeAccount');

      const removeAccountButton = await screen.findByRole('button', { name: /Remove this account/ });
      await user.click(removeAccountButton);

      await waitFor(() => expect(removeAccountSpy).toBeCalled());
    });
  });
});
