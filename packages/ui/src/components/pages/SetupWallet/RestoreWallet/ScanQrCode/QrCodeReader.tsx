import { useTranslation } from 'react-i18next';
import { QrReader } from 'react-qr-reader';
import { useNavigate } from 'react-router-dom';
import { usePermission } from 'react-use';
import { Alert, AlertTitle, Button } from '@mui/material';
import QrCodeViewFinder from 'components/shared/misc/QrCodeViewFinder';
import useThemeMode from 'hooks/useThemeMode';
import { Props } from 'types';

interface QrCodeReaderProps extends Props {
  onResult: (data: string) => void;
}

export default function QrCodeReader({ onResult }: QrCodeReaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cameraPermission = usePermission({ name: 'camera' });
  const { dark } = useThemeMode();

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
          ViewFinder={QrCodeViewFinder}
          onResult={(result) => {
            const data = result?.getText();
            data && onResult(data);
          }}
          constraints={{ facingMode: 'user' }}
          className='w-full'
        />
      )}

      <div className='mt-4'>
        <Button onClick={() => navigate('/restore-wallet')} color={dark ? 'grayLight' : 'gray'} variant='text'>
          {t<string>('Back')}
        </Button>
      </div>
    </>
  );
}
