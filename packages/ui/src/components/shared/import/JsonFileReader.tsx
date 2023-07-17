import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Button } from '@mui/material';
import { Props } from 'types';
import { isTouchDevice } from 'utils/device';

const touchDevice = isTouchDevice();

interface JsonFileReaderProps extends Props {
  onResult: (data: string) => void;
  showTitle?: boolean;
  goBack?: () => void;
}

function JsonFileReader({ onResult, showTitle, goBack }: JsonFileReaderProps): JSX.Element {
  const { t } = useTranslation();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onerror = () => toast.error(t<string>('File reading was failed!'));
      reader.onabort = () => toast.error(t<string>('File reading was aborted!'));
      reader.onload = () => {
        const data = reader.result;
        data && onResult(data as string);
      };

      reader.readAsText(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false });

  const getMessage = () => {
    if (touchDevice) return 'Click to select file';
    if (isDragActive) return 'Drop the file here...';
    return 'Click to select or drag and drop the file here';
  };

  return (
    <>
      {showTitle && <h3>{t<string>('Import JSON File')}</h3>}
      <div
        {...getRootProps({
          className: 'mt-6 w-full py-6 bg-black/10 dark:bg-white/15 cursor-pointer flex items-center justify-center',
        })}>
        <input {...getInputProps({ accept: 'application/json' })} />
        <em>{t<string>(getMessage())}</em>
      </div>
      {goBack && (
        <div className='mt-4'>
          <Button onClick={goBack} color='gray' variant='text'>
            {t<string>('Back')}
          </Button>
        </div>
      )}
    </>
  );
}
export default JsonFileReader;
