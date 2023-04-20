import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { WalletQrBackup } from '@coong/keyring/types';
import QrCodeReader from './QrCodeReader';
import TransferWalletBackup from './TransferWalletBackup';

export default function ScanQrCode(): JSX.Element {
  const { t } = useTranslation();
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

  return (
    <div className='max-w-[450px] mt-8 mb-16 mx-auto'>
      {backup ? <TransferWalletBackup backup={backup} /> : <QrCodeReader onResult={onQrScanComplete} />}
    </div>
  );
}
