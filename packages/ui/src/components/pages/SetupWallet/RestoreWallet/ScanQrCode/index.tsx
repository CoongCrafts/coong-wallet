import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { WalletQrBackup } from '@coong/keyring/types';
import QrCodeReader from 'components/pages/SetupWallet/RestoreWallet/ScanQrCode/QrCodeReader';
import TransferWalletBackup from 'components/pages/SetupWallet/RestoreWallet/ScanQrCode/TransferWalletBackup';
import { WalletQrBackupScheme } from 'validations/WalletBackup';

export default function ScanQrCode(): JSX.Element {
  const { t } = useTranslation();
  const [backup, setBackup] = useState<WalletQrBackup>();

  const onQrScanComplete = async (data: string) => {
    try {
      const parsedBackup = JSON.parse(data) as WalletQrBackup;
      await WalletQrBackupScheme.validate(parsedBackup);

      setBackup(parsedBackup);
    } catch (e: any) {
      console.error(e);
      toast.dismiss();
      toast.error(t<string>('Unknown/invalid QR code'));
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
