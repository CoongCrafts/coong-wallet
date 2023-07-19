import { useTranslation } from 'react-i18next';
import { QrBackup } from '@coong/keyring/types';
import QrCode from 'components/shared/export/QrCode';
import { Props, TransferableObject } from 'types';

interface QrCodeWithExportInstructionProps extends Props {
  value: QrBackup;
  object: TransferableObject;
}

function QrCodeWithExportInstruction({ value, object }: QrCodeWithExportInstructionProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <QrCode
      value={value}
      object={TransferableObject.Wallet}
      topInstruction={
        <p className='my-4 sm:px-20 text-center'>
          {t<string>('Open Coong Wallet on another device and scan this QR Code to transfer your {{object}}', {
            object: t<string>(object.toLowerCase()),
          })}
        </p>
      }
      bottomInstruction={
        <p className='my-4 italic sm:px-20 text-sm text-center'>
          {t<string>(
            'You will be prompted to enter your wallet password to complete the transfer process on the other device.',
          )}
        </p>
      }
    />
  );
}

export default QrCodeWithExportInstruction;
