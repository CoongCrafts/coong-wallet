import { base64Encode } from '@polkadot/util-crypto';
import { WalletQrBackup } from '@coong/keyring/types';
import { UserEvent, MNEMONIC, newUser, PASSWORD, render, screen } from '__tests__/testUtils';
import CryptoJS from 'crypto-js';
import { vi } from 'vitest';
import ScanQrCode from '../index';

const onWalletSetup = vi.fn(),
  onCancelSetup = vi.fn();

vi.mock('providers/WalletSetupProvider', async () => {
  const provider: any = await vi.importActual('providers/WalletSetupProvider');

  return {
    ...provider,
    useWalletSetup: () => ({
      onWalletSetup,
      onCancelSetup,
    }),
  };
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

let cameraPermission: PermissionState = 'granted';

vi.mock('react-use', async () => {
  const reactUse: any = await vi.importActual('react-use');

  return { ...reactUse, usePermission: () => cameraPermission };
});

vi.mock('react-router-dom', async () => {
  const reactRouter: any = await vi.importActual('react-router-dom');

  return { ...reactRouter, useNavigate: () => vi.fn() };
});

const validQrBackup: WalletQrBackup = {
  encryptedMnemonic: CryptoJS.AES.encrypt(MNEMONIC, PASSWORD).toString(),
  accountsIndex: 3,
  accounts: [
    ['', 'Account 01'],
    ['//0', 'Account 02'],
    ['//1', 'Account 03'],
  ],
};

const rawQrBackup = base64Encode(JSON.stringify(validQrBackup));

describe('ScanQrCode', () => {
  beforeEach(() => {
    cameraPermission = 'granted';
  });

  describe('QrCodeReader', () => {
    it('should render the Qr Code reader properly', async () => {
      render(<ScanQrCode />);

      expect(await screen.findByText(/Scan QR Code/)).toBeInTheDocument();
      expect(await screen.findByText(/Mocked QR Scanner/)).toBeInTheDocument();
      expect(await screen.findByRole('button', { name: /Back/ })).toBeEnabled();
    });

    it('should show an alert if camera is denied', async () => {
      cameraPermission = 'denied';

      render(<ScanQrCode />);

      expect(await screen.findByRole('alert')).toHaveTextContent(/Camera Permission Denied/);
    });

    it('should show error if Qr code is invalid', async () => {
      render(<ScanQrCode />);
      onScanResult('random data');

      expect(await screen.findByText(/Unknown\/invalid QR code/)).toBeInTheDocument();
    });

    it('should show TransferWalletBackup screen if the Qr code is valid', async () => {
      render(<ScanQrCode />);
      onScanResult(rawQrBackup);

      expect(await screen.findByText(/Import wallet/)).toBeInTheDocument();
      expect(await screen.findByText(/Enter wallet password to import your wallet/)).toBeInTheDocument();
      expect(await screen.findByLabelText(/Wallet password/)).toBeEnabled();
      expect(await screen.findByRole('button', { name: /Continue/ })).toBeDisabled();
      expect(await screen.findByRole('button', { name: /Back/ })).toBeEnabled();
    });
  });

  describe('TransferWalletBackup', () => {
    let user: UserEvent;
    beforeEach(() => {
      render(<ScanQrCode />);
      onScanResult(rawQrBackup);
      user = newUser();
    });

    it('should show error if password is incorrect', async () => {
      const passwordField = await screen.findByLabelText(/Wallet password/);
      await user.type(passwordField, 'incorrect-password');
      await user.click(await screen.findByRole('button', { name: /Continue/ }));

      expect(await screen.findByText(/Password incorrect/)).toBeInTheDocument();
    });

    it('should call onWalletSetup after import completed', async () => {
      const passwordField = await screen.findByLabelText(/Wallet password/);
      await user.type(passwordField, PASSWORD);
      await user.click(await screen.findByRole('button', { name: /Continue/ }));

      expect(await screen.findByText(/Wallet imported/)).toBeInTheDocument();
      expect(onWalletSetup).toBeCalled();
    });

    it('should show ScanQrCode screen on go back', async () => {
      expect(await screen.findByText(/Import wallet/)).toBeInTheDocument();
      await user.click(await screen.findByRole('button', { name: /Back/ }));
      expect(await screen.findByText(/Scan QR Code/)).toBeInTheDocument();
    });
  });
});
