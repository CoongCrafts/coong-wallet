import { QRCodeCanvas } from 'qrcode.react';
import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { base64Encode } from '@polkadot/util-crypto';
import { AccountBackup, QrBackup } from '@coong/keyring/types';
import { Download } from '@mui/icons-material';
import { Button } from '@mui/material';
import FileSaver from 'file-saver';
import useQrCodeSize from 'hooks/useQrCodeSize';
import { TransferableObject, Props } from 'types';

interface QrCodeProps extends Props {
  value: QrBackup;
  object: TransferableObject;
}

export default function QrCode({ value, object }: QrCodeProps) {
  const { t } = useTranslation();
  const { containerRef, size } = useQrCodeSize();
  const qrCodeWrapperRef = useRef<HTMLDivElement>(null);

  const rawQrValue = useMemo(() => base64Encode(JSON.stringify(value)), [value]);

  const getFileName = () => {
    if (object === TransferableObject.Wallet) {
      return `coongwallet_wallet_backup_qrcode_${Date.now()}`;
    } else if (object === TransferableObject.Account) {
      const accountName = (((value as AccountBackup)?.meta?.name as string) || '').toLowerCase().replace(/\s/g, '_');
      return `coongwallet_account_backup_qrcode_${accountName}_${Date.now()}`;
    }
  };

  const downloadQrCode = () => {
    const canvas = qrCodeWrapperRef.current?.querySelector<HTMLCanvasElement>('canvas')!;
    canvas.toBlob((blob) => {
      if (!blob) {
        toast.error(t<string>('Cannot export QR code image'));
        return;
      }

      FileSaver.saveAs(blob, getFileName());
    }, 'image/png');
  };

  return (
    <div ref={containerRef} className='text-center'>
      <p className='my-4 sm:px-20'>
        {t<string>('Open Coong Wallet on another device and scan this QR Code to transfer your {{object}}', {
          object: t<string>(object.toLowerCase()),
        })}
      </p>
      <div ref={qrCodeWrapperRef}>
        <QRCodeCanvas
          size={size}
          value={rawQrValue}
          includeMargin
          title={t<string>('{{object}} Export QR Code', { object: t<string>(object) })}
        />
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
