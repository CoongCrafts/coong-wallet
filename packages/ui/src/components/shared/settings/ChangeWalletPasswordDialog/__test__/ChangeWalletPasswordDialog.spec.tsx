import { UserEvent } from '@testing-library/user-event/setup/setup';
import { initializeKeyring, newUser, render, screen, waitFor } from '../../../../../__tests__/testUtils';
import { SettingsDialogScreen } from '../../../../../types';
import SettingsWalletButton from '../../SettingsWalletButton';
import { expectSettingsWalletDialog } from '../../__test__/SettingsWalletButton.spec';

describe('ChangeWalletPasswordDialog', () => {
  let user: UserEvent;
  beforeEach(async () => {
    user = newUser();

    render(<SettingsWalletButton />, {
      preloadedState: {
        app: { seedReady: true, ready: true, locked: false },
        settingsDialog: { screen: SettingsDialogScreen.ChangeWalletPassword },
      },
    });

    const settingsButton = screen.getByTitle('Open settings');
    await user.click(settingsButton);
  });

  describe('VerifyingPassword', () => {
    it('should show content of ChangeWalletPasswordDialog', async () => {
      await waitFor(() => {
        expect(screen.getByText(/Change Wallet Password/)).toBeInTheDocument();
        expect(screen.getByText(/Enter your wallet password to continue/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Continue/ })).toBeDisabled();
        expect(screen.getByRole('button', { name: /Back/ })).toBeInTheDocument();
      });
    });

    it('should enable `Continue` button when typing password', async () => {
      const passwordField = await screen.findByLabelText(/Wallet password/);
      await user.type(passwordField, 'testing-password');

      expect(await screen.findByRole('button', { name: /Continue/ })).toBeEnabled();
    });

    it('should show error message on submitting incorrect password', async () => {
      await initializeKeyring();

      const passwordField = await screen.findByLabelText(/Wallet password/);
      await user.type(passwordField, 'incorrect-password');

      const continueButton = await screen.findByRole('button', { name: /Continue/ });
      await user.click(continueButton);

      expect(await screen.findByText(/Password incorrect/)).toBeInTheDocument();
    });

    it('should switch to `SettingsWalletDialog` content when clicking on `Back` button', async () => {
      const backButton = await screen.findByRole('button', { name: /Back/ });
      await user.click(backButton);

      await expectSettingsWalletDialog(screen);
    });
  });

  describe('ChangingWalletPassword', () => {
    const INVALID_PASSWORD = '1234';
    let newPasswordField: HTMLInputElement, passwordConfirmationField: HTMLInputElement;
    beforeEach(async () => {
      await initializeKeyring();

      const passwordField = await screen.findByLabelText(/Wallet password/);
      await user.type(passwordField, 'supersecretpassword');

      const continueButton = await screen.findByRole('button', { name: /Continue/ });
      await user.click(continueButton);

      newPasswordField = await screen.findByLabelText(/New password/);
      passwordConfirmationField = await screen.findByLabelText(/Confirm new password/);
    });

    it('should show error message when typing invalid new password', async () => {
      await user.type(newPasswordField, INVALID_PASSWORD);

      expect(await screen.findByText(/Password's too short/));
    });

    it('should show error message when typing new password is identical with current password', async () => {
      await user.type(newPasswordField, 'supersecretpassword');

      expect(await screen.findByText(/Please pick a different password than the previous one/)).toBeInTheDocument();
    });

    it('should show error message when typing not match password confirmation', async () => {
      await user.type(newPasswordField, 'valid-password');
      await user.type(passwordConfirmationField, 'not-match-password');

      expect(await screen.findByText(/Password does not match/)).toBeInTheDocument();
    });

    it('should enable `Change Password` when new password and password confirmation is valid', async () => {
      await user.type(newPasswordField, 'valid-password');
      await user.type(passwordConfirmationField, 'valid-password');

      expect(await screen.findByRole('button', { name: /Change Password/ })).toBeEnabled();
    });

    it('should disable `Change Password` when before changing password begin', async () => {
      await user.type(newPasswordField, 'valid-password');
      await user.type(passwordConfirmationField, 'valid-password');

      const changePasswordButton = await screen.findByRole('button', { name: /Change Password/ });
      await user.click(changePasswordButton);

      expect(await screen.findByRole('button', { name: /Change Password/ })).toBeDisabled();
      expect(await screen.findByRole('button', { name: /Back/ })).toBeDisabled();
      expect(await screen.findByTitle(/Close settings/)).toBeDisabled();
      expect(await screen.findByText(/Password changed successfully/)).toBeInTheDocument();
    });

    it('should switch to `SettingsWalletDialog` content when clicking on `Back` button', async () => {
      const backButton = await screen.findByRole('button', { name: /Back/ });
      await user.click(backButton);

      await expectSettingsWalletDialog(screen);
    });
  });
});
