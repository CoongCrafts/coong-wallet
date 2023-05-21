import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { u8aToString } from '@polkadot/util';
import { base64Decode } from '@polkadot/util-crypto';
import { WalletQrBackup } from '@coong/keyring/types';
import TransferWalletBackup from 'components/pages/SetupWallet/RestoreWallet/ScanQrCode/TransferWalletBackup';
import QrCodeReader from 'components/shared/import/QrCodeReader';
import { WalletQrBackupScheme } from 'validations/WalletBackup';

export default function ScanQrCode(): JSX.Element {
  const { t } = useTranslation();
  const [backup, setBackup] = useState<WalletQrBackup>();

  const onQrScanComplete = async (data: string) => {
    try {
      const decoded = u8aToString(base64Decode(data));
      const parsedBackup = JSON.parse(decoded) as WalletQrBackup;
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
    <QrCodeReader onResult={onQrScanComplete} showBackButton showTitle />
  );
}
