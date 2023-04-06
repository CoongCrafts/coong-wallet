import { newUser, render, screen, UserEvent, waitFor } from '__tests__/testUtils';
import SettingsWalletButton from 'components/shared/settings/SettingsWalletButton';

describe('SettingsWalletButton', () => {
  it('should hide the dialog by default', async () => {
    render(<SettingsWalletButton />, { preloadedState: { app: { seedReady: false, ready: true, locked: true } } });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  describe('when the dialog is open', () => {
    let user: UserEvent;
    beforeEach(async () => {
      user = newUser();

      render(<SettingsWalletButton />, {
        preloadedState: { app: { seedReady: true, ready: true, locked: false } },
      });

      const settingsButton = screen.getByTitle('Open settings');
      await user.click(settingsButton);
    });

    it('should active dark button and switch to dark theme when clicking on the dark mode button', async () => {
      const darkModeButton = await screen.findByRole('button', { name: /Dark/ });
      await user.click(darkModeButton);

      await waitFor(() => {
        expect(darkModeButton).toHaveClass('MuiButton-outlinedPrimary');
        expect(document.body.classList.contains('dark')).toBeTruthy();
      });
    });

    it("should the AutoLockSelection switch to '15 minutes' when choose 15 minutes", async () => {
      const autoLockSelectionButton = await screen.findByRole('button', { name: /5 minutes/ });
      await user.click(autoLockSelectionButton);

      const fifteenMinutesSelection = await screen.findByText(/15 minutes/);
      await user.click(fifteenMinutesSelection);

      expect(await screen.findByRole('button', { name: /15 minutes/ })).toBeInTheDocument();
    });

    it('should close the dialog when clicking the close button', async () => {
      const closeButton = await screen.findByTitle('Close settings');
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText('Settings')).not.toBeInTheDocument();
      });
    });

    it('should switch to BackupSecretPhraseDialog content when clicking on `Backup secret recovery phrase` button', async () => {
      const BackupSecretRecoveryPhraseButton = await screen.findByRole('button', {
        name: /Backup secret recovery phrase/,
      });

      user.click(BackupSecretRecoveryPhraseButton);

      await waitFor(() => {
        expect(screen.getByText(/Backup secret recovery phrase/)).toBeInTheDocument();
        expect(screen.getByText(/reveal the secret recovery phrase/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /View Secret Recovery Phrase/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Back/ })).toBeInTheDocument();
      });
    });

    it('should show ThemeModeButton, LanguageSelection, AutoLockSelection, `Backup secret recovery phrase` button, `Change wallet password` button', async () => {
      expect(await screen.findByRole('dialog')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Dark/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Light/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /System/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Close settings/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /English/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /5 minutes/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Backup secret recovery phrase/ })).toBeInTheDocument();
      });
    });
  });

  describe('keyring not initialized', () => {
    it('should be hidden', () => {
      render(<SettingsWalletButton />, { preloadedState: { app: { seedReady: false, ready: true, locked: false } } });
      expect(screen.queryByTitle('Open settings')).not.toBeInTheDocument();
    });
  });

  describe('keyring initialized', () => {
    it('should be hidden if the wallet is locked', () => {
      render(<SettingsWalletButton />, { preloadedState: { app: { seedReady: true, ready: true, locked: true } } });
      expect(screen.queryByTitle('Open settings')).not.toBeInTheDocument();
    });
    it('should be visible if the wallet is unlocked', () => {
      render(<SettingsWalletButton />, { preloadedState: { app: { seedReady: true, ready: true, locked: false } } });
      expect(screen.queryByTitle('Open settings')).toBeInTheDocument();
    });
  });
});
