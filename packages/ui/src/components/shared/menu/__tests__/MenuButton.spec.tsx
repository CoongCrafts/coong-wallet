import Keyring from '@coong/keyring';
import { UserEvent } from '@testing-library/user-event/setup/setup';
import { initializeKeyring, newUser, PASSWORD, render, screen } from '__tests__/testUtils';
import MenuButton from '../MenuButton';

let keyring: Keyring;

describe('MenuButton', () => {
  let user: UserEvent;
  beforeEach(() => {
    user = newUser();
  });

  it('should show menu button', async () => {
    render(<MenuButton />);

    expect(await screen.findByRole('button', { name: /Menu/ })).toBeInTheDocument();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('should show menu after clicking the button', async () => {
    render(<MenuButton />);

    await user.click(await screen.findByRole('button', { name: /Menu/ }));
    expect(await screen.findByRole('menu')).toBeInTheDocument();
  });

  describe('ExportWalletDialog', () => {
    beforeEach(async () => {
      keyring = await initializeKeyring();
      render(<MenuButton />);

      await user.click(await screen.findByRole('button', { name: /Menu/ }));
      await user.click(await screen.findByRole('menuitem', { name: /Export Wallet/ }));
    });

    it('should export wallet dialog after click menu item', async () => {
      expect(await screen.findByRole('dialog', { name: 'Export Wallet' })).toBeInTheDocument();
      expect(await screen.findByText(/Enter your wallet password to continue/)).toBeInTheDocument();
      expect(await screen.findByLabelText(/Wallet password/)).toBeInTheDocument();
      expect(await screen.findByRole('button', { name: /Continue/ })).toBeInTheDocument();
      expect(await screen.findByRole('button', { name: /Cancel/ })).toBeInTheDocument();
    });

    it('should show error if password is not correct', async () => {
      const passwordField = await screen.findByLabelText(/Wallet password/);
      await user.type(passwordField, 'incorrect-password');
      await user.click(await screen.findByRole('button', { name: /Continue/ }));

      expect(await screen.findByText('Password incorrect')).toBeInTheDocument();
    });

    it('should show Qr Code after entering correct password', async () => {
      const passwordField = await screen.findByLabelText(/Wallet password/);
      await user.type(passwordField, PASSWORD);
      await user.click(await screen.findByRole('button', { name: /Continue/ }));

      expect(
        await screen.findByText(/Open Coong Wallet on another device and scan this QR Code to transfer your wallet/),
      ).toBeInTheDocument();

      expect(await screen.findByTitle(/Wallet Export QR Code/)).toBeInTheDocument();
      expect(await screen.findByRole('button', { name: /Download QR Code Image/ })).toBeInTheDocument();
    });
  });
});
