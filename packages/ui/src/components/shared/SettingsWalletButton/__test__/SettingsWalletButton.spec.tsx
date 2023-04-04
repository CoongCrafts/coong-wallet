import { initializeKeyring, newUser, render, screen, UserEvent, waitFor } from '__tests__/testUtils';
import SettingsWalletButton from 'components/shared/SettingsWalletButton';

describe('SettingsWalletButton', () => {
  it('should hide the dialog by default', async () => {
    render(<SettingsWalletButton />, { preloadedState: { app: { seedReady: false, ready: true, locked: true } } });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  describe('when the dialog is open', () => {
    let user: UserEvent;
    beforeEach(() => {
      user = newUser();

      render(<SettingsWalletButton />, {
        preloadedState: { app: { seedReady: true, ready: true, locked: false } },
      });

      const settingsButton = screen.getByTitle('Open settings');
      user.click(settingsButton);
    });

    it('should active dark button and switch to dark theme when clicking on the dark mode button', async () => {
      const darkModeButton = await screen.findByRole('button', { name: /Dark/ });
      user.click(darkModeButton);

      await waitFor(() => {
        expect(darkModeButton).toHaveClass('MuiButton-outlinedPrimary');
        expect(document.body.classList.contains('dark')).toBeTruthy();
      });
    });

    it("should the AutoLockSelection switch to '15 minutes' when choose 15 minutes", async () => {
      const autoLockSelectionButton = await screen.findByRole('button', { name: /5 minutes/ });
      user.click(autoLockSelectionButton);

      const fifteenMinutesSelection = await screen.findByText(/15 minutes/);
      user.click(fifteenMinutesSelection);

      expect(await screen.findByRole('button', { name: /15 minutes/ })).toBeInTheDocument();
    });

    it('should close the dialog when clicking the close button', async () => {
      const closeButton = await screen.findByTitle('Close settings');
      user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText('Settings')).not.toBeInTheDocument();
      });
    });

    it('should show ThemeModeButton, LanguageSelection, AutoLockSelection', async () => {
      expect(await screen.findByRole('dialog')).toBeInTheDocument();
      expect(await screen.findByRole('button', { name: /Dark/ })).toBeInTheDocument();
      expect(await screen.findByRole('button', { name: /Light/ })).toBeInTheDocument();
      expect(await screen.findByRole('button', { name: /System/ })).toBeInTheDocument();
      expect(await screen.findByRole('button', { name: /Close settings/ })).toBeInTheDocument();
      expect(await screen.findByRole('button', { name: /English/ })).toBeInTheDocument();
      expect(await screen.findByRole('button', { name: /5 minutes/ })).toBeInTheDocument();
    });
  });

  describe('keyring not initialized', () => {
    it('should be hidden', () => {
      render(<SettingsWalletButton />, { preloadedState: { app: { seedReady: false, ready: true, locked: false } } });
      expect(screen.queryByTitle('Open settings')).not.toBeInTheDocument();
    });
  });

  describe('keyring initialized', () => {
    beforeEach(async () => {
      await initializeKeyring();
    });
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
