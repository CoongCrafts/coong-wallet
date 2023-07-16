import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import QrReader from 'react-qr-reader';
import { Button, ButtonBase } from '@mui/material';
import { Props, TransferableObject } from 'types';
import { isTouchDevice } from 'utils/device';

const touchDevice = isTouchDevice();

interface QrCodeUploaderProps extends Props {
  onResult: (data: string) => void;
  object: TransferableObject;
  showTitle?: boolean;
  goBack?: boolean;
}

function QrCodeUploader({ onResult, object, showTitle, goBack }: QrCodeUploaderProps): JSX.Element {
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
      <Button
        onClick={openImageSelectionDialog}
        fullWidth
        className='px-6 py-6 mt-6 cursor-pointer bg-black/10 dark:bg-white/15 rounded-none shadow-none italic font-normal text-base h-[72px]'>
        {t<string>('Click here select image')}
      </Button>
    </>
  );
}

export default QrCodeUploader;
