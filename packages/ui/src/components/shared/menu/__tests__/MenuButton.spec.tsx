import { waitFor } from '@testing-library/react';
import { base64Encode } from '@polkadot/util-crypto';
import Keyring from '@coong/keyring';
import { UserEvent } from '@testing-library/user-event/setup/setup';
import { initializeKeyring, newUser, PASSWORD, render, screen } from '__tests__/testUtils';
import { vi } from 'vitest';
import MenuButton from '../MenuButton';

let onReadResult: (acceptedFiles: File[]) => void;

vi.mock('react-dropzone', async () => {
  const reactDropzone: any = await vi.importActual('react-dropzone');
  return {
    ...reactDropzone,
    useDropzone: ({ onDrop }: any) => {
      onReadResult = onDrop;
      return {
        getRootProps: vi.fn(),
        getInputProps: vi.fn(),
        isDragActive: false,
      };
    },
  };
});

let cameraPermission: PermissionState = 'granted';

vi.mock('react-use', async () => {
  const reactUse: any = await vi.importActual('react-use');

  return { ...reactUse, usePermission: () => cameraPermission };
});

let onScanResult: (data: string) => void;

vi.mock('react-qr-reader', async () => {
  const qrReader: any = await vi.importActual('react-qr-reader');
  return {
    ...qrReader,
    default: ({ onScan }: any) => {
      onScanResult = onScan;
      return <div>Mocked QR Scanner</div>;
    },
  };
});

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
      vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => null);

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
  describe('ImportAccountDialog', () => {
    const renderView = async () => {
      render(<MenuButton />);

      await user.click(await screen.findByRole('button', { name: /Menu/ }));
      await user.click(await screen.findByRole('menuitem', { name: /Import Account/ }));
    };

    const getBackup = async (removeAccount?: boolean) => {
      const { address } = await keyring.createNewAccount('test-account', PASSWORD);
      const backup = await keyring.exportAccount(address, PASSWORD);
      removeAccount && (await keyring.removeAccount(address));
      return backup;
    };

    beforeEach(async () => {
      keyring = await initializeKeyring();
      cameraPermission = 'granted';
    });

    it('should show `ImportAccountDialog` content', async () => {
      await renderView();
      expect(await screen.findByRole('dialog', { name: /Import Account/ })).toBeInTheDocument();
      expect(await screen.findByRole('tab', { name: /QR Code/ })).toBeInTheDocument();
      expect(await screen.findByRole('tab', { name: /JSON File/ })).toBeInTheDocument();
      expect(await screen.findByText(/scan the QR code on the screen to transfer your wallet/)).toBeInTheDocument();
      expect(await screen.findByText(/Mocked QR Scanner/)).toBeInTheDocument();
    });

    describe('QR Code Method', () => {
      it('should show an alert if camera is denied', async () => {
        cameraPermission = 'denied';
        await renderView();

        expect(await screen.findByRole('alert')).toHaveTextContent(/Camera Permission Denied/);
      });

      it('should show error if QR Code invalid', async () => {
        await renderView();
        onScanResult('invalid-data');

        expect(await screen.findByText(/Unknown\/Invalid QR Code/)).toBeInTheDocument();
      });
    });

    describe('JSON File Method', () => {
      beforeEach(async () => {
        await renderView();
        await user.click(await screen.findByRole('tab', { name: /JSON File/ }));
      });

      it('should navigate to `JSON File` tab', async () => {
        expect(await screen.findByText(/Click to select or drag and drop the file here/));
      });

      it('should show error if JSON file invalid', async () => {
        const invalidFile = new File(['invalid'], 'invalid.json');
        const inputFile = new Array(invalidFile);
        onReadResult(inputFile);

        expect(await screen.findByText(/Unknown\/Invalid JSON File/)).toBeInTheDocument();
      });
    });

    it('should show TransferAccountBackup if backup valid', async () => {
      await renderView();

      const backup = await getBackup(true);
      onScanResult(base64Encode(JSON.stringify(backup)));

      expect(await screen.findByText(/test-account/)).toBeInTheDocument();
      expect(await screen.findByLabelText(/Wallet password of the account backup/)).toBeInTheDocument();
      expect(await screen.findByRole('button', { name: /Import Account/ })).toBeDisabled();
      expect(await screen.findByRole('button', { name: /Back/ })).toBeInTheDocument();
    });

    describe('TransferAccountBackup', () => {
      describe('has conflict', () => {
        describe('can not resolve', () => {
          it('should show error if account exists', async () => {
            const backup = await getBackup();

            await renderView();
            onScanResult(base64Encode(JSON.stringify(backup)));

            expect(await screen.findByRole('alert')).toHaveTextContent(
              /Account is already exists in your wallet. Importing account can not be implemented./,
            );
          });
        });
        describe('can resolve', () => {
          it('should show alert if account name exists', async () => {
            const backup = await getBackup(true);
            await keyring.createNewAccount('test-account', PASSWORD);

            await renderView();
            onScanResult(base64Encode(JSON.stringify(backup)));

            expect(await screen.findByRole('alert')).toHaveTextContent(
              /Account name has already been taken. Please choose another name to continue importing./,
            );
            expect(await screen.findByLabelText(/New account name/)).toBeInTheDocument();
          });

          it('should show alert if account name not found', async () => {
            const backup = await getBackup(true);

            await renderView();
            onScanResult(base64Encode(JSON.stringify({ ...backup, meta: { ...backup.meta, name: '' } })));

            expect(await screen.findByRole('alert')).toHaveTextContent(
              /Account name is required. Please choose one to continue importing./,
            );
            expect(await screen.findByLabelText(/New account name/)).toBeInTheDocument();
          });

          it('should show error when account name is not valid', async () => {
            const backup = await getBackup(true);
            await keyring.createNewAccount('test-account', PASSWORD);

            await renderView();
            onScanResult(base64Encode(JSON.stringify(backup)));

            const newAccountNameField = await screen.findByLabelText(/New account name/);
            await user.type(newAccountNameField, 'very-long-account-name');

            expect(await screen.findByText(/Account name should not exceed 16 characters/)).toBeInTheDocument();

            await user.clear(newAccountNameField);
            await user.type(newAccountNameField, 'test-account');

            expect(await screen.findByText(/Account name is already picked/)).toBeInTheDocument();
          });
        });
      });
      it('should import account', async () => {
        // just mocking on this function
        window.HTMLElement.prototype.scrollIntoView = () => vi.fn();

        const backup = await getBackup(true);

        await renderView();
        onScanResult(base64Encode(JSON.stringify(backup)));

        await user.type(await screen.findByLabelText(/Wallet password of the account backup/), PASSWORD);
        await user.click(await screen.findByRole('button', { name: /Import Account/ }));

        await waitFor(() => {
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
          expect(screen.queryByText(/Import account successfully/)).toBeInTheDocument();
        });
      });

      it('should show ImportAccountDialog screen when go back', async () => {
        const backup = await getBackup(true);

        await renderView();
        onScanResult(base64Encode(JSON.stringify(backup)));

        await user.click(await screen.findByRole('button', { name: /Back/ }));

        expect(await screen.findByText(/scan the QR code on the screen to transfer your wallet/)).toBeInTheDocument();
        expect(await screen.findByText(/Mocked QR Scanner/)).toBeInTheDocument();
      });
    });
  });
});
