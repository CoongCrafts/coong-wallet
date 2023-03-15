import { shallowEqual } from 'react-redux';
import { initializeKeyring, newUser, render, screen, UserEvent, waitFor } from '__tests__/testUtils';
import SettingWalletButton from '../SettingWalletButton';


describe('SettingWalletButton', () => {
  it('should hide the dialog by default', () => {
    render(<SettingWalletButton />, { preloadedState: { app: { seedReady: true, ready: true, locked: false } } });
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });

  describe('when the dialog is open', () => {
    let user: UserEvent, container: HTMLElement;
    beforeEach(() => {
      user = newUser();
      const result = render(<SettingWalletButton />, { preloadedState: { app: { seedReady: true, ready: true, locked: false } } });
      container = result.container;
      const button = screen.getByTitle('Open settings');
      user.click(button);
    });

    it('should active dark button when clicking the on it', async () => {
      const button = await screen.findByRole('button', { name: /Dark/ });
      user.click(button); 
      
      await waitFor(() => {
        expect(button).toHaveClass('MuiButton-contained');
        expect(container.querySelector('.dark')).toBeInTheDocument();
      });
    });

    it('should close the dialog when clicking the close button', async () => {
      const closeButton = await screen.findByTitle('Close settings');
      user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText('Settings')).not.toBeInTheDocument();
      });
    });

    it('should show the dialog when clicking the setting wallet button', async () => {
      expect(await screen.findByText('Settings')).toBeInTheDocument();
      expect(await screen.findByText('Dark')).toBeInTheDocument();
      expect(await screen.findByText('Light')).toBeInTheDocument();
      expect(await screen.findByText('System')).toBeInTheDocument();
      expect(await screen.findByTitle('Close settings')).toBeInTheDocument();
    });
  });

  describe('keyring not initialized', () => {
    it('should be hidden', () => {
      render(<SettingWalletButton />, { preloadedState: { app: { seedReady: false, ready: true, locked: false } } });
      expect(screen.queryByTitle('Open settings')).not.toBeInTheDocument();
    });
  });

  describe('keyring initialized', () => {
    beforeEach(async () => {
      await initializeKeyring();
    })
    it('should be hidden if the wallet is locked', () => {
      render(<SettingWalletButton />, { preloadedState: { app: { seedReady: true, ready: true, locked: true } } });
      expect(screen.queryByTitle('Open settings')).not.toBeInTheDocument();
    });
    it('should be visible if the wallet is unlocked', () => {
      render(<SettingWalletButton />, { preloadedState: { app: { seedReady: true, ready: true, locked: false } } });
      expect(screen.queryByTitle('Open settings')).toBeInTheDocument();
    });
  });
});
