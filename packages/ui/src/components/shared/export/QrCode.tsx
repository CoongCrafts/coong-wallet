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
import { Props, TransferableObject } from 'types';

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
    const qrCodeCanvas = qrCodeWrapperRef.current?.querySelector<HTMLCanvasElement>('canvas')!;

    const canvas = document.createElement('canvas');
    const canvasContext = canvas.getContext('2d')!;

    const defaultSize = 500;
    const spaceForInformationToFillIn = object === TransferableObject.Account ? 140 : 80;

    const startOfQrCodeImage = object === TransferableObject.Account ? 100 : 40;

    canvas.width = defaultSize;
    canvas.height = defaultSize + spaceForInformationToFillIn;

    // Fill background to white
    canvasContext.fillStyle = 'white';
    canvasContext.fillRect(0, 0, defaultSize, defaultSize + spaceForInformationToFillIn);

    // Draw QR Code on the canvas
    canvasContext.drawImage(qrCodeCanvas, 0, startOfQrCodeImage, defaultSize, defaultSize);

    // Fill in information
    canvasContext.fillStyle = 'black';
    canvasContext.font = `20px monospace`;
    canvasContext.textAlign = 'center';

    canvasContext.fillText(`Scan To Import ${object}`, defaultSize / 2, 40);

    canvasContext.fillText(
      'Coong  Wallet - https://coongwallet.io',
      defaultSize / 2,
      defaultSize + startOfQrCodeImage + 20,
      defaultSize - 80,
    );

    if (object === TransferableObject.Account) {
      const accountName = ((value as AccountBackup)?.meta?.name as string) || '';

      canvasContext.font = `bold 32px monospace`;
      canvasContext.fillText(accountName, defaultSize / 2, spaceForInformationToFillIn - 50);
    }

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          toast.error(t<string>('Cannot export QR code image'));
          return;
        }

        FileSaver.saveAs(blob, getFileName());
      },
      'image/png',
      1,
    );
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
          imageSettings={{
            src: 'src/assets/images/coong-logo.png',
            height: 32,
            width: 32,
            excavate: true,
          }}
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
