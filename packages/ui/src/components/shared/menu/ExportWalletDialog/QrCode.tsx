import { QRCodeCanvas } from 'qrcode.react';
import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { base64Encode } from '@polkadot/util-crypto';
import { CompactAccountInfo, DerivationPath, WalletBackup, WalletQrBackup } from '@coong/keyring/types';
import { Download } from '@mui/icons-material';
import { Button } from '@mui/material';
import FileSaver from 'file-saver';
import useQrCodeSize from 'hooks/useQrCodeSize';
import { Props } from 'types';

interface QrCodeProps extends Props {
  walletBackup: WalletBackup;
}

const toWalletQrBackup = (backup: WalletBackup): WalletQrBackup => {
  const { accounts, accountsIndex, encryptedMnemonic } = backup;

  return {
    accountsIndex,
    encryptedMnemonic,
    accounts: accounts.map(({ meta }) => [meta.derivationPath as DerivationPath, meta.name!] as CompactAccountInfo),
  };
};

export default function QrCode({ walletBackup }: QrCodeProps) {
  const { t } = useTranslation();
  const { containerRef, size } = useQrCodeSize();
  const qrCodeWrapperRef = useRef<HTMLDivElement>(null);

  const qrBackup = useMemo<string>(() => base64Encode(JSON.stringify(toWalletQrBackup(walletBackup))), [walletBackup]);

  const downloadQrCode = () => {
    const canvas = qrCodeWrapperRef.current?.querySelector<HTMLCanvasElement>('canvas')!;
    canvas.toBlob((blob) => {
      if (!blob) {
        toast.error(t<string>('Cannot export QR code image'));
        return;
      }

      FileSaver.saveAs(blob, `coongwallet_backup_qrcode_${Date.now()}`);
    }, 'image/png');
  };

  return (
    <div ref={containerRef} className='text-center'>
      <p className='my-4 sm:px-20'>
        {t<string>('Open Coong Wallet on another device and scan this QR Code to transfer your wallet.')}
      </p>
      <div ref={qrCodeWrapperRef}>
        <QRCodeCanvas size={size} value={qrBackup} includeMargin title={t<string>('Wallet Export QR Code')} />
      </div>
      <div className='mt-4'>
        <Button variant='outlined' startIcon={<Download />} onClick={downloadQrCode} size='small'>
          {t<string>('Download QR Code Image')}
        </Button>
      </div>
      <p className='my-4 italic sm:px-20 text-sm'>
        {t<string>(
          'You will be prompted to enter your wallet password to complete the transfer process on the other device.',
        )}
      </p>
    </div>
  );
}
