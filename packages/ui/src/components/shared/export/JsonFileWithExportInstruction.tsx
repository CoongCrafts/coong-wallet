import { useTranslation } from 'react-i18next';
import { JsonBackup } from '@coong/keyring/types';
import JsonFile from 'components/shared/export/JsonFile';
import { Props, TransferableObject } from 'types';

interface JsonFileWithExportInstructionProps extends Props {
  value: JsonBackup;
  object: TransferableObject;
}
function JsonFileWithExportInstruction({ value, object }: JsonFileWithExportInstructionProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <JsonFile
      value={value}
      object={object}
      topInstruction={
        <p className='mt-4 sm:px-20 text-center'>
          {t<string>(
            `Export this {{object}} to a JSON file and import it back to Coong Wallet on this or other devices later`,
            { object: t<string>(object.toLowerCase()) },
          )}
        </p>
      }
      bottomInstruction={
        <p className='mt-4 italic sm:px-20 text-sm text-center'>
          {t<string>(`You will be prompted to enter your wallet password to complete importing the {{object}}`, {
            object: t<string>(object.toLowerCase()),
          })}
        </p>
      }
    />
  );
}

export default JsonFileWithExportInstruction;
