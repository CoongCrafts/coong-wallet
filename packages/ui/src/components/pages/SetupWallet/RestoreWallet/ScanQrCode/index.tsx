import { useState } from 'react';
import { WalletQrBackup } from '@coong/keyring/types';
import QrCodeReader from 'components/pages/SetupWallet/RestoreWallet/ScanQrCode/QrCodeReader';
import TransferWalletBackup from 'components/pages/SetupWallet/RestoreWallet/ScanQrCode/TransferWalletBackup';

export default function ScanQrCode(): JSX.Element {
  const [backup, setBackup] = useState<WalletQrBackup>();

  const onQrScanComplete = (data: string) => {
    try {
      const parsedBackup = JSON.parse(data) as WalletQrBackup;
      // TODO validate wallet backup via jup with validation schema

      setBackup(parsedBackup);
    } catch (e: any) {
      console.error(e);
    }
  };

  const resetBackup = () => {
    setBackup(undefined);
  };

  return backup ? (
    <TransferWalletBackup backup={backup} resetBackup={resetBackup} />
  ) : (
    <QrCodeReader onResult={onQrScanComplete} />
  );
}
