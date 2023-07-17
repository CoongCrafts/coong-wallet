import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import QrReader from 'react-qr-reader';
import { Button } from '@mui/material';
import { Props } from 'types';

interface QrCodeUploaderProps extends Props {
  onResult: (data: string) => void;
}

function QrCodeUploadButton({ onResult, className = '' }: QrCodeUploaderProps): JSX.Element {
  const { t } = useTranslation();
  const qrReader = useRef<any>(null);

  const openImageSelectionDialog = () => {
    qrReader?.current.openImageDialog();
  };

  return (
    <>
      <QrReader
        ref={qrReader}
        onScan={(data) => data && onResult(data)}
        onError={() => {}}
        legacyMode
        className='hidden'
      />
      <Button onClick={openImageSelectionDialog} color='gray' variant='text' className={className}>
        {t<string>('Upload QR Code')}
      </Button>
    </>
  );
}

export default QrCodeUploadButton;
