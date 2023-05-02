import { useTranslation } from 'react-i18next';
import QrReader from 'react-qr-reader';
import { useDispatch } from 'react-redux';
import { usePermission } from 'react-use';
import { Alert, AlertTitle, Button } from '@mui/material';
import { setupWalletActions } from 'redux/slices/setup-wallet';
import { Props } from 'types';

interface QrCodeReaderProps extends Props {
  onResult: (data: string) => void;
}

export default function QrCodeReader({ onResult }: QrCodeReaderProps) {
  const { t } = useTranslation();
  const cameraPermission = usePermission({ name: 'camera' });
  const dispatch = useDispatch();

  const goBack = () => {
    dispatch(setupWalletActions.clearRestoreWalletMethod());
  };

  return (
    <>
      <h3>{t<string>('Scan QR Code')}</h3>
      <p>
        {t<string>(
          'Export your Coong Wallet on a different device and scan the QR code on the screen to transfer your wallet.',
        )}
      </p>
      {cameraPermission === 'denied' ? (
        <Alert className='mt-4' severity='error'>
          <AlertTitle>{t<string>('Camera Permission Denied')}</AlertTitle>
          {t<string>(
            'Coong Wallet needs your permission to access the device camera to scan QR code. Please update the browser settings to allow camera access.',
          )}
        </Alert>
      ) : (
        <QrReader
          showViewFinder
          onScan={(data) => {
            data && onResult(data);
          }}
          onError={() => {}}
          facingMode='environment'
          className='w-full'
        />
      )}

      <div className='mt-4'>
        <Button onClick={goBack} color='gray' variant='text'>
          {t<string>('Back')}
        </Button>
      </div>
    </>
  );
}
